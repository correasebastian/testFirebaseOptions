angular.module('starter.controllers', [])

.controller('loginCtrl', function($ionicHistory, simpleObj) {

        console.log(simpleObj);
       

        $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
    })
    .controller('DashCtrl', function($scope, $ionicHistory,authMock) {
         authMock.setAuth();

        /*viene del login asi que debo borrar la historia para que no pueda devolverse, no hace falta

        aunque estoy evaluando  $ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });
        en el login controller 

        */
        // $ionicHistory.clearHistory();
        /* send an event up */
        $scope.emit = function() {
            $scope.$emit('custom', {
                name: "juliana"
            });
        };

    })
    .controller('AppController', function($scope, $rootScope, $ionicPlatform, $timeout, $cordovaNetwork) {

        var vm;
        vm = this;
        vm.msg = 'init';

        vm.cl = function(msg) {
            $timeout(function() {
                vm.msg = msg;
            });
        };

        $ionicPlatform.ready(function() {

            function isOnline() {

                function checkIsonline() {
                    if ($cordovaNetwork.isOnline()) {
                        vm.isOnline = true;
                        vm.msg = 'online';

                    } else {
                        vm.isOnline = false;
                        vm.msg = 'offline';

                    }
                }
                $timeout(checkIsonline);
            }

            // listen for Online event
            $scope.$on('$cordovaNetwork:online', function(event, networkState) {
                console.log('online', networkState);
                isOnline();
            });

            // listen for Offline event
            $scope.$on('$cordovaNetwork:offline', function(event, networkState) {
                console.log('offline --->>', networkState);
                isOnline();
            });


            $scope.$on('custom', function(event, data) {
                $timeout(function() {
                    console.log(data);
                    vm.msg = 'custom';
                });
            });


            /*habilitarlo para cuando este en mobile, si estoy en serve tira error por no encontrar cordova*/
            isOnline();


        });

        /*
        e=angular.element($0);
        s=e.scope()
        p=s.$parent
        p.AppCtrl.*/

    })

.controller('ChatsCtrl', function($scope, Chats) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = Chats.all();
    $scope.remove = function(chat) {
        Chats.remove(chat);
    };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
    $scope.settings = {
        enableFriends: true
    };
});
