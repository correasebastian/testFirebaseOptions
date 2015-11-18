(function() {
    'use strict';

    angular
        .module('app.notificaciones')
        .controller('Notificaciones', Notificaciones);

    Notificaciones.$inject = ['currentAuth', '$scope', 'NotificacionesService'];

    /* @ngInject */
    function Notificaciones(currentAuth, $scope, NotificacionesService) {
        var vm = this;
        vm.title = 'Notificaciones';

        activate();

        ////////////////

        function activate() {

            resetBadge();

            NotificacionesService.getNewNotifications()
                .then(onGetNotifications);

            function onGetNotifications(data) {
                vm.newNotifications = data;
            }

            NotificacionesService.getOldNotifications()
                .then(onGetOldNotifications);

            function onGetOldNotifications(data) {
                vm.oldNotifications = data;
            }


        }

        function resetBadge() {
            // not working fine in tabs
            /*    $scope.$on('$ionicView.beforeLeave', function() {
                    alert("Before Leaving");
                });

                $scope.$on('$ionicView.leave', function() {
                    alert("$ionicView.leave");
                });
                $scope.$on('$ionicView.enter', function() {
                    alert("$ionicView.enter");
                });

                $scope.$on('$ionicView.afterLeave', function() {
                    alert("$ionicView.afterLeave");
                });*/

            /* $scope.$emit('scmResetNotificationsBadge', {
                 name: "juliana"
             });*/

            $scope.$on('$destroy', function() {
                // alert("In destroy of:");
                NotificacionesService.setRead();
                $scope.$emit('scmResetNotificationsBadge', {
                    name: "juliana"
                });
            });

        }
    }
})();
