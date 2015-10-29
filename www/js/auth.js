(function() {
    'use strict';

    angular
        .module('app.Auth',[])
        .factory('Auth', Auth);

    Auth.$inject = ['$firebaseAuth', 'FBROOT'];

    /* @ngInject */
    function Auth($firebaseAuth, FBROOT) {
        return $firebaseAuth(FBROOT);
    }
})();
