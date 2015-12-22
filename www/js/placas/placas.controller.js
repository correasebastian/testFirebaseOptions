var uf;
(function() {
    'use strict';

    angular
        .module('app.placas')
        .controller('Placas', Placas);

    Placas.$inject = ['$scope', 'currentAuth', 'FbPlacas', 'FBROOT',
        'logger', 'moment', '$ionicFilterBar', 'Firebase', '$timeout',
        '$ionicPopup', '$state', 'UserInfo', 'LokiScm'
    ];

    /* @ngInject */
    function Placas($scope, currentAuth, FbPlacas, FBROOT,
        logger, moment, $ionicFilterBar, Firebase, $timeout,
        $ionicPopup, $state, UserInfo, LokiScm) {

        uf = UserInfo;
        var vm = this;
        vm.title = 'Placas';
        vm.addPlaca = addPlaca;
        vm.placas = [];
        vm.tc = tc;
        vm.filterString = '';
        vm.hasFocus = false;
        vm.showFilterBar = showFilterBar;
        vm.setFocus = setFocus;
        vm.placaPopup = placaPopup;
        vm.go = go;
        vm.data = {
            placa: null,
            sl: null
        };
        var filterBarInstance;
        activate();

        ////////////////

        function activate() {
            logger.log('en placac ctrl', currentAuth);

            if (currentAuth) {
                LokiScm.setInspeccionesURI(currentAuth.uid);
                UserInfo.getInfoUser(currentAuth.uid)
                    .then(getPlacas);
            }


        }

        function getPlacas() {
            vm.userConfig = UserInfo.userConfig;
            logger.info('activado placas');
            FbPlacas.setArrayPlacas(currentAuth.uid, vm.userConfig.numberOfItems);

            return FbPlacas.getArray().$loaded()
                .then(onGetPlacas);

            function onGetPlacas(data) {
                vm.placas = data;
                return vm.placas;
            }
        }

        function go(placa) {
            setFocus(false);
            $state.go("tab.placas-detail", {
                idinspeccion: placa.$id,
                placa: placa.placa
            });
        }


        var i = 0;

        var paths = ['jon-snow.jpg', 'sansa.jpg',
            'daenerys.jpg',
            'arya.jpg'
        ];

        function addPlaca(placa) {
            var obj = {
                placa: placa, // moment().unix(), // new Date().toString(),
                /*    path: paths[i],
                    name: paths[i].split('.')[0],*/
                timeStamp: Firebase.ServerValue.TIMESTAMP,
                createdBy: currentAuth.uid
            };

            (i === 3) ? i = 0: i++;
            LokiScm.addInspeccion(obj);
            cleanData();

            /*  vm.placas.$add(obj)
                  .then(onAdded);*/

            function onAdded(data) {
                cleanData();
                console.log('data registered', data.key());
                var keyInserted = data.key();
                //ingreso al registro de inspecciones
                FBROOT.child('inspecciones').child(keyInserted).set(obj);

                if (vm.userConfig.groupMode) {
                    //si esta en gropu mode entonces me falta ingresarlo en las inspecciones del usuario
                    FBROOT.child('users').child(currentAuth.uid).child('inspecciones').child(keyInserted).set(obj);

                } else {
                    // var mainGroup = vm.userConfig.groups.$id;
                    var mainGroup = vm.userConfig.defaultGroup;
                    //si NO esta en gropu mode entonces me falta ingresarlo en GROUPMODE
                    FBROOT.child('groups').child(mainGroup).child('inspecciones').child(keyInserted).set(obj);

                }

                //ingreso a queue de inspecciones para ingreso sql
                obj.idInspeccion = keyInserted;
                FBROOT.child('inspecciones').child('queue').child('tasks')
                    .push().set(obj);



            }
        }

        function setFocus(bool) {
            vm.hasFocus = bool;
            if (!bool) {
                vm.filterString = '';
                vm.title = 'Placas';
                /*$timeout(function() {
                    vm.title = 'Placas';
                }, 300)
                */

            }

        }

        function tc(bool) {
            $scope.$parent.AppCtrl.setExtended(!bool);
        }

        function showFilterBar() {
            filterBarInstance = $ionicFilterBar.show({
                items: vm.placas,
                update: function(filteredItems) {
                    vm.placas = filteredItems;
                },
                filterProperties: 'name'
            });
        }

        function placaPopup() {

            var myprompt = $ionicPopup.prompt({
                title: 'Nueva Placa',

                templateUrl: 'js/placas/insertPlaca.html',
                scope: $scope,
                buttons: [{
                    text: 'Cancel',
                    onTap: function(e) {
                        cleanData();
                    }
                }, {
                    text: '<b>Save</b>',
                    type: 'button-positive',
                    onTap: function(e) {
                        if (vm.data.placa === null) {
                            // || vm.data.sl === null|| vm.data.sl === null                    
                            e.preventDefault();
                        } else {
                            return vm.data.placa;
                        }
                    }
                }]
            });
            myprompt.then(function(placa) {
                if (placa !== null && placa !== undefined) {
                    if (placa.length < 4) {
                        logger.error('longitud de placa muy corta');
                        return;
                    }
                    placa = placa.replace(/[^\w\s]/gi, '').toUpperCase();
                    placa = placa.replace(/\s/g, '');
                    addPlaca(placa);
                }
            });
        }




        function cleanData() {
            vm.data.placa = null;
            vm.data.sl = null;
        };
        ///////////////////////////////////////////////////////
    }
})();
