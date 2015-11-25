(function() {
    'use strict';

    angular
        .module('app.core')
        .controller('AppController', AppController);

    AppController.$inject = ['$scope', '$rootScope', '$ionicPlatform', '$timeout',
        '$cordovaNetwork', 'logger', 'isMobileTest', 'Auth', 'FBROOT', 'NotificacionesService'
    ];

    /* @ngInject */
    function AppController($scope, $rootScope, $ionicPlatform, $timeout,
        $cordovaNetwork, logger, isMobileTest, Auth, FBROOT, NotificacionesService) {
        var vm = this;
        vm.title = 'AppController';
        vm.isExpanded = true;
        vm.isOnline = true; //para inicializrla no mas
        vm.hasHeaderFabRight = true;
        vm.hasHeaderFabLeft = true;
        vm.fireMainAction = fireMainAction;
        vm.setExtended = setExtended;
        vm.hasFocus = false;
        vm.numberOfNotifications = 0;

        vm.setMobileTest = setMobileTest;

        activate();

        ////////////////

        function activate() {

            vm.mobileTest = isMobileTest.get();

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
            listenNotifications();

        }

        function setExtended(bool) {
            vm.isExpanded = bool;
        }

        function setMobileTest(bool) {
            isMobileTest.set(bool);
            vm.mobileTest = isMobileTest.get();
        }

        function fireMainAction() {
            logger.success('click on menu ' + vm.menuState);
        }

        function listenNotifications() {
            $scope.$on('scmResetNotificationsBadge', function(event, data) {
                $timeout(function() {
                    console.log('resetBadge');
                    vm.numberOfNotifications = 0;
                });
            });
            Auth.$waitForAuth()
                .then(function(authData) {



                    // esto siempre devuelve una promesa, pero si tiene informacion es que esta autenticado, por ahora lo dejo aca, pero seria mejor en el run


                    if (authData) {
                        console.log('listenNotifications', authData);
                        NotificacionesService.setNotificationsRoot(authData.uid);

                        //tiene que ir despues del set
                        // getNumberOfNotifications();



                        var rootNotification = FBROOT.child('users').child(authData.uid).child('notificaciones');


                        /*    rootNotification.orderByChild("unread").equalTo(true)
                                .once('value', getInitNotifications);

                            function getInitNotifications(snap) {
                                console.log('notificaciones iniciales', snap.numChildren());
                                vm.numberOfNotifications = snap.numChildren();
                            }*/

                        rootNotification.orderByChild("unread").equalTo(true)
                            .on("child_added", addOne);



                    }

                    function addOne(snap) {
                        console.log('notificacion add', snap.val());
                        // este timeour no se si es necesario por que estamos en controllerAS
                        $timeout(function() {
                            vm.numberOfNotifications += 1;
                        });

                        //presenta algo raro, se come un numeto
                        // getNumberOfNotifications();

                    }




                });
        }

        function getNumberOfNotifications() {

            NotificacionesService.getNumberOfNotifications()
                .then(onGetNumberOfNotifications);

            function onGetNumberOfNotifications(numero) {
                console.log('onGetNumberOfNotifications', numero);
                vm.numberOfNotifications = numero;
            }

        }


        ///cuando la plataforma este ready

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
            } else {
                vm.isOnline = true;
            }



        });

        /////////////fin controlador

    }
})();
