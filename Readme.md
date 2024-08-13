<p align="center">
  <img alt="CometChat" src="https://assets.cometchat.io/website/images/logos/banner.png">
</p>

# React Native Push Notification Sample App

CometChat Push Notification Sample App is a fully functional push notification app capable of one-on-one (private) and group messaging, and Calling. This sample app enables users to send and receive push notifications for text and multimedia messages like **images, videos, documents** and **Custom Messages**. Also, users can make push notifications for Audio and Video calls to other users or groups.

> [!NOTE]
> If you wish to try Enhanced Push Notifications, please refer to our [React Native Enhanced Push Notifications (Beta)](https://github.com/cometchat/cometchat-push-notification-app-react-native/tree/v4-enhanced-push-notification) sample app.

## Pre-requisite

1. Login to the <a href="https://app.cometchat.io/" target="_blank">CometChat Dashboard</a>.
2. Select an existing app or create a new one.
3. Under the Extensions section, enable Push Notifications.
4. Configure Push Notifications by saving the required FCM credentials.

## Run the Sample App in Android

 To Run the sample push notifications app, do the following changes:

   You can Obtain your  *google-services.json* from [Firebase Console](https://console.firebase.google.com/)

   - Open the project in Android Studio.
   
   - Add `google-services.json` in **app** directory

   - Build and run the Sample App `react-native run-android`.

## IOS Installation 
  
  To Run the sample push notifications app, do the following changes:
  
  For FCM you can obtain your  *GoogleServices.plist* from [Firebase Console](https://console.firebase.google.com/)
  
  - Open the project in Xcode and navigate to select your push notification configuration:
      - APNS + Callkit (Recommended)
      - Firebase
        
  - Create certificates for your bundle ID as mentioned in our [documentation](https://prodocs.cometchat.com/docs/ios-extensions-enhanced-push-notification).
    
  - Build and run the Sample App `react-native run-ios`.
  
## Note
   - CometChat provides two ways to implement push notifications for your IOS app. 
      - [Firebase](https://prodocs.cometchat.com/docs/ios-extensions-enhanced-push-notification)
      - [APNS (Supports Callkit)](https://prodocs.cometchat.com/docs/ios-extensions-enhanced-push-notification-apns)
      
## Help and Support
For issues running the project or integrating with our UI Kits, consult our [documentation](https://www.cometchat.com/docs/extensions/react-native-push-notifications) or create a [support ticket](https://help.cometchat.com/hc/en-us) or seek real-time support via the [CometChat Dashboard](https://app.cometchat.com/).

