// var ip;
var m;
(function() {
    'use strict';

    angular
        .module('app.core')
        .run(Run);

    Run.$inject = ['$ionicPlatform', '$state', '$rootScope', 'Auth', 'authMock', '$ionicHistory',
        'logger', 'isMobileTest', 'MomentFactory', 'Ionic'
    ];

    /* @ngInject */
    function Run($ionicPlatform, $state, $rootScope, Auth, authMock, $ionicHistory,
        logger, isMobileTest, MomentFactory, Ionic) {

        // ip = $ionicPlatform;
        /* usando el nuevo global de ionic , qu eno esta ligado a angular*/
        /* funcionan inclusive antes del platform ready*/
        /*   var isIOS = ionic.Platform.isIOS();
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
*/
        $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
            // We can catch the error thrown when the $requireAuth promise is rejected
            // and redirect the user back to the home page
            console.log(error);
            if (error === "AUTH_REQUIRED") {
                // logger.error(error);
                $state.go("login");
            }
        });
        // m = MomentFactory;

        MomentFactory.setOffset();

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

                //siempre que haga login debe ir a placas o a la vista main
                $state.go('tab.placas');
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

            var push = new Ionic.Push({
                "debug": false,
                "onNotification": function(notification) {
                    var payload = notification.payload;
                    logger.info('notification', notification);
                },

                "pluginConfig": {
                    "ios": {
                        "badge": true,
                        "sound": true
                    },
                    "android": {
                        "iconColor": "#343434"
                    }
                }
            });

            push.register(function(token) {
                console.log(token);
                logger.info("Device token:", token.token);
            });
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
