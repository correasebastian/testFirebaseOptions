(function() {
    'use strict';

    angular
        .module('app.notificaciones')
        .factory('NotificacionesService', NotificacionesService);

    NotificacionesService.$inject = ['Firebase', 'FBROOT', '$q', '$firebaseArray', 'exception'];

    /* @ngInject */
    function NotificacionesService(Firebase, FBROOT, $q, $firebaseArray, exception) {
        var _newNotifications = null;
        var _notificationsRoot = null;
        var service = {
            func: func,
            getNumberOfNotifications: getNumberOfNotifications,
            getNewNotifications: getNewNotifications,
            setNotificationsRoot: setNotificationsRoot
        };
        return service;

        ////////////////

        function func() {}

        function getNewNotifications() {
            if (_newNotifications) {
                return $q.when(_newNotifications);
            }
            var query = _notificationsRoot.orderByChild("unread").equalTo(true);

            return $firebaseArray(query).$loaded()
                .then(onLoadedOk)
                .catch(exception.catcher('cant get array of notifications'));

            function onLoadedOk(data) {
                _newNotifications = data;
                return _newNotifications;
            }
        }

        function getNumberOfNotifications() {

            // este presenta un comportamiento raro, por que se come uno pa actualizar
            if (_newNotifications) {
                return $q.when(_newNotifications.length);
            }
            return getNewNotifications()
                .then(onGetNewNotifications);

            function onGetNewNotifications() {
                return _newNotifications.length;
            }

        }

        function setNotificationsRoot(uid) {
            _notificationsRoot = FBROOT.child('users').child(uid).child('notificaciones');
        }
    }
})();
