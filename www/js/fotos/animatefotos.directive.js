(function() {
    'use strict';

    angular
        .module('app.fotos')
        .directive('scmAnimateFotosList', scmAnimateFotosList);

    scmAnimateFotosList.$inject = ['ionicMaterialMotion', 'ionicMaterialInk','$timeout'];

    /* @ngInject */
    function scmAnimateFotosList(ionicMaterialMotion, ionicMaterialInk,$timeout) {
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



            console.log('animated fotos directive')
            $timeout(function() {

                switch (attrs.animation) {
                    case 'slideUp':
                        ionicMaterialMotion.slideUp({
                            selector: '.slide-up'
                        });
                        break;
                    case 'fadeSlideInRight':
                        ionicMaterialMotion.fadeSlideInRight({
                            selector: '.animate-fade-slide-in .item'
                        });
                        break;
                }




                ionicMaterialInk.displayEffect();
            }, parseInt(attrs.delay) || 100)
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();
