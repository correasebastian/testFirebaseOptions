// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova', 'firebase', 'app.Auth', 'app.placas'])
    .constant('FBURL', 'https://scmtest.firebaseio.com/')
    .constant('Firebase', Firebase)
    .factory('FBROOT', ['Firebase', 'FBURL', function(Firebase, FBURL) {
        return new Firebase(FBURL);
    }])

.run(function($ionicPlatform, $state, $rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleLightContent();
        }
    });

    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireAuth promise is rejected
        // and redirect the user back to the home page
        console.log(error);
        if (error === "AUTH_REQUIRED") {
            $state.go("login");
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'templates/tabs.html'
    })

    // Each tab has its own nav history stack:

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


        })
        .state('tab.dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash.html',
                    controller: 'DashCtrl',
                    resolve: {
                        // controller will not be loaded until $requireAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ["Auth",
                            function(Auth) {
                                // $requireAuth returns a promise so the resolve waits for it to complete
                                // If the promise is rejected, it will throw a $stateChangeError (see above)
                                return Auth.$waitForAuth().then(function(data) {
                                    return data;
                                });
                            }
                        ]
                    }
                }
            }
        })

    .state('tab.chats', {
            url: '/chats',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/tab-chats.html',
                    controller: 'ChatsCtrl',
                    resolve: {

                        /*// Example using function with simple return value.
                        // Since it's not a promise, it resolves immediately.
                        simpleObj: function(authMock) {
                           return authMock.auth();
                        }*/

                        // controller will not be loaded until $waitForAuth resolves
                        // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ["Auth",
                            function(Auth) {
                                // $waitForAuth returns a promise so the resolve waits for it to complete
                                return Auth.$requireAuth();
                            }
                        ]
                    }
                }
            }
        })
        .state('tab.chat-detail', {
            url: '/chats/:chatId',
            views: {
                'tab-chats': {
                    templateUrl: 'templates/chat-detail.html',
                    controller: 'ChatDetailCtrl'
                }
            }
        })

    .state('tab.account', {
        url: '/account',
        views: {
            'tab-account': {
                templateUrl: 'templates/tab-account.html',
                controller: 'AccountCtrl',
                resolve: {

                    /*// Example using function with simple return value.
                    // Since it's not a promise, it resolves immediately.
                    simpleObj: function(authMock) {
                       return authMock.auth();
                    }*/

                    // controller will not be loaded until $waitForAuth resolves
                    // Auth refers to our $firebaseAuth wrapper in the example above
                    "currentAuth": ["Auth",
                        function(Auth) {
                            // $waitForAuth returns a promise so the resolve waits for it to complete
                            return Auth.$requireAuth();
                        }
                    ]
                }
            }
        }
    });

    // if none of the above states are matched, use this as the fallback

    /* FIJARME CUAL FUNCIONA MEJOR*/

    $urlRouterProvider.otherwise('/tab/dash');

    /* se va a un estado intermedio que no me gusta*/
    // $stateProvider.state("otherwise", {
    //        url: "*path",
    //        template: "",
    //        controller: [
    //                  '$state',
    //          function($state) {
    //            $state.go('tab.dash');
    //          }]
    //    });

});
