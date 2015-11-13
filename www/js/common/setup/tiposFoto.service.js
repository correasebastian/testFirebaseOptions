(function() {
    'use strict';

    angular
        .module('common.appSetup')
        .factory('TiposFotos', TiposFotos);

    TiposFotos.$inject = ['FBROOT', '$firebaseArray'];

    /* @ngInject */
    function TiposFotos(FBROOT,$firebaseArray) {
        var fArray= $firebaseArray(FBROOT.child('config').child('tiposFoto'));
        return fArray;

    }
})();