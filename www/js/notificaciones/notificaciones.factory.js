(function() {
    'use strict';

    angular
        .module('app.notificaciones')
        .factory('Notificaciones', Notificaciones);

    Notificaciones.$inject = ['Firebase'];

    /* @ngInject */
    function Notificaciones(Firebase) {
        var service = {
            func: func
        };
        return service;

        ////////////////

        function func() {
        }
    }
})();