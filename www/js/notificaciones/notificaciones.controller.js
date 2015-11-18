(function() {
    'use strict';

    angular
        .module('app.notificaciones')
        .controller('Notificaciones', Notificaciones);

    Notificaciones.$inject = ['currentAuth', '$scope'];

    /* @ngInject */
    function Notificaciones(currentAuth, $scope) {
        var vm = this;
        vm.title = 'Notificaciones';

        activate();

        ////////////////

        function activate() {

            resetBadge();
        }

        function resetBadge() {
            $scope.$emit('scmResetNotificationsBadge', {
                name: "juliana"
            });

        }
    }
})();
