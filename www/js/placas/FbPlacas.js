(function() {
    'use strict';

    angular
        .module('app.placas')
        .factory('FbPlacas', FbPlacas);

    FbPlacas.$inject = ['$firebaseArray', 'FBROOT', 'UserInfo'];

    /* @ngInject */
    function FbPlacas($firebaseArray, FBROOT, UserInfo) {
        var ngArrayFb;

        var factory = {
            getArray: getArray,
            setArrayPlacas: setArrayPlacas

        };
        return factory;

        function getArray() {

            return ngArrayFb;
        }

        function setArrayPlacas(uid, lastNumber) {

            lastNumber = parseInt(lastNumber) || 5;
            var query = null;
            if (UserInfo.userConfig.groupMode) {
                // var mainGroup=UserInfo.userConfig.group.$id;
                var mainGroup = UserInfo.userConfig.defaultGroup;
                query = FBROOT.child('groups').child(mainGroup).child('inspecciones').orderByKey().limitToLast(lastNumber);

            } else {
                query = FBROOT.child('users').child(uid).child('inspecciones').orderByKey().limitToLast(lastNumber);
            }

            ngArrayFb = $firebaseArray(query);
        }
    }
})();
