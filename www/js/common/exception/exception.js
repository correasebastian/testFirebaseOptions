(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .factory('exception', exception);
exception.$inject = ['$q', 'logger'];
    /* @ngInject */
    function exception($q,logger) {
        var service = {
            catcher: catcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.error(message, reason);
                return $q.reject(message);
            };
        }
    }
})();