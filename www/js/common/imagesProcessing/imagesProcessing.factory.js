(function() {
    'use strict';

    angular
        .module('common.imagesProcessing')
        .factory('ImgPro', ImgPro);

    ImgPro.$inject = ['$q', '$cordovaImagePicker', 'exception'];

    /* @ngInject */
    function ImgPro($q, $cordovaImagePicker, exception) {
        var service = {
            image2DataUri: image2DataUri,
            getImagesFromGallery:getImagesFromGallery
        };
        return service;

        ////////////////

        function image2DataUri(url) {

            var deferred = $q.defer();
            var base64Data;
            try {

                var image = new Image();

                image.onload = function() {
                    var canvas = document.createElement('canvas');
                    canvas.width = this.naturalWidth; // or 'width' if you want a special/scaled size
                    canvas.height = this.naturalHeight; // or 'height' if you want a special/scaled size

                    canvas.getContext('2d').drawImage(this, 0, 0);


                    base64Data = canvas.toDataURL('image/png').split(',')[1];

                    deferred.resolve(base64Data);
                };

                image.src = url;
            } catch (err) {
                deferred.reject(err);

            }
            return deferred.promise;

        }

        function getImagesFromGallery() {

            var options = {
                maximumImagesCount: 10,
                width: 800,
                height: 800,
                quality: 70
            };

           

            return  $cordovaImagePicker.getPictures(options)
                .then(onGetCompleted)
                .catch(exception.catcher('cant get pictures from gallery'));

                function onGetCompleted (results) {
                   return results;
                }
            // body...
        }
    }
})();
