import React, { useEffect, useState } from "react";
import { CometChatConversationsWithMessages, CometChatUIKit } from "@cometchat/chat-uikit-react-native";
import { CometChat, CometChatNotifications } from "@cometchat/chat-sdk-react-native";
import { LogOut } from "../../resources";
import { SCREENS_CONSTANTS } from "../../CONSTS";

const ConversationsWithMessages = ({ navigation, route }: any) => {
  const [user, setUser] = useState<any>();
  const [group, setGroup] = useState<any>();
  const { params } = route;

  const conversationsConfiguration = {
    showBackButton: true,
    backButtonIcon: LogOut,
    onBack: () => {
      CometChatNotifications.unregisterPushToken().then(res => {
        console.log('Push token unregistered.', res);
      })
      CometChatUIKit.logout().then(() => {
        console.log('Successfully logged out.');
        
      })
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [
            {
              name: SCREENS_CONSTANTS.LOGIN,
            },
          ],
        })
      }, 1000)
    },
  }

  useEffect(() => {
    if (params && params.receiverType === "user" && params.senderUid) {
      CometChat.getUser(params.senderUid).then((user) => {
        setUser(user);
      });
    } else if (params && params.receiverType === "group") {
      CometChat.getGroup(params.guid).then((group) => {
        setGroup(group);
      });
    }
  }, []);

  if (user)
    return (
      <CometChatConversationsWithMessages
        user={user}
        conversationsConfiguration={conversationsConfiguration}
      />
    );
  if (group)
    return (
      <CometChatConversationsWithMessages
        group={group}
        conversationsConfiguration={conversationsConfiguration}
      />
    );
    return (
      <CometChatConversationsWithMessages
        conversationsConfiguration={conversationsConfiguration}
      />
    );
};

export default ConversationsWithMessages;
