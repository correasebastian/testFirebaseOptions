(function() {
    'use strict';

    angular
        .module('app.placas')
        .controller('Placas', Placas);

    Placas.$inject = ['$scope', 'currentAuth', 'FbPlacas', 'FBROOT', 'logger', 'ionicMaterialInk', 'ionicMaterialMotion', '$timeout'];

    /* @ngInject */
    function Placas($scope, currentAuth, FbPlacas, FBROOT, logger, ionicMaterialInk, ionicMaterialMotion, $timeout) {
        var vm = this;
        vm.title = 'Placas';
        vm.addPlaca = addPlaca;
        vm.placas = [];

        activate();

        ////////////////

        function activate() {

            FbPlacas.setArrayPlacas(currentAuth.uid, 5);
            logger.info('activado placas');
            FbPlacas.getArray(currentAuth.uid).$loaded().then(function(data) {
                    vm.placas = data;

                    animate();


                }

            );


        }

        function animate() {
            $timeout(function() {
                // Set Motion
                ionicMaterialMotion.fadeSlideInRight();

                // Set Ink
                ionicMaterialInk.displayEffect();


                // $scope.$parent.AppCtrl.setExtended(true);

            }, 20)
        }

        var i = 0;

        var paths = ['jon-snow.jpg', 'sansa.jpg',
            'daenerys.jpg',
            'arya.jpg'
        ]

        function addPlaca() {



            var obj = {
                "placa": new Date().toString(),
                path:paths[i],
                name:paths[i].split('.')[0]
            };

            (i === 3) ? i = 0: i++;

            vm.placas.$add(obj).then(onAdded);

            function onAdded(data) {
                console.log('data registered', data.key());
                 // $scope.$parent.AppCtrl.isExpanded=true;
                animate();
                // ionicMaterialInk.displayEffect();// este solo no sirve, hay k llamar animate();

                var keyInserted = data.key();
                FBROOT.child('inspecciones').child(keyInserted).set(obj);

                
    
            }
        }
    }
})();