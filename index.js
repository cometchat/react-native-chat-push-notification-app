/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {CometChat} from '@cometchat/chat-sdk-react-native';
import messaging from '@react-native-firebase/messaging';
import {TokenRegisterHandler} from './utils/tokenRegisterHandler';
import {NotificationHandler} from './utils/notificationHandler';
import {navigate} from './src/StackNavigator';
import {AndroidStyle} from '@notifee/react-native';
import {SCREENS_CONSTANTS} from './src/CONSTS';
import {CometChatUIKit} from '@cometchat/chat-uikit-react-native';
import {COMETCHAT_CONSTANTS} from './src/CONSTS';

new TokenRegisterHandler();
new NotificationHandler();
let messageIds = [];
CometChatUIKit.init({
  appId: COMETCHAT_CONSTANTS.APP_ID,
  authKey: COMETCHAT_CONSTANTS.AUTH_KEY,
  region: COMETCHAT_CONSTANTS.REGION,
})
  .then(() => {
    if (CometChat.setSource) {
      CometChat.setSource('ui-kit', Platform.OS, 'react-native');
    }
  })
  .catch(() => {
    return null;
  });

messaging().onMessage(async message => {
  console.log('Message handled in the forground!', message);
  handleMessages(message);
});
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  handleMessages(remoteMessage, true);
});
handleMessages = (firebaseMessage, inbackground = false) => {
  try {
    let msg = firebaseMessage.data

    if (((msg.type == 'chat' && inbackground) || messageIds.filter(item => item === msg.tag).length)) {
      NotificationHandler.displayNotification({
        id: msg.tag,
        title: msg.title, 
        body: msg.body,
        data: {
          conversationId: msg.conversationId,
          senderUid: msg.sender,
          receiverType: msg.receiverType,
          guid: msg.receiver,
          receiver: msg.receiver
        },
        android: {largeIcon: msg.senderAvatar},
      });
      CometChat.markAsDelivered(msg);
      if(messageIds.length >= 10) {
        messageIds.splice(0, 1)
        messageIds.push(msg.tag);
      } else {
        messageIds.push(msg.tag);
      }
    }
    if (msg.type == 'call') {
      switch (msg.callAction) {
        case 'initiated':
          NotificationHandler.msg = msg;
          NotificationHandler.displayCallAndroid();
          break;
        case 'ended':
          CometChat.clearActiveCall();
          NotificationHandler.endCall(NotificationHandler.callerId);
          break;
        case 'unanswered':
          CometChat.clearActiveCall();
          NotificationHandler.removeCallDialerWithUUID(
            NotificationHandler.callerId,
          );
          break;
        case 'busy':
          CometChat.clearActiveCall();
          NotificationHandler.removeCallDialerWithUUID(
            NotificationHandler.callerId,
          );
          break;
        case 'ongoing':
          NotificationHandler.displayNotification({
            title: msg?.receiverName || '',
            body: 'ongoing call',
          });
          navigate({
            index: 0,
            routes: [
              {
                name: SCREENS_CONSTANTS.CALL,
                params: {call: msg, needReset: true},
              },
            ],
          });
          break;
        case 'rejected':
          CometChat.clearActiveCall();
          NotificationHandler.removeCallDialerWithUUID(
            NotificationHandler.callerId,
          );
          break;
        case 'cancelled':
          CometChat.clearActiveCall();
          NotificationHandler.removeCallDialerWithUUID(
            NotificationHandler.callerId,
          );
          break;
        default:
          break;
      }
      return;
    }
  } catch (e) {
    console.log(e);
  }
};
AppRegistry.registerComponent(appName, () => App);
