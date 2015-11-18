(function() {
    'use strict';

    angular
        .module('app.settings')
        .controller('Settings', Settings);

    Settings.$inject = ['Auth', 'currentAuth', 'UserInfo', '$ionicHistory'];

    /* @ngInject */
    function Settings(Auth, currentAuth, UserInfo, $ionicHistory) {
        var vm = this;
        vm.title = 'Settings';
        vm.setDefaulGroup = setDefaulGroup;
        vm.updateRange = updateRange;
        vm.saveToggle = saveToggle;
        vm.logout = logout;


        activate();



        ////////////////

        function activate() {

            UserInfo.getInfoUser(currentAuth.uid)
                .then(onGetInfoUserOK);

            function onGetInfoUserOK() {
                vm.config = UserInfo.userConfig;
                vm.userGroups = UserInfo.userGroups;
            }
        }

        function logout() {

            Auth.$unauth();
        };

        function saveToggle(bool) {
            // console.log("save");
            // vm.config.groupMode = bool;
            saveClearCache();
        };

        function updateRange(range) {
            // console.log("range", range);
            // vm.config.numberOfItems = parseInt(range);
            saveClearCache();

        }

        function setDefaulGroup() {
            saveClearCache();
        }

        function saveClearCache() {
            vm.config.$save();
            $ionicHistory.clearCache();
        }

    }
})();
