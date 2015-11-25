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
            // userGroupMode: null,
            userID: null,
            userConfig: null,
            reset:reset
        };
        return service;

        ////////////////

        function reset (){

            service.userGroups= null;         
            service.userID= null;
            service.userConfig= null;

        }

        function getInfoUser_v1(userId) {
            service.userID = userId;
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

        function getInfoUser(userId) {
            if (service.userConfig) {
                return $q.when(true); // ya esta cargado no es necesario volver a hacerlo
            }


            /*return getUserConfig(userId)
                .then(getUserGroups);*/

            // asi llamaria despues a GetUserGroups pero tambien lo puedo traer en congig
            /*    .then(onGetUserInfo);

            function onGetUserInfo(data) {
                service.userConfig = data;
                return true; // solo por encadenar la promesa, la verdad no necesito ninguna info
            }*/

            //voy a probar con 4q.all me parece que se ve mejor
            var promises = [
                getUserConfig(userId),
                getUserGroups(userId),
                getUserMainData(userId)
            ];

            return $q.all(promises)
                .then(allPromisesCompleted);

            function allPromisesCompleted() {
                logger.info('getInfoUser activado');
            }

        }


        function getUserConfig(userId) {
            var query = FBROOT.child('users').child(userId).child('config');
            return $firebaseObject(query).$loaded()
                .then(onGetUserConfig)
                .catch(exception.catcher("cant get userConfig"));

            function onGetUserConfig(data) {
                // service.userConfig = data; //.enable;
                //si no tiene un grupo default por defecto se vaya al modo infdividual
                if (!data.defaultGroup) {
                    data.groupMode = false;
                    data.$save();
                }
                service.userConfig = data;
                return userId; // para encadenar me sirva mas el userId //service.userConfig;
                // return data;
            }
        }

        function getUserGroups(userId) {

            if(service.userGroups){
                return $q.when(service.userGroups);
            }
            var query = FBROOT.child('users').child(userId).child('groups').orderByKey(); //.limitToLast(1);

            return $firebaseArray(query).$loaded()
                .then(onGetGroups)
                .catch(exception.catcher("cant get userGroups"));

            function onGetGroups(data) {
                /* if (!data[0]) {
                     service.userConfig.groupMode = false;
                     service.userConfig.$save();
                 }
                 service.userGroups = data[0] || {};*/
                service.userGroups = data;
                // return service.userGroups;// no es necesario devolver la informacion
                // return true; //solo por devolver algo y encadenar
                return service.userGroups;
            }

        }

        function getUserMainData(userId) {
            var query = FBROOT.child('users').child(userId).child('mainData');
            return $firebaseObject(query).$loaded()
                .then(onGetMainData)
                .catch(exception.catcher("cant get mainData"));

            function onGetMainData(data) {
                /* if (!data[0]) {
                     service.userConfig.groupMode = false;
                     service.userConfig.$save();
                 }
                 service.userGroups = data[0] || {};*/
                service.mainData = data;
                // return service.userGroups;// no es necesario devolver la informacion
                return true; //solo por devolver algo y encadenar
            }

        }

        /*  function getGroupMode(userId) {
              var query = FBROOT.child('users').child(userId).child('groupMode');
              return $firebaseObject(query).$loaded()
                  .then(onGetGroupMode)
                  .catch(exception.catcher("cant get groupMode"));

              function onGetGroupMode(data) {
                  service.userGroupMode = data; //.enable;
                  return service.userGroupMode;
              }
          }*/
    }
})();
