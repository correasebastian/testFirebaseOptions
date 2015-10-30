(function() {
    'use strict';

    angular
        .module('app.auth')
        .factory('Auth', Auth);

    Auth.$inject = ['$firebaseAuth', 'FBROOT'];

    /* @ngInject */
    function Auth($firebaseAuth, FBROOT) {
        return $firebaseAuth(FBROOT);
    }
})();
