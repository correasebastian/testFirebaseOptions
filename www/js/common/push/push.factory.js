(function() {
    'use strict';

    angular
        .module('common.push')
        .factory('PushF', PushF);

    PushF.$inject = ['logger', '$ionicPlatform', 'FBROOT', 'UserInfo', 'exception'];

    /* @ngInject */
    function PushF(logger, $ionicPlatform, FBROOT, UserInfo, exception) {
        var service = {
            register: register
        };
        return service;

        ////////////////

        function register(uid) {

            $ionicPlatform.ready(function() {

                var push = new Ionic.Push({
                    "debug": false,
                    "onNotification": function(notification) {
                        var payload = notification.payload;
                        logger.info('notification', notification);
                    },

                    "pluginConfig": {
                        "ios": {
                            "badge": true,
                            "sound": true
                        },
                        "android": {
                            "iconColor": "#343434"
                        }
                    }
                });

                push.register(function(token) {
                  

                    var updatedPushToken = {};
                    updatedPushToken["users/" + uid + '/mainData/pushToken'] = token.token;
                    /*  updatedPushToken["posts/" + newPostKey] = {
                          title: "New Post",
                          content: "Here is my new post!"
                      };*/

                    /*  FBROOT.child('users').child(uid).child('mainData')
                          .update({
                              'pushToken': token.token
                          }, onComplete);*/

                    UserInfo.getUserGroups(uid)
                        .then(function(groups) {
                            
                            groups.forEach(function(group) {
                                updatedPushToken["groups/" + group.$id + "/pushTokens/" + uid + '/token'] = token.token;
                                logger.log('group', group);
                            });

                            //atomic operatin
                            FBROOT.update(updatedPushToken, exception.fbCatcher('ingresando pushToken'));

                        });




                    // console.log(token);
                    logger.info("Device token:", token.token);
                });
            });
        }
    }
})();
