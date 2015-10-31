(function() {
    'use strict';

    angular
        .module('app.core')
        .run(Run);

    Run.$inject = ['$ionicPlatform', '$state', '$rootScope', 'Auth', 'authMock', '$ionicHistory', 'logger'];

    /* @ngInject */
    function Run($ionicPlatform, $state, $rootScope, Auth, authMock, $ionicHistory, logger) {


        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            console.log(error);
            if (error === "AUTH_REQUIRED") {
                logger.error(error);
                $state.go("login");
            }
        });

        Auth.$onAuth(function(authData) {
            console.log('authData  desde run', authData);
            logger.success('evento onAuth');
            /*desde que movi el onAuth al run parece que siempre me carga antes que el del conrrolador dash, 
            pero por seguirdad sigo usando el id, desde la promesa resuelta en dash para iniciar el array de placas*/
            authMock.setUserData(authData);
            if (authData) {
                // FbPlacas.setArrayPlacas(authData.uid)
                authMock.setAuth(true);

                console.log("Logged in as:", authData.uid);
            } else {
                authMock.setAuth(false);
                /* limpiando la cache para que se vuelva a ejecitar todo por ejemplo en home o sino coge el 
                anterior que estaba ingresado,esto es recomendable si se va a cambiar de usuario*/
                $ionicHistory.clearCache();

                /*no se si esta sea necesaria por que si le doy atras desde login para volver a una vista anterior se genera el error AUTH_REQUIRED  y no deja cambiar de state*/
                $ionicHistory.clearHistory();

                console.log("Logged out");
                $state.go('login');
            }
        });

        $ionicPlatform.ready(function() {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleLightContent();
            }
        });
    }
})();