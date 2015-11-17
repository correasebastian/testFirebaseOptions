(function() {
    'use strict';

    angular
        .module('app.auth')
        .factory('UserInfo', UserInfo);

    UserInfo.$inject = ['$firebaseArray', 'FBROOT', '$firebaseObject', '$q', 'logger', 'exception'];

    /* @ngInject */
    function UserInfo($firebaseArray, FBROOT, $firebaseObject, $q, logger, exception) {
      
        var service = {
            getInfoUser: getInfoUser,
            getUserGroups: getUserGroups,
            userGroups: null,
            userGroupMode: null,
            userID:null
        };
        return service;

        ////////////////

        function getInfoUser(userId) {
        	service.userID=userId;
            var promises = [
                getGroupMode(userId),
                getUserGroups(userId)
            ];
            return $q.all(promises)
                .then(allPromisesCompleted);

            function allPromisesCompleted() {
                logger.info('getInfoUser activado');
            }

        }

        function getGroupMode(userId) {
            var query = FBROOT.child('users').child(userId).child('groupMode');
            return $firebaseObject(query).$loaded()
                .then(onGetGroupMode)
                .catch(exception.catcher("cant get groupMode"));

            function onGetGroupMode(data) {
                service.userGroupMode = data;//.enable;
                return service.userGroupMode;
            }
        }

        function getUserGroups(userId) {
            var query = FBROOT.child('users').child(userId).child('groups').orderByKey().limitToLast(1);

            return $firebaseArray(query).$loaded()
                .then(onGetGroups)
                .catch(exception.catcher("cant get userGroups"));

            function onGetGroups(data) {
                if (!data[0]){
                    service.userGroupMode=false;
                }
                service.userGroups = data[0]|| {};
                return service.userGroups;
            }

        }
    }
})();
