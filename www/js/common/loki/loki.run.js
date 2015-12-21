

(function() {
    'use strict';

    angular
        .module('common.loki')
        .run(Run);

    Run.$inject = ['LokiScm'];

    /* @ngInject */
    function Run(LokiScm) {

    }
})();
