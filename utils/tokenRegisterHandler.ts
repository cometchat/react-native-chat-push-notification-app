import { CometChat, CometChatNotifications } from "@cometchat/chat-sdk-react-native";
import { Platform } from "react-native";
import messaging from "@react-native-firebase/messaging";
import VoipPushNotification from "react-native-voip-push-notification";
import { COMETCHAT_CONSTANTS } from "../src/CONSTS";
export class TokenRegisterHandler {
  static FCMToken: string;
  static VOIPToken: string;
  static APNSToken: string;
  static isLoggedIn: boolean;
  static isUsingAPNS: boolean = true;
  constructor() {
    TokenRegisterHandler.checkLoggedInUser();
    TokenRegisterHandler.addLoginListener();
    TokenRegisterHandler.addVOIPListener();
  }

  static checkLoggedInUser = async () => {
    let user = await CometChat.getLoggedinUser().catch((err) => {
      setTimeout(() => {
        TokenRegisterHandler.checkLoggedInUser();
      }, 1000);
    });
    if (user) {
      TokenRegisterHandler.isLoggedIn = true;
      TokenRegisterHandler.registerToken();
    }
  };

  static addLoginListener = () => {
    var listenerID = "UNIQUE_LISTENER_ID";
    CometChat.addLoginListener(
      listenerID,
      new CometChat.LoginListener({
        loginSuccess: (e: any) => {
          TokenRegisterHandler.isLoggedIn = true;
          TokenRegisterHandler.registerToken();
        },
      })
    );
  };

  static addVOIPListener = () => {
    VoipPushNotification.addEventListener("register", async (token) => {
      TokenRegisterHandler.VOIPToken = token;
      TokenRegisterHandler.registerTokenToCometChat();
    });
  };

  static registerToken = async () => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        if (Platform.OS == "android") {
          let FCM = await messaging().getToken();
          TokenRegisterHandler.FCMToken = FCM;
          TokenRegisterHandler.registerTokenToCometChat();
        } else {
          if (!messaging().isDeviceRegisteredForRemoteMessages)
            await messaging().registerDeviceForRemoteMessages().then(async (res)=>{
              let APNSToken = await messaging().getAPNSToken();
          });
          if (TokenRegisterHandler.isUsingAPNS) {
            VoipPushNotification.registerVoipToken();

            let APNSToken = await messaging().getAPNSToken();
            if (APNSToken) {
              TokenRegisterHandler.APNSToken = APNSToken;
              TokenRegisterHandler.registerTokenToCometChat();
            }
          } else {
            let FCM = await messaging().getToken();
            TokenRegisterHandler.FCMToken = FCM;
            TokenRegisterHandler.registerTokenToCometChat();
          }
        }
      }
    } catch (error) {}
  };

  static registerTokenToCometChat = async () => {
    if (!TokenRegisterHandler.isLoggedIn) {
      return false;
    }

    try {
      if (Platform.OS == "android") {
        if (TokenRegisterHandler.FCMToken) {
          let response = await CometChatNotifications.registerPushToken(
            TokenRegisterHandler.FCMToken,
            CometChatNotifications.PushPlatforms.FCM_REACT_NATIVE_ANDROID,
            COMETCHAT_CONSTANTS.FCM_PROVIDER_ID
          );
          console.log('TokenRegisterHandler.FCMToken',TokenRegisterHandler.FCMToken, response);
        }
      } else {
        if (TokenRegisterHandler.FCMToken) {
          
          let response = await CometChatNotifications.registerPushToken(
            TokenRegisterHandler.FCMToken,
            CometChatNotifications.PushPlatforms.FCM_REACT_NATIVE_IOS,
            COMETCHAT_CONSTANTS.FCM_PROVIDER_ID
          );
        }
        if (TokenRegisterHandler.isUsingAPNS) {
          if (TokenRegisterHandler.VOIPToken) {
            let response = await CometChatNotifications.registerPushToken(
              TokenRegisterHandler.VOIPToken,
              CometChatNotifications.PushPlatforms.APNS_REACT_NATIVE_VOIP,
              COMETCHAT_CONSTANTS.APNS_PROVIDER_ID
          );
            console.log('TokenRegisterHandler.VOIPToken',TokenRegisterHandler.VOIPToken, response);
        }
          if (TokenRegisterHandler.APNSToken) {
            let response = await CometChatNotifications.registerPushToken(
              TokenRegisterHandler.APNSToken,
              CometChatNotifications.PushPlatforms.APNS_REACT_NATIVE_DEVICE,
              COMETCHAT_CONSTANTS.APNS_PROVIDER_ID
            );
            console.log('TokenRegisterHandler.APNSToken',TokenRegisterHandler.APNSToken, response);
        }
        }
      }
    } catch (error) {}
  };
}
