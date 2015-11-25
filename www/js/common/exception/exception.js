(function() {
    'use strict';

    angular
        .module('blocks.exception')
        .factory('exception', exception);
    exception.$inject = ['$q', 'logger'];
    /* @ngInject */
    function exception($q, logger) {
        var service = {
            catcher: catcher,
            fbCatcher:fbCatcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.error(message, reason);
                return $q.reject(message);
            };
        }

        function fbCatcher(message) {
            return function(error) {
                if (error) {
                    logger.error(message, reason);
                } else {
                    logger.log('success ' + message);
                }


            };
        }
    }
})();
