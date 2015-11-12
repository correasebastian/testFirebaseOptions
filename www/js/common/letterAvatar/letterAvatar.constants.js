(function() {
    'use strict';

    angular
        .module('common.letterAvatar')
        .constant('defaultSettings', {
            alphabetcolors: ["#5A8770", "#B2B7BB", "#6FA9AB", "#F5AF29", "#0088B9", "#F18636", "#D93A37", "#A6B12E", "#5C9BBC", "#F5888D", "#9A89B5", "#407887", "#9A89B5", "#5A8770", "#D33F33", "#A2B01F", "#F0B126", "#0087BF", "#F18636", "#0087BF", "#B2B7BB", "#72ACAE", "#9C8AB4", "#5A8770", "#EEB424", "#407887"],
            textColor: '#ffffff',
            defaultBorder: 'border:5px solid white',
            fontsize: 30, // unit in pixels
            height: 50, // unit in pixels
            width: 50, // unit in pixels
            fontWeight: 400, //
            charCount: 1,
            fontFamily: 'HelveticaNeue-Light,Helvetica Neue Light,Helvetica Neue,Helvetica, Arial,Lucida Grande, sans-serif',
            base: 'data:image/svg+xml;base64,',
            radius: 'border-radius:30px;'

        });
})();
