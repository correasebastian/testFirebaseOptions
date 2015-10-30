(function() {
    'use strict';

    angular
        .module('app.placas')
        .controller('Placas', Placas);

    Placas.$inject = ['$scope', 'currentAuth', 'FbPlacas', 'FBROOT','logger'];

    /* @ngInject */
    function Placas($scope, currentAuth, FbPlacas, FBROOT,logger) {
        var vm = this;
        vm.title = 'Placas';
        vm.emit = emit;
        vm.placas = [];

        activate();

        ////////////////

        function activate() {

            FbPlacas.setArrayPlacas(currentAuth.uid, 5);
            logger.info('activado placas');
            vm.placas = FbPlacas.getArray();
        }

        function emit() {
            $scope.$emit('custom', {
                name: "juliana"
            });
            var obj = {
                "placa": new Date().toString()
            };

            vm.placas.$add(obj).then(onAdded);

            function onAdded(data) {
                console.log('data registered', data.key());
                var keyInserted = data.key();
                FBROOT.child('inspecciones').child(keyInserted).set(obj);
            }
        }
    }
})();
