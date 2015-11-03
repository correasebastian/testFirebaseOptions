(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('isMobileTest', isMobileTest);

    isMobileTest.$inject = ['logger','$ionicHistory'];

    /* @ngInject */
    function isMobileTest(logger,$ionicHistory) {
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

        var fact = {
            set: set,
            get: get
        };

        return fact;

        function get() {
            return mobileTest;
        }

        function set(bool) {

            /*podria borrar la cache para que todo me funcione de nuevo*/
            $ionicHistory.clearCache();
            mobileTest = bool;
            return mobileTest;
        }
    }
})();
