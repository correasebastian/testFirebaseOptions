(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$rootScope', '$ionicPlatform', '$timeout', '$cordovaNetwork', 'logger', 'isMobileTest'];

    /* @ngInject */
    function AppController($scope, $rootScope, $ionicPlatform, $timeout, $cordovaNetwork, logger, isMobileTest) {
        var vm = this;
        vm.title = 'AppController';
        vm.isExpanded = true;
        vm.hasHeaderFabRight = true;
        vm.hasHeaderFabLeft = true;
        vm.fireMainAction = fireMainAction;
        vm.setExtended = setExtended;
        
        vm.setMobileTest = setMobileTest;

        activate();

        ////////////////

        function activate() {

            vm.mobileTest = isMobileTest;

       /*     var isIOS = ionic.Platform.isIOS();
            var isAndroid = ionic.Platform.isAndroid();
            console.log('verificando si funciona antes de platfrom ready', isAndroid, isIOS);

            if (isAndroid) {

                vm.mobileTest = true;
                logger.success('android', mobileTest);
            }
            if (isIOS) {
                logger.success('Ios');
                vm.mobileTest = true;

            }*/

        }

        function setExtended(bool) {
            vm.isExpanded = bool;
        }

        function setMobileTest(bool) {
            vm.mobileTest = bool;
        }

        function fireMainAction() {
            logger.success('click on menu ' + vm.menuState);
        }


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

            if (vm.mobileTest) {
                isOnline();
            }



        });
    }
})();
