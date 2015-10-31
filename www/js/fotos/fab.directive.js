var j;
(function() {
    'use strict';

    angular
        .module('app.fotos')
        .directive('scmFab', scmFab);

    scmFab.$inject = ['$timeout', 'logger'];

    /* @ngInject */
    function scmFab($timeout, logger) {
        // Usage:
        //solo funciona bien apra un boton, 
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'EA',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {
            j = element;
            console.log(scope, element, attrs);
            logger.success('scmFab');
            $timeout(function() {
                // j[0].classList.toggle('on');
                element.toggleClass('on');
            }, parseInt(attrs.delay)|| 10);
        }
    }

    /* @ngInject */
    function Controller() {

    }
})();
