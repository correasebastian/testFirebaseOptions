(function() {
    'use strict';

    angular
        .module('app.fotos')
        .factory('FbFotos', FbFotos);

    FbFotos.$inject = ['$firebaseArray', 'FBROOT', '$firebaseObject'];

    /* @ngInject */
    function FbFotos($firebaseArray, FBROOT, $firebaseObject) {
        var _fotosArray = null;
        var _sistemasDictamenesArray = null;
        var _matriculasDictamenesArray = null;
        var _dictamenesObject=null;
        var fact = {
            getFotosArray: getFotosArray,
            getSistemasDictamenes:getSistemasDictamenes,
            getMatriculasDictamenes:getMatriculasDictamenes,
            getDictamenes:getDictamenes

        };

        return fact;

        function getFotosArray(idinspeccion) {
            _fotosArray = $firebaseArray(FBROOT.child('inspecciones').child(idinspeccion).child('fotos'));
            return _fotosArray;
        }

        function getSistemasDictamenes() {
            _sistemasDictamenesArray = $firebaseArray(FBROOT.child('config/dictamenes/sura/sistemasIdentificacion'));
            return _sistemasDictamenesArray;
            // body...
        }

        function getMatriculasDictamenes() {
            _matriculasDictamenesArray = $firebaseArray(FBROOT.child('config/dictamenes/sura/matriculas'));
            return _matriculasDictamenesArray;
        }

        function getDictamenes (idinspeccion) {
            _dictamenesObject = $firebaseObject(FBROOT.child('inspecciones').child(idinspeccion).child('dictamenes'));
            return _dictamenesObject;
        }
    }
})();
