(function() {
    'use strict';

    angular
        .module('app.fotos')
        .factory('FbFotos', FbFotos);

    FbFotos.$inject = ['$firebaseArray','FBROOT'];

    /* @ngInject */
    function FbFotos($firebaseArray, FBROOT) {
        var fact = {
        	getFotosArray: getFotosArray

        };

        return fact;

        function getFotosArray (idinspeccion) {
        	return	$firebaseArray(FBROOT.child('inspecciones').child(idinspeccion).child('fotos'));
        	
        }
    }
})();
