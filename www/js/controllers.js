angular.module('starter.controllers', [])

.controller('loginCtrl', function($ionicHistory, simpleObj, $ionicLoading, Auth, $state, $scope) {

        // console.log(simpleObj);
        $scope.login = {
            email: 'a@a.com',
            pass: 'a'
        };


        $scope.loginFn = function(user) {

            Auth.$authWithPassword({
                    email: user.email,
                    password: user.pass
                }).then(function(authData) {
                    console.log("Logged in as:" + authData.uid);
                    /*ref.child("users").child(authData.uid).once('value', function(snapshot) {
                        var val = snapshot.val();
                        // To Update AngularJS $scope either use $apply or $timeout
                        $scope.$apply(function() {
                            $rootScope.displayName = val;
                        });
                    });*/

                    $state.go('tab.dash');
                }).catch(function(error) {
                    alert("Authentication failed:" + error.message);

                })
                .finally(function() {
                    $ionicLoading.hide();
                });
        }


        /*$ionicHistory.nextViewOptions({
            disableAnimate: true,
            disableBack: true
        });*/
    })
    .controller('DashCtrl', function($scope, $ionicHistory, authMock, currentAuth) {
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
    .controller('AppController', function($scope, $rootScope, $ionicPlatform, $timeout, $cordovaNetwork,Auth, $state,authMock) {

        var vm;
        vm = this;
        vm.msg = 'init';

        vm.cl = function(msg) {
            $timeout(function() {
                vm.msg = msg;
            });
        };


        Auth.$onAuth(function(authData) {
            if (authData) {
                authMock.setAuth(true);
                console.log("Logged in as:", authData.uid);
            } else {
                authMock.setAuth(false);
                console.log("Logged out");
                $state.go('login');
            }
        });

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

.controller('ChatsCtrl', function($scope, Chats,currentAuth) {
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

.controller('AccountCtrl', function($scope, Auth, currentAuth) {
    $scope.settings = {
        enableFriends: true
    };

    $scope.logout = function() {

        Auth.$unauth();
    };
});
