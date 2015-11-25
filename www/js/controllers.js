angular.module('starter.controllers', [])

.controller('loginCtrl', function($ionicHistory, simpleObj, $ionicLoading, Auth, $state, $scope) {

        // console.log(simpleObj);
        $scope.login = {
            email: 'a@a.com',
            pass: 'a'
        };


        $scope.loginFn = function(user) {
            $ionicLoading.show({
                template: 'Loading...'
            });
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

                    // $state.go('tab.dash');
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
    .controller('DashCtrl', function($scope, $ionicHistory, authMock, currentAuth, FbPlacas, FBROOT) {
        // authMock.setAuth();

        console.log('in dash', currentAuth)
            // Auth.$requireAuth().then(activated);

        function activated() {
            FbPlacas.setArrayPlacas(currentAuth.uid, 5);
            console.log('activado');

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
                var obj = {
                    "placa": new Date().toString()
                };

                $scope.placas.$add(obj).then(function(data) {
                    console.log('data registered', data.key());
                    var keyInserted = data.key();

                    FBROOT.child('inspecciones').child(keyInserted).set(obj);
                });
            };

            $scope.placas = FbPlacas.getArray();


        }

        activated();



    })
    // .controller('AppController', function($scope, $rootScope, $ionicPlatform, $timeout, $cordovaNetwork, Auth, $state, authMock, FbPlacas) {

//     var vm;
//     vm = this;
//     vm.msg = 'init';

//     vm.cl = function(msg) {
//         $timeout(function() {
//             vm.msg = msg;
//         });
//     };




//     $ionicPlatform.ready(function() {

//         function isOnline() {

//             function checkIsonline() {
//                 if ($cordovaNetwork.isOnline()) {
//                     vm.isOnline = true;
//                     vm.msg = 'online';

//                 } else {
//                     vm.isOnline = false;
//                     vm.msg = 'offline';

//                 }
//             }
//             $timeout(checkIsonline);
//         }

//         // listen for Online event
//         $scope.$on('$cordovaNetwork:online', function(event, networkState) {
//             console.log('online', networkState);
//             isOnline();
//         });

//         // listen for Offline event
//         $scope.$on('$cordovaNetwork:offline', function(event, networkState) {
//             console.log('offline --->>', networkState);
//             isOnline();
//         });


//         $scope.$on('custom', function(event, data) {
//             $timeout(function() {
//                 console.log(data);
//                 vm.msg = 'custom';
//             });
//         });


//         /*habilitarlo para cuando este en mobile, si estoy en serve tira error por no encontrar cordova*/
//         isOnline();


//     });

//     /*
//     e=angular.element($0);
//     s=e.scope()
//     p=s.$parent
//     p.AppCtrl.*/

// })

.controller('ChatsCtrl', function($scope, currentAuth, FbPlacas) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.chats = FbPlacas.getArray();

})

.controller('ChatDetailCtrl', function($scope, $stateParams, FbFotos, moment, FBROOT) {
    // $scope.chat = Chats.get($stateParams.chatId);

    $scope.fotos = FbFotos.getFotosArray($stateParams.idinspeccion);

    $scope.addFoto = function() {
        var obj = {
            path: moment().unix()
        }

        $scope.fotos.$add(obj).then(function(data) {
            var keyInserted = data.key();

            FBROOT.child('fotos').child(keyInserted).set(obj);
        });


    }
})

.controller('AccountCtrl', function($scope, Auth, currentAuth, UserInfo, $ionicHistory) {
    $scope.settings = {
        enableFriends: true,
        groupMode: UserInfo.userConfig.groupMode,
        numberOfItems: UserInfo.userConfig.numberOfItems
    };

    $scope.logout = function() {

        Auth.$unauth();
    };

    $scope.saveToggle = function(bool) {
        console.log("save");
        UserInfo.userConfig.groupMode = bool;
        UserInfo.userConfig.$save();
        $ionicHistory.clearCache();
    };
    $scope.updateRange = function(range) {
        console.log("range", range);
        UserInfo.userConfig.numberOfItems = parseInt(range);
        UserInfo.userConfig.$save();
        $ionicHistory.clearCache();
    };


});
