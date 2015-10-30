(function() {
    'use strict';

    angular.module('common.toastr')

    .config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 600;
        toastr.options.positionClass = 'toast-bottom-right';
    }



})();
