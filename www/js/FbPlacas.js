(function() {
    'use strict';

    angular
        .module('app.placas',[])
        .factory('FbPlacas', FbPlacas);

    FbPlacas.$inject = ['authMock','$firebaseArray','FBROOT'];

    /* @ngInject */
    function FbPlacas(authMock,$firebaseArray,FBROOT) {
        var ngArrayFb;

        var factory={
        	getArray:getArray,
        	setArrayPlacas:setArrayPlacas

        };
        return factory;  

        function getArray () {
        	
        	return ngArrayFb;
        }

        function setArrayPlacas(uid, lastNumber) {
        	var query= FBROOT.child('users').child(uid).orderByKey().limitToLast(lastNumber);
        	ngArrayFb=$firebaseArray(query);
        }
    }
})();