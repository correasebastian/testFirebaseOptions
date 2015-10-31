(function() {
    'use strict';

    angular
        .module('app.fotos')
        .controller('FotosCtrl', FotosCtrl);

    FotosCtrl.$inject = ['$stateParams', 'FbFotos', 'FBROOT', 'moment', 'ionicMaterialInk', 'ionicMaterialMotion', '$timeout'];

    /* @ngInject */
    function FotosCtrl($stateParams, FbFotos, FBROOT, moment, ionicMaterialInk, ionicMaterialMotion, $timeout) {
        var vm = this;
        vm.title = 'FotosCtrl';
        vm.isExpanded = true;

        activate();

        ////////////////

        function activate() {
            FbFotos.getFotosArray($stateParams.idinspeccion).$loaded()
                .then(function(data) {
                    vm.fotos = data;
                    // animate();

                });

        }
  

   /*     function animate() {
            $timeout(function() {             

                ionicMaterialMotion.slideUp({
                    selector: '.slide-up'
                });
                // Activate ink for controller
               

                ionicMaterialMotion.pushDown({
                    selector: '.push-down'
                });
                ionicMaterialMotion.fadeSlideInRight({
                    selector: '.animate-fade-slide-in .item'
                });

                 ionicMaterialInk.displayEffect();
            }, 300)
        }*/

        // $scope.chat = Chats.get($stateParams.chatId);

        var i = 0;

        var paths = ['jon-snow.jpg',
            'sansa.jpg',
            'daenerys.jpg',
            'arya.jpg'
        ];


        vm.addFoto = function() {
            var obj = {
                "placa": new Date().toString(),
                path: paths[i],
                name: paths[i].split('.')[0]
            };

            (i === 3) ? i = 0: i++;



            vm.fotos.$add(obj).then(onAdded);

            function onAdded(data) {
                var keyInserted = data.key();
                // animate();
                FBROOT.child('fotos').child(keyInserted).set(obj);
            }



        }
    }
})();
