var db, inspecciones, fotos;
(function() {
    'use strict';

    angular
        .module('common.loki')
        .factory('LokiScm', LokiScm);

    LokiScm.$inject = ['$q', '$timeout', '$ionicPlatform', 'Loki'];

    /* @ngInject */
    function LokiScm($q, $timeout, $ionicPlatform, Loki) {

        var _db;
        var _alreadyLoad = false;
        var _fbAlreadyLoad = false;
        var _inspecciones = null;
        var _fotos = null;

        var loading = null;
        var service = {

        };


        ////
        // initDB();
        isDbLoad();

        return service;

        ////////////////



        function initDB() {
            console.info('platform ready, inicializando db');
            var options = {
                autosave: true,
                autosaveInterval: 1000
            };
            if (ionic.Platform.isAndroid() || ionic.Platform.isIOS()) {
                var fsAdapter = new LokiCordovaFSAdapter({
                    "prefix": "loki"
                });
                options.adapter = fsAdapter;
            }
            _db = new Loki('ajustevDB', options);
            db = _db;
        }

        function isDbLoad() {
            return $q(function(resolve, reject) {
                if (_alreadyLoad) {
                    resolve();
                } else {
                    if (loading) {
                        validateLoadDb(resolve, reject);
                    } else {
                        loading = true;
                        $ionicPlatform.ready()
                            .then(function() {                                
                                initDB();
                                return resolve;
                            })
                            .then(initCollections)
                            .catch(function(err) {
                                console.error('cant load db', err);
                                reject(err);
                            });

                    }

                }


            });
        }

        function initCollections(cbQ) {
            _db.loadDatabase({}, function() {
                console.timeEnd('loki');
                _alreadyLoad = true;
                loading = false;
                validateInspeccionesCollection();
                validateFotosCollection();
                cbQ();
            });
        }

        function validateLoadDb(resolve, reject) {
            if (_alreadyLoad) {
                resolve();
            } else {
                $timeout(validateLoadDb, 20, false, resolve, reject);
            }

        }

        function validateInspeccionesCollection() {
            _inspecciones = _db.getCollection('inspecciones');
            if (!_inspecciones) {
                _inspecciones = _db.addCollection('inspecciones', {
                    indices: ['$id'],
                    clone: true
                });
                _inspecciones.ensureUniqueIndex('$id');
            }

            var isEnabled = true;
            _inspecciones.setChangesApi(isEnabled);
            inspecciones = _inspecciones;
        }

        function validateFotosCollection() {
            _fotos = _db.getCollection('fotos');



            if (!_fotos) {
                _fotos = _db.addCollection('fotos', {
                    indices: ['$id'],
                    clone: true
                });
                _fotos.ensureUniqueIndex('$id');

                //ejemplo de como obtener el registro
                // temp.by('$id',"-K5fLRn_P7GM1VceDQTa")
            }

            fotos = _fotos;

            // //TODO
            // trySync();
        }


    }
})();
