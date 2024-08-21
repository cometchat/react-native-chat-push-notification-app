<p align="center">
  <img alt="CometChat" src="https://assets.cometchat.io/website/images/logos/banner.png">
</p>

# React Native Enhanced Push Notifications (Beta) Sample App


The CometChat React Native [Enhanced Push Notifications (Beta)](https://www.cometchat.com/docs-beta/notifications/push-overview) Sample App is capable of handling push notifications for one-on-one (private), group messaging, and even call notifications. This sample app enables users to send and receive text messages, make and receive calls, and effectively displays push notifications for these interactions.


In our sample app:
- Firebase Cloud Messaging (FCM) is used for displaying push notifications in Android  
- Apple Push Notification (APN) is used for displaying push notifications in iOS.

> [!NOTE]
> If you use Push Notifications (Extension), please refer to our [React Native Push Notifications (Extension)](https://github.com/cometchat/cometchat-push-notification-app-react-native/tree/v4-push-notifications-extension) Sample app for guidance.

## Pre-requisite
1. Login to the [CometChat Dashboard](https://app.cometchat.com/).
2. Select an existing app or create a new one.
3. Click on the Notifications section from the menu on the left.
4. Enable Push Notifications by clicking on the toggle bar and configure the push notifications.
5. Add credentials for FCM or APNs.

## Run the Sample App
1. Clone this repository.
2. Run the following commands:
```
npm i -f
cd ios
pod install
cd ..
```
3. If you're using Firebase Cloud Messaging (FCM), place the `google-services.json` & `GoogleService-Info.plist` files in the correct location as per FCM's documentation.
4. Add your app credentials like `APP_ID`, `REGION`, and `AUTH_KEY` in the `src/CONSTS.ts` file.
5. Also store the `FCM_PROVIDER_ID` (in case you're using FCM) or `APNS_PROVIDER_ID` (in case you're using APNs) in `src/CONSTS.ts`.
6. Run the sample app
```
npm run android # To run the Android app
npm run ios # To run the iOS app
```
7. Once the app is running on your device or emulator, login with a user.(The iOS app has to be run on a device. The Android app can run on emulator or device.)
8. Allow the permission to display push notifications.
9. Put the app in the background or terminate it.
10. Send a message or call to the logged in user from another device.
11. You should see a push notification for a message and call notification for a call.
12. Tap on the notification to open the Sample app for message.
13. Tap on accept/decline on call notification to initiate or decline call.
</br>

## Help and Support
For issues running the project or integrating with our UI Kits, consult our [documentation](https://www.cometchat.com/docs-beta/notifications/push-overview) or create a [support ticket](https://help.cometchat.com/hc/en-us) or seek real-time support via the [CometChat Dashboard](https://app.cometchat.com/).