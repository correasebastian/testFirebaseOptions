var v;
(function() {
    'use strict';

    angular
        .module('app.fotos')
        .controller('FotosCtrl', FotosCtrl);

    FotosCtrl.$inject = ['$q', '$stateParams', 'FbFotos', 'FBROOT', 'moment', '$cordovaCamera', 'logger', 'isMobileTest',
        '$window', 'Firebase', '$ionicModal', '$scope', 'TiposFotos', 'ImgPro', '$ionicPopup'
    ];

    /* @ngInject */
    function FotosCtrl($q, $stateParams, FbFotos, FBROOT, moment, $cordovaCamera, logger, isMobileTest,
        $window, Firebase, $ionicModal, $scope, TiposFotos, ImgPro, $ionicPopup) {
        var vm = this;
        v = vm;
        vm.addFoto = addFoto;
        vm.m_addFoto = m_addFoto;
        vm.title = 'FotosCtrl';
        vm.isExpanded = true;
        vm.closeModal = closeModal;
        vm.openModal = openModal;
        vm.getImagesFromGallery = getImagesFromGallery;
        var idInspeccion = $stateParams.idinspeccion;
        var placa = moment().unix(); //asignar por parametro tambien
        var backup = {};
        vm.fotosFalt = TiposFotos;
        vm.sistemasPopup = sistemasPopup;
        vm.matriculaPopup = matriculaPopup;
        vm.height = ($window.screen.height - 92) / 2.4;
        activate();

        ////////////////

        function activate() {
            var promises = [
                getFotos(),
                setModal(),
                getSistemasDictamenes(),
                getMatriculasDictamenes(),
                getDictamenes()
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
                        camera: false
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

            return FbFotos.getFotosArray(idInspeccion).$loaded()
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


        function getDictamenes() {
            return FbFotos.getDictamenes(idInspeccion).$loaded()
                .then(onGetDictamenes);

            function onGetDictamenes(data) {
                vm.dictamenes = data;
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
                    camera: false
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
                    camera: true
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

        function getSistemasDictamenes() {
            return FbFotos.getSistemasDictamenes().$loaded()
                .then(onGetSistemasDictamenes);

            function onGetSistemasDictamenes(data) {
                vm.sistemasDictamenes = data;
                // solo por devolver un valor para chaining promises
                return true;

            }
        }

        function getMatriculasDictamenes() {
            return FbFotos.getMatriculasDictamenes().$loaded()
                .then(onGetMatriculasDictamenes);

            function onGetMatriculasDictamenes(data) {
                vm.matriculasDictamenes = data;
                // solo por devolver un valor para chaining promises
                return true;

            }
        }

        //////////////popups

        function sistemasPopup() {
            // angular.copy(vm.dictamenes, backup);
            backData(backup, vm.dictamenes);
            var myprompt = $ionicPopup.prompt({
                title: 'Sistemas',

                templateUrl: 'js/fotos/sistemas.html',
                scope: $scope,
                buttons: [{
                    text: 'Cancel',
                    onTap: function(e) {
                        backData( vm.dictamenes,backup);
                        return false;

                    }
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!vm.dictamenes.sistemas) {
                            e.preventDefault();
                        } else {
                            return true;
                        }
                    }
                }]
            });
            myprompt.then(function(bool) {
                // vm.closePopover();          
                if (bool) {
                    saveDictamen();
                    // vm.setSistemas();
                }
            });
        }

        function saveDictamen() {
            vm.dictamenes.$save();
        }


        function matriculaPopup() {
          backData(backup, vm.dictamenes);
            var myprompt = $ionicPopup.prompt({
                title: 'Matricula',
                // template: 'Ingrese la nueva placa',
                templateUrl: 'js/fotos/matricula.html',
                scope: $scope,
                buttons: [{
                    text: 'Cancel',
                    onTap: function(e) {
                        backData( vm.dictamenes,backup);
                        // vm.data.matriculasDictamen=vm.dataCopy.matriculasDictamen;
                        // vm.closePopover();
                        return false;
                    }
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (!vm.dictamenes.matricula) {
                            e.preventDefault();

                        } else {
                            // vm.closePopover();
                            return true;
                        }
                    }
                }]
            });
            myprompt.then(function(bool) {
                // vm.closePopover();          
                if (bool) {
                    saveDictamen();
                    // setMatricula();
                }
            });
        }

        function backData(dest, origin) {
            var myKeys = ["sistemas", "matricula"];

            myKeys.forEach(function(name, i) {
                console.log(name, i);
                // (backup[name]) ? 
                dest[name] = origin[name] || null;

            });

        }

        //end controller
    }
})();
