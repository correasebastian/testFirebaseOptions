(function() {
    'use strict';

    angular
        .module('app.core')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', 'notificationsConfigProvider'];

    /* @ngInject */
    function Config($stateProvider, $urlRouterProvider, $ionicConfigProvider, notificationsConfigProvider) {

        $ionicConfigProvider.tabs.position('top');


        // auto hide
        notificationsConfigProvider.setAutoHide(true);

        // delay before hide
        notificationsConfigProvider.setHideDelay(3000);

        // support HTML
        notificationsConfigProvider.setAcceptHTML(false);
/*
        // Set an animation for hiding the notification
        notificationsConfigProvider.setAutoHideAnimation('fadeOutNotifications');

        // delay between animation and removing the nofitication
        notificationsConfigProvider.setAutoHideAnimationDelay(1200);
*/
        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider




            .state('login', {
            url: '/login',

            templateUrl: 'templates/login.html',
            controller: 'loginCtrl',
            resolve: {

                // Example using function with simple return value.
                // Since it's not a promise, it resolves immediately.
                simpleObj: function(authMock) {
                    return authMock.auth();
                }

                //     // controller will not be loaded until $waitForAuth resolves
                //     // Auth refers to our $firebaseAuth wrapper in the example above
                //     "currentAuth": ["Auth",
                //         function(Auth) {
                //             // $waitForAuth returns a promise so the resolve waits for it to complete
                //             return Auth.$waitForAuth();
                //         }
                //     ]
            }


        });


        // if none of the above states are matched, use this as the fallback

        /* FIJARME CUAL FUNCIONA MEJOR*/

        $urlRouterProvider.otherwise('/tab/placas');

        // /* se va a un estado intermedio que no me gusta*/
        // $stateProvider.state("otherwise", {
        //        url: "*path",
        //        template: "",
        //        controller: [
        //                  '$state',
        //          function($state) {
        //            $state.go('tab.placas');
        //          }]
        //    });




    }
})();
