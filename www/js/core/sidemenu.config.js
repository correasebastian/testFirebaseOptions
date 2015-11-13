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


            .state('app', {
            url: '/app',
            abstract: true,
            templateUrl: 'templates/menu.html',
            controller: 'AppController as AppCtrl'
        })

        .state('app.activity', {
            url: '/activity',
            views: {
                'menuContent': {
                    templateUrl: 'js/mfb/mfb-example.html',
                    controller: 'MfbController as MfbC'
                }
            }
        })

        .state('app.placas', {
                url: '/placas',
                views: {
                    'menuContent': {
                        templateUrl: 'js/placas/placas_simple.html',//'js/placas/app-placas.html',
                        /*no era necesario con el de las tabs me funcionaria, depende, por que el enlace me tira a tabs, tendria que configurar algo en el config de angular para decidir entre tabs y sidemenu*/
                        controller: 'Placas as PC',
                        resolve: {

                            "currentAuth": ["Auth",
                                function(Auth) {
                                    // $waitForAuth returns a promise so the resolve waits for it to complete
                                    return Auth.$requireAuth();
                                }
                            ]
                        }
                    }/*,
                    'fabContent': {
                        template: '<button scm-fab delay="2000" id="fab-friends" class="button button-fab button-fab-top-left expanded button-energized-900 spin"><i class="icon ion-chatbubbles"></i></button>',
                        controller: 'Placas as PC',
                           resolve: {

                            "currentAuth": ["Auth",
                                function(Auth) {
                                    // $waitForAuth returns a promise so the resolve waits for it to complete
                                    return Auth.$requireAuth();
                                }
                            ]
                        }
                    }*/

                }
            })
            .state('app.placas-detail', {
                url: '/placas/:idinspeccion',
                views: {
                    'menuContent': {
                        templateUrl: 'js/fotos/fotos-detail.html',
                        controller: 'FotosCtrl as FC'
                    }

                }
            })


        .state('app.account', {
            url: '/account',
            views: {
                'menuContent': {
                    templateUrl: 'templates/tab-account.html',
                    controller: 'AccountCtrl',
                    resolve: {

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
