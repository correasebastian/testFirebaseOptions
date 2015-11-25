(function() {
    'use strict';

    angular
        .module('common.push')
        .factory('PushF', PushF);

    PushF.$inject = ['logger', '$ionicPlatform', 'FBROOT'];

    /* @ngInject */
    function PushF(logger, $ionicPlatform, FBROOT) {
        var service = {
            register: register
        };
        return service;

        ////////////////

        function register(uid) {

            $ionicPlatform.ready(function() {

                var push = new Ionic.Push({
                    "debug": true,
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
                    var onComplete = function(error) {
                        if (error) {
                            console.log('Synchronization failed updating token');
                        } else {
                            console.log('Synchronization succeeded');
                        }
                    };

                    FBROOT.child('users').child(uid).child('mainData')
                        .update({
                            'pushToken': token.token
                        }, onComplete);
                    console.log(token);
                    logger.info("Device token:", token.token);
                });
            });
        }
    }
})();
