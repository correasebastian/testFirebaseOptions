(function() {
    'use strict';

    angular
        .module('app.mfb')
        .controller('MfbController', MfbController);

    MfbController.$inject = [];

    /* @ngInject */
    function MfbController() {
        var vm = this;
        vm.title = 'MfbController';

        activate();

        ////////////////

        function activate() {
        }
    }
})();