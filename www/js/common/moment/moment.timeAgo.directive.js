(function() {
    'use strict';

    angular
        .module('common.moment')
        .directive('scmTimeAgo', scmTimeAgo);

    scmTimeAgo.$inject = ['moment', 'MomentFactory'];

    /* @ngInject */
    function scmTimeAgo(moment, MomentFactory) {
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
                // var timeAgo = moment(parseInt(attrs.unixms)).fromNow();
                var nowUnixms=MomentFactory.getUnixms();
                var timeAgo = moment(parseInt(attrs.unixms)).from(nowUnixms);

                element.text(timeAgo);
            }


        }
    }

    /* @ngInject */
    function Controller() {

    }
})();
