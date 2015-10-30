(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$rootScope', '$ionicPlatform', '$timeout', '$cordovaNetwork'];

    /* @ngInject */
    function AppController($scope, $rootScope, $ionicPlatform, $timeout, $cordovaNetwork) {
        var vm = this;
        vm.title = 'AppController';

        activate();

        ////////////////

        function activate() {}




        $ionicPlatform.ready(function() {

            function isOnline() {

                function checkIsonline() {
                    if ($cordovaNetwork.isOnline()) {
                        vm.isOnline = true;
                        vm.msg = 'online';

                    } else {
                        vm.isOnline = false;
                        vm.msg = 'offline';

                    }
                }
                $timeout(checkIsonline);
            }

            // listen for Online event
            $scope.$on('$cordovaNetwork:online', function(event, networkState) {
                console.log('online', networkState);
                isOnline();
            });

            // listen for Offline event
            $scope.$on('$cordovaNetwork:offline', function(event, networkState) {
                console.log('offline --->>', networkState);
                isOnline();
            });


            $scope.$on('custom', function(event, data) {
                $timeout(function() {
                    console.log(data);
                    vm.msg = 'custom';
                });
            });


            /*habilitarlo para cuando este en mobile, si estoy en serve tira error por no encontrar cordova*/
            isOnline();


        });
    }
})();
