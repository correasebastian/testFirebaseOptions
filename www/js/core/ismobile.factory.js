(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('isMobileTest', isMobileTest);

    isMobileTest.$inject = ['logger'];

    /* @ngInject */
    function isMobileTest(logger) {
        var mobileTest = false;
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        console.log('verificando si funciona antes de platfrom ready', isAndroid, isIOS);

        if (isAndroid) {
            mobileTest = true;
            logger.success('android', mobileTest);
        }
        if (isIOS) {
            logger.success('Ios');
            mobileTest = true;

        }

        return mobileTest;
    }
})();
