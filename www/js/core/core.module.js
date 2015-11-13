(function() {
    'use strict';

    angular
        .module('app.core', [
            'common.firebase', 'common.moment','common.toastr','common.fabMenu','common.appSetup',
            'blocks.logger','blocks.exception','common.letterAvatar','common.imagesProcessing',

            //third party
            'ngCordova', 'ionic-material','ng-mfb', 'ngLetterAvatar' , 'jett.ionic.filter.bar' /*menu fab */
        ]);
})();