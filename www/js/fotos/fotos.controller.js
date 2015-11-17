(function() {
    'use strict';

    angular
        .module('app.fotos')
        .controller('FotosCtrl', FotosCtrl);

    FotosCtrl.$inject = ['$q', '$stateParams', 'FbFotos', 'FBROOT', 'moment', '$cordovaCamera', 'logger', 'isMobileTest',
        '$window', 'Firebase', '$ionicModal', '$scope', 'TiposFotos', 'ImgPro'
    ];

    /* @ngInject */
    function FotosCtrl($q, $stateParams, FbFotos, FBROOT, moment, $cordovaCamera, logger, isMobileTest,
        $window, Firebase, $ionicModal, $scope, TiposFotos, ImgPro) {
        var vm = this;
        vm.addFoto = addFoto;
        vm.m_addFoto = m_addFoto;
        vm.title = 'FotosCtrl';
        vm.isExpanded = true;
        vm.closeModal = closeModal;
        vm.openModal = openModal;
        vm.getImagesFromGallery = getImagesFromGallery;
        var idInspeccion = $stateParams.idinspeccion;
        var placa = moment().unix(); //asignar por parametro tambien
        vm.fotosFalt = TiposFotos;
        vm.height = ($window.screen.height - 92) / 2.4;
        activate();

        ////////////////

        function activate() {
            var promises = [
                getFotos(),
                setModal()
            ];

            return $q.all(promises)
                .then(allPromisesCompleted);

            function allPromisesCompleted(res) {
                logger.info('Fotos activado');
            }


        }

        function getImagesFromGallery() {
            ImgPro.getImagesFromGallery()
                .then(onGetImages);

            function onGetImages(results) {
                for (var i = 0; i < results.length; i++) {
                    console.log('Image URI: ' + results[i]);

                    ImgPro.image2DataUri(results[i])
                        .then(onConvertDataUri)
                        .catch(onConverterError);


                }

                function onConvertDataUri(dataUri) {
                    var obj = {
                        "placa": placa, // Firebase.ServerValue.TIMESTAMP, //new Date().toString(),
                        path: paths[i],
                        name: paths[i].split('.')[0],
                        base64Data: dataUri,
                        camera:false
                    };

                    (i === 3) ? i = 0: i++;

                    vm.m_fotos.$add(obj)
                        .then(onAdded(obj));


                }

                function onConverterError(error) {
                    logger.error(error);


                }
            }
        }

        function getFotos() {

            FbFotos.getFotosArray(idInspeccion).$loaded()
                .then(onGetFotos);

            function onGetFotos(data) {
                if (isMobileTest.get()) {
                    vm.m_fotos = data;
                } else {
                    vm.fotos = data;
                }
                // solo por devolver un valor para chaining promises
                return true;

            }

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

            ImgPro.image2DataUri("img/" + paths[i])
                .then(onConvertDataUri)
                .catch(function(error) {
                    logger.error(error);
                });

            function onConvertDataUri(dataUri) {
                var obj = {
                    "placa": placa, // Firebase.ServerValue.TIMESTAMP, //new Date().toString(),
                    path: paths[i],
                    name: paths[i].split('.')[0],
                    base64Data: dataUri,
                    camera:false
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




        }


        //metodo mobile
        function m_addFoto() {


            var options = {
                quality: 65,
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
                    placa: placa, // new Date().toString(),
                    base64Data: imageData,
                    name: paths[i].split('.')[0],
                    camera:true
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

        function openModal() {
            vm.modal.show();
        }

        function closeModal() {
            vm.modal.hide();
        }

        function setModal() {
            return $ionicModal.fromTemplateUrl('js/fotos/fotoModal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(completeModal);

            function completeModal(modal) {
                vm.modal = modal;
                return vm.modal;
            }
        }

        //end controller
    }
})();
