(function() {
    'use strict';

    angular
        .module('app.fotos')
        .controller('FotosCtrl', FotosCtrl);

    FotosCtrl.$inject = ['$stateParams', 'FbFotos', 'FBROOT', 'moment'];

    /* @ngInject */
    function FotosCtrl($stateParams, FbFotos, FBROOT, moment) {
        var vm = this;
        vm.title = 'FotosCtrl';

        activate();

        ////////////////

        function activate() {
            vm.fotos = FbFotos.getFotosArray($stateParams.idinspeccion);
        }

        // $scope.chat = Chats.get($stateParams.chatId);



        vm.addFoto = function() {
            var obj = {
                path: moment().unix()
            };

            vm.fotos.$add(obj).then(onAdded);

            function onAdded(data) {
                var keyInserted = data.key();
                FBROOT.child('fotos').child(keyInserted).set(obj);
            }



        }
    }
})();
