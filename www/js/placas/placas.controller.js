(function() {
    'use strict';

    angular
        .module('app.placas')
        .controller('Placas', Placas);

    Placas.$inject = ['$scope', 'currentAuth', 'FbPlacas', 'FBROOT', 'logger', 'moment'];

    /* @ngInject */
    function Placas($scope, currentAuth, FbPlacas, FBROOT, logger, moment) {
        var vm = this;
        vm.title = 'Placas';
        vm.addPlaca = addPlaca;
        vm.placas = [];
        vm.tc = tc;
        vm.filterString='';
        vm.hasFocus=false;
        vm.setFocus=setFocus;
        activate();

        ////////////////

        function activate() {

            FbPlacas.setArrayPlacas(currentAuth.uid, 5);
            logger.info('activado placas');
            FbPlacas.getArray(currentAuth.uid).$loaded()
                .then(function(data) {
                        vm.placas = data;
                    }

                );


        }


        var i = 0;

        var paths = ['jon-snow.jpg', 'sansa.jpg',
            'daenerys.jpg',
            'arya.jpg'
        ];

        function addPlaca() {



            var obj = {
                "placa": moment().unix(),// new Date().toString(),
                path: paths[i],
                name: paths[i].split('.')[0]
            };

            (i === 3) ? i = 0: i++;

            vm.placas.$add(obj).then(onAdded);

            function onAdded(data) {
                console.log('data registered', data.key());

                var keyInserted = data.key();
                //ingreso al registro de inspecciones
                FBROOT.child('inspecciones').child(keyInserted).set(obj);

                //ingreso a queue de inspecciones para ingreso sql
                obj.idInspeccion = keyInserted;
                FBROOT.child('inspecciones').child('queue').child('tasks')
                    .push().set(obj);



            }
        }

        function setFocus(bool){
            vm.hasFocus=bool;
            if(!bool){
                vm.filterString='';
            }
        }

        function tc(bool) {
            $scope.$parent.AppCtrl.setExtended(!bool);
        }
    }
})();
