(function() {
    'use strict';

    angular
        .module('common.letterAvatar')
        .directive('scmLetterAvatar', scmLetterAvatar);

    scmLetterAvatar.$inject = ['defaultSettings'];

    /* @ngInject */
    function scmLetterAvatar(defaultSettings) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'LAvatar',
            link: link,
            restrict: 'A',
            scope: {}
        };
        return directive;

        function link(scope, element, attrs) {

            var params = {
                charCount: isNotNull(attrs.charcount) ? attrs.charcount : defaultSettings.charCount,
                data: attrs.data,
                textColor: defaultSettings.textColor,
                height: isNotNull(attrs.height) ? attrs.height : defaultSettings.height,
                width: isNotNull(attrs.width) ? attrs.width : defaultSettings.width,
                fontsize: isNotNull(attrs.fontsize) ? attrs.fontsize : defaultSettings.fontsize,
                fontWeight: isNotNull(attrs.fontweight) ? attrs.fontweight : defaultSettings.fontWeight,
                fontFamily: isNotNull(attrs.fontfamily) ? attrs.fontfamily : defaultSettings.fontFamily,
                avatarBorderStyle: attrs.avatarcustomborder,
                avatardefaultBorder: attrs.avatarborder,
                defaultBorder: defaultSettings.defaultBorder,
                shape: attrs.shape
            };

            var c = params.data.substr(0, params.charCount).toUpperCase();
            var cobj = getCharacterObject(c, params.textColor, params.fontFamily, params.fontWeight, params.fontsize);
            var colorIndex = '';
            var color = '';

            if (c.charCodeAt(0) < 65) {
                color = getRandomColors();
            } else {
                colorIndex = Math.floor((c.charCodeAt(0) - 65) % defaultSettings.alphabetcolors.length);
                color = defaultSettings.alphabetcolors[colorIndex];
            }


            var svg = getImgTag(params.width, params.height, color);
            svg.append(cobj);
            var lvcomponent = angular.element('<div>').append(svg.clone()).html();
            var svgHtml = window.btoa(unescape(encodeURIComponent(lvcomponent)));
            
            var base = defaultSettings.base;
            var _style = '';
            if (params.avatarBorderStyle) {
                _style = params.avatarBorderStyle;
            } else if (params.avatardefaultBorder) {
                _style = params.defaultBorder;
            }

            element.prop("src",base + svgHtml);

            if (params.shape) {
                if (params.shape === 'round') {
                    var round_style = defaultSettings.radius + _style;
                    element.prop("style",round_style);


                    // component = "<img src=" + base + svgHtml + " style='" + round_style + "' />";
                }
            } 
            // element.append(component);
        }
    }

    /* @ngInject */
    function Controller() {
    	var vm = this ;

    	vm.oelo=true;


    }

    // ----------------

    function getRandomColors() {
        var letters = '0123456789ABCDEF'.split('');
        var _color = '#';
        for (var i = 0; i < 6; i++) {
            _color += letters[Math.floor(Math.random() * 16)];
        }
        return _color;
    }

    function isNotNull(obj) {
        if (obj) {
            return true;
        }
        return false;
    }

    function getImgTag(width, height, color) {

        var svgTag = angular.element('<svg></svg>')
            .attr({
                'xmlns': 'http://www.w3.org/2000/svg',
                'pointer-events': 'none',
                'width': width,
                'height': height
            })
            .css({
                'background-color': color,
                'width': width + 'px',
                'height': height + 'px'
            });

        return svgTag;
    }

    function getCharacterObject(character, textColor, fontFamily, fontWeight, fontsize) {
        var textTag = angular.element('<text text-anchor="middle"></text>')
            .attr({
                'y': '50%',
                'x': '50%',
                'dy': '0.35em',
                'pointer-events': 'auto',
                'fill': textColor,
                'font-family': fontFamily
            })
            .html(character)
            .css({
                'font-weight': fontWeight,
                'font-size': fontsize + 'px',
            });

        return textTag;
    }

})();
