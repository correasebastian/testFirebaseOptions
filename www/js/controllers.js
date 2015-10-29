angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {

    })
    .controller('AppController', function($scope, $rootScope, $ionicPlatform, $timeout, $cordovaNetwork) {

        var vm;
        vm = this;
        vm.msg = 'init';

        vm.cl = function(msg) {
            $timeout(function() {
                vm.msg = msg;
            });
        }

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
            $rootScope.$on('$cordovaNetwork:online', function(event, networkState) {
                console.log('online', networkState);
                isOnline();
            });

            // listen for Offline event
            $rootScope.$on('$cordovaNetwork:offline', function(event, networkState) {
                console.log('offline --->>', networkState);
                isOnline();
            });

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
