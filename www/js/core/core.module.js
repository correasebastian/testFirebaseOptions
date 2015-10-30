(function() {
    'use strict';

    angular
        .module('app.core', [
            'common.firebase', 'common.moment','common.toastr',
            'blocks.logger','blocks.exception',

            //third party
            'ngCordova'
        ]);
})();