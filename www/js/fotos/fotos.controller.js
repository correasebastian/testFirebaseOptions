(function() {
    'use strict';

    angular
        .module('app.fotos')
        .controller('FotosCtrl', FotosCtrl);

    FotosCtrl.$inject = ['$stateParams', 'FbFotos', 'FBROOT', 'moment', '$cordovaCamera', 'logger', 'isMobileTest', '$window'];

    /* @ngInject */
    function FotosCtrl($stateParams, FbFotos, FBROOT, moment, $cordovaCamera, logger, isMobileTest,$window) {
        var vm = this;
        vm.addFoto = addFoto;
        vm.m_addFoto = m_addFoto;
        vm.title = 'FotosCtrl';
        vm.isExpanded = true;

        vm.height = ($window.screen.height - 92) / 2.4;
        activate();

        ////////////////

        function activate() {
            FbFotos.getFotosArray($stateParams.idinspeccion).$loaded()
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


        function addFoto() {
            var obj = {
                "placa": new Date().toString(),
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
                    "placa": new Date().toString(),
                    path: imageData,
                    name: paths[i].split('.')[0]
                };
                vm.m_fotos.$add(obj).then(onAdded(obj));

            }
            // body...
        }

        function onAdded(obj) {

            return function(data) {
                var keyInserted = data.key();
                // animate();
                FBROOT.child('fotos').child(keyInserted).set(obj);
                obj.fb_id=keyInserted;
                FBROOT.child('uploads').child('queue').child('tasks').push().set(obj);

            };

        }

        //end controller
    }
})();
