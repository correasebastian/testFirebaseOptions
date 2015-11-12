(function() {
    'use strict';

    angular
        .module('app.fotos')
        .directive('backgroundImage', backgroundImage);

    backgroundImage.$inject = [];

    /* @ngInject */
    function backgroundImage() {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'A'
                /*,
                            scope: {}*/
        };
        return directive;

        function link(scope, element, attrs) {
            // console.log('bI directive', element, attrs);
            element.css({
                'background-image': 'url(' + attrs.path + ')',
                'background-repeat': 'no-repeat',
                'margin-bottom': '0.3em',
                'margin-top': '0.3em'
            });

            if (attrs.height) {
                element.css({
                    'height': attrs.height + 'px'
                });
            }

        }
    }

    /* @ngInject */
    function Controller() {

    }
})();
