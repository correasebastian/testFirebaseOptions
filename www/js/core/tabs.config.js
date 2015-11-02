(function() {
    'use strict';

    angular
        .module('app.core')
        .config(Config);

    Config.$inject = ['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider'];

    /* @ngInject */
    function Config($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

        $ionicConfigProvider.tabs.position('top');


        $stateProvider

        // setup an abstract state for the tabs directive
            .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html',
            controller: 'AppController as AppCtrl'
        })


        .state('tab.dash', {
            url: '/dash',
            views: {
                'tab-dash': {
                    templateUrl: 'templates/tab-dash.html',
                    controller: 'DashCtrl',
                    resolve: {
                        //     // controller will not be loaded until $waitForAuth resolves
                        //     // Auth refers to our $firebaseAuth wrapper in the example above
                        "currentAuth": ["Auth",
                            function(Auth) {
                                // $waitForAuth returns a promise so the resolve waits for it to complete
                                return Auth.$waitForAuth();
                            }
                        ]
                    }
                }
            }
        })

        .state('tab.placas', {
                url: '/placas',
                views: {
                    'tab-placas': {
                        templateUrl: 'js/placas/tab-placas.html',
                        controller: 'Placas as PC',
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
                    /*,
                                        'fabContent': {
                                            template: '<button scm-fab delay="1000" id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                                            controller: function($timeout) {
                                                $timeout(function() {
                                                    // document.getElementById('fab-friends').classList.toggle('on');
                                                }, 900);
                                            }
                                        }*/
                }
            })
            .state('tab.placas-detail', {
                url: '/placas/:idinspeccion',
                views: {
                    'tab-placas': {
                        templateUrl: 'js/fotos/fotos-detail.html',
                        controller: 'FotosCtrl as FC'
                    }
                    /*,
                                        'fabContent': {
                                            template: '<button id="fab-gallery" class="button button-fab button-fab-top-right expanded button-energized-900 drop"><i class="icon ion-heart"></i></button>',
                                            controller: function($timeout) {
                                                $timeout(function() {
                                                    document.getElementById('fab-gallery').classList.toggle('on');
                                                }, 600);
                                            }
                                        }*/
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








    }
})();
