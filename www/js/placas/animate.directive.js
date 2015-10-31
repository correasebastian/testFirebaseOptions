(function() {
    'use strict';

    angular
        .module('app.placas')
        .directive('scmAnimatePlacasList', scmAnimatePlacasList);

    scmAnimatePlacasList.$inject = ['ionicMaterialMotion', 'ionicMaterialInk', '$timeout'];

    /* @ngInject */
    function scmAnimatePlacasList(ionicMaterialMotion, ionicMaterialInk, $timeout) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {
        	console.log('animated directive')
            // $timeout(function() { // no es necesario el timeout
                // Set Motion
                ionicMaterialMotion.fadeSlideInRight();

                // Set Ink
                ionicMaterialInk.displayEffect();


                // $scope.$parent.AppCtrl.setExtended(true);

            // }, 1000)
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();
