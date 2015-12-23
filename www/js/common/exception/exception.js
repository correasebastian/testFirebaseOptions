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
            fbCatcher: fbCatcher,
            catcherSimple: catcherSimple,
            qCatcher: qCatcher
        };
        return service;

        function catcher(message) {
            return function(reason) {
                logger.error(message, reason);
                return $q.reject(message);
            };
        }

        function qCatcher(reject, message) {
            return function(reason) {
                logger.error(message, reason);
                reject(message);
            };
        }


        function catcherSimple(message) {
            return function(reason) {
                logger.error(message, reason);
            };
        }

        function fbCatcher(message) {
            return function(error) {
                if (error) {
                    logger.error(message, error);
                } else {
                    logger.log('success ' + message);
                }
            };
        }
    }
})();
