(function() {
    'use strict';

    angular
        .module('app.core', [
            'common.firebase', 'common.moment','common.toastr','common.fabMenu',
            'blocks.logger','blocks.exception','common.letterAvatar',

            //third party
            'ngCordova', 'ionic-material','ng-mfb', 'ngLetterAvatar' /*menu fab */
        ]);
})();