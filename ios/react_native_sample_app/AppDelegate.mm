#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

#import <PushKit/PushKit.h>
#import "RNVoipPushNotificationManager.h"

#import "RNCallKeep.h"
#import <Firebase.h>


@implementation AppDelegate
- (void)pushRegistry:(PKPushRegistry *)registry didUpdatePushCredentials:(PKPushCredentials *)credentials forType:(PKPushType)type {
  // Register VoIP push token (a property of PKPushCredentials) with server
  
  [RNVoipPushNotificationManager didUpdatePushCredentials:credentials forType:(NSString *)type];
}

- (void)pushRegistry:(PKPushRegistry *)registry didInvalidatePushTokenForType:(PKPushType)type
{
  NSLog(@"dummy");
  // --- The system calls this method when a previously provided push token is no longer valid for use. No action is necessary on your part to reregister the push type. Instead, use this method to notify your server not to send push notifications using the matching push token.
}


// --- Handle incoming pushes
- (void)pushRegistry:(PKPushRegistry *)registry didReceiveIncomingPushWithPayload:(PKPushPayload *)payload forType:(PKPushType)type withCompletionHandler:(void (^)(void))completion {
  NSLog(@"didReceiveIncomingPushWithPayload with payload: %@", payload.dictionaryPayload);

  // Extract call action, type, sender and receiver info from the payload
  NSString *callAction = [payload.dictionaryPayload objectForKey:@"callAction"];
  NSString *callType = [payload.dictionaryPayload objectForKey:@"callType"];
  NSString *sender = [payload.dictionaryPayload objectForKey:@"sender"];
  NSString *senderName = [payload.dictionaryPayload objectForKey:@"senderName"];
  
  // uuid for the call
  NSString *uuid = [[NSUUID UUID] UUIDString];
  
  // Process the received push
  [RNVoipPushNotificationManager didReceiveIncomingPushWithPayload:payload forType:(NSString *)type];
  
  // Determine the action to take based on callAction value
  if ([callAction isEqualToString:@"initiated"]) {
      NSLog(@"Call is initiated by %@", senderName);
      
      BOOL hasVideo = [callType isEqualToString:@"video"]; // Determine if the call is audio or video
      
      // Report the incoming call to CallKit
      [RNCallKeep reportNewIncomingCall: uuid
                                 handle: sender
                             handleType: @"generic"
                               hasVideo: hasVideo
                    localizedCallerName: senderName
                        supportsHolding: YES
                           supportsDTMF: YES
                       supportsGrouping: YES
                     supportsUngrouping: YES
                            fromPushKit: YES
                                payload: payload.dictionaryPayload
                  withCompletionHandler: completion];
      
  } else if ([callAction isEqualToString:@"unanswered"]) {
      // Your code for handling 'unanswered' action
      NSLog(@"Action is unanswered.");
      [RNCallKeep endCallWithUUID:uuid reason:3];
    
  } else if ([callAction isEqualToString:@"rejected"]) {
      // Your code for handling 'rejected' action
      NSLog(@"Action is rejected.");
      [RNCallKeep endCallWithUUID:uuid reason:6];
    
  } else if ([callAction isEqualToString:@"busy"]){
      // Unknown action, handle accordingly
      NSLog(@"Action is rejected.");
      [RNCallKeep endCallWithUUID:uuid reason:1];
    
  } else if ([callAction isEqualToString:@"cancelled"]){
      // Unknown action, handle accordingly
      NSLog(@"Action is cancelled.");
      [RNCallKeep endCallWithUUID:uuid reason:6];
  
  } else if ([callAction isEqualToString:@"ended"]){
      // Unknown action, handle accordingly
      NSLog(@"Action is ended.");
      [RNCallKeep endCallWithUUID:uuid reason:2];

  } else {
      NSLog(@"Unknown action is not initiated.");

      // report a call with dummy data and end it immediately
     
       [RNCallKeep endCallWithUUID:uuid reason:3];
  }
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"react_native_sample_app";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  [FIRApp configure];
  [RNVoipPushNotificationManager voipRegistration];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
