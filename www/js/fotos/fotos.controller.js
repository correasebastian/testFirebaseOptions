(function() {
    'use strict';

    angular
        .module('app.fotos')
        .controller('FotosCtrl', FotosCtrl);

    FotosCtrl.$inject = ['$stateParams', 'FbFotos', 'FBROOT', 'moment', '$cordovaCamera', 'logger', 'isMobileTest', '$window', 'Firebase'];

    /* @ngInject */
    function FotosCtrl($stateParams, FbFotos, FBROOT, moment, $cordovaCamera, logger, isMobileTest, $window, Firebase) {
        var vm = this;
        vm.addFoto = addFoto;
        vm.m_addFoto = m_addFoto;
        vm.title = 'FotosCtrl';
        vm.isExpanded = true;
        var idInspeccion = $stateParams.idinspeccion;
        var placa = moment().unix(); //asignar por parametro tambien

        vm.height = ($window.screen.height - 92) / 2.4;
        activate();

        ////////////////

        function activate() {
            FbFotos.getFotosArray(idInspeccion).$loaded()
                .then(function(data) {
                    if (isMobileTest.get()) {
                        vm.m_fotos = data;
                    } else {
                        vm.fotos = data;
                    }

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

        //metodo web
        function addFoto() {
            var obj = {
                "placa": placa, // Firebase.ServerValue.TIMESTAMP, //new Date().toString(),
                path: paths[i],
                name: paths[i].split('.')[0]
            };

            (i === 3) ? i = 0: i++;

            vm.fotos.$add(obj)
                .then(onAdded(obj));
            // saque la funcion de aca para utilizarla por ambos addFoto m_addFoto, pero no se si me molesta cuando son demasiado rapidas las promesas

            /*   function onAdded(data) {
                   var keyInserted = data.key();
                   // animate();
                   FBROOT.child('fotos').child(keyInserted).set(obj);
               }*/



        }


        //metodo mobile
        function m_addFoto() {


            var options = {
                quality: 45,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                popoverOptions: CameraPopoverOptions,
                targetWidth: 500,
                targetHeight: 500,
                saveToPhotoAlbum: false
            };

            $cordovaCamera.getPicture(options)
                .then(onGetPicture)
                .catch(function(error) {
                    logger.error(error);
                });

            function onGetPicture(imageData) {

                var obj = {
                    "placa": placa, // new Date().toString(),
                    "base64Data": imageData,
                    "name": paths[i].split('.')[0]
                };
                vm.m_fotos.$add(obj)
                    .then(onAdded(obj));

            }
            // body...
        }

        function onAdded(obj) {

            function toReturn(data) {
                var keyInserted = data.key();
                //insertar en la general de fotos         
                FBROOT.child('fotos').child(keyInserted).set(obj);

                // insertar en el queue de upload añadiendo las propiedades 
                obj.idFoto = keyInserted;
                obj.idInspeccion = idInspeccion;
                FBROOT.child('uploads').child('queue').child('tasks')
                    .push().set(obj);

            }

            return toReturn;

        }

        //end controller
    }
})();
