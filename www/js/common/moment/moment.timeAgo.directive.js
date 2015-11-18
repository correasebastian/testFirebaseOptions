(function() {
    'use strict';

    angular
        .module('common.moment')
        .directive('scmTimeAgo', scmTimeAgo);

    scmTimeAgo.$inject = ['moment'];

    /* @ngInject */
    function scmTimeAgo(moment) {
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

            if (attrs.unixms) {
                var timeAgo = moment(parseInt(attrs.unixms)).fromNow();

                element.text(timeAgo);
            }


        }
    }

    /* @ngInject */
    function Controller() {

    }
})();
