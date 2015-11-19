(function() {
    'use strict';

    angular
        .module('common.moment')
        .factory('MomentFactory', MomentFactory);

    MomentFactory.$inject = ['moment', 'FBROOT', '$q', 'exception'];

    /* @ngInject */
    function MomentFactory(moment, FBROOT, $q, exception) {
        var _offSet = null;
        var _now = null;
        var service = {
            setOffset: setOffset,
            getUnixms: getUnixms
        };
        return service;

        ////////////////

        function setOffset() {

            if (_offSet) {
                return $q.when(_offSet);
            }
            var deferred = $q.defer();
            var offsetRef = FBROOT.child(".info/serverTimeOffset");
            offsetRef.once("value",
                onGetTimeOffset, onErrorTimeOffset
            );

            function onGetTimeOffset(snap) {
                _offSet = snap.val() || 0;
                deferred.resolve(_offSet);

            }

            function onErrorTimeOffset(err) {
                deferred.reject(err);
            }

            return deferred.promise;
        }

        function getUnixms() {
            /* return setOffset()
                 .then(onSetOk);

             function onSetOk() {
                 _now = ((moment().unix()) * 1000) + _offSet;
                 return _now;
             }*/

            _now = ((moment().unix()) * 1000) + _offSet;
            return _now;

        }
    }
})();
