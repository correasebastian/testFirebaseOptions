var db, inspecciones, fotos;
(function() {
    'use strict';

    angular
        .module('common.loki')
        .factory('LokiScm', LokiScm);

    LokiScm.$inject = ['$q', '$timeout', '$ionicPlatform', 'Loki', 'FBROOT', 'logger'];

    /* @ngInject */
    function LokiScm($q, $timeout, $ionicPlatform, Loki, FBROOT, logger) {

        var _db;
        var _alreadyLoad = false;
        var _fbAlreadyLoad = false;
        var _inspecciones = null;
        var _fotos = null;
        var _inspeccionesURI;
        var _inspeccionesRawUserURI;
        var _inspeccionesQueueRef = FBROOT.child('inspecciones').child('queue').child('tasks');

        //todo asignarle el fbarray
        var _fbInspecciones = [];
        var _fbFotos = []

        var loading = null;
        var service = {
            getInspecciones: getInspecciones,
            getFotos: getFotos,
            setInspeccionesURI: setInspeccionesURI,
            addInspeccion: addInspeccion

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

        function setInspeccionesURI(uid) {
            _inspeccionesURI = FBROOT.child('users').child(uid).child('inspecciones');
            _inspeccionesRawUserURI = 'users/' + uid + '/inspecciones/';
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

            // //TODO
            // trySync();
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

        function getInspecciones() {
            return isDbLoad()
                .then(dbOK);

            function dbOK() {
                // service.emu = _birthdays.data;
                //TODO RAER EL ARRAY FB
                if (_fbAlreadyLoad) {
                    return _fbInspecciones;
                } else {
                    return _inspecciones.data;
                }

            }
        }

        function getFotos() {
            return isDbLoad()
                .then(dbOK);

            function dbOK() {
                //TODO RAER EL ARRAY FB
                if (_fbAlreadyLoad) {
                    return _fbFotos;
                } else {
                    return _fotos.data;
                }
            }
        }

        function addInspeccion(inspeccion) {
            var fbI = _inspeccionesURI.push();
            logger.info('key', fbI.key());
            insertInspeccionLocal(fbI, inspeccion);

            /* // if (delete inspeccion.$id) {
            return insertInspeccionCompletaFirebase(fbI, inspeccion);
            // }
*/

            //probando el atomic

            return atomicInsertInspeccion(fbI.key(), inspeccion);


        }

        function atomicInsertInspeccion(key, inspeccion) {
            // Create the data we want to update
            var updatedInspeccion = {};
            //en las inspecciones de usuario

            var user = _inspeccionesRawUserURI + key;
            updatedInspeccion[user] = inspeccion;

            var main = 'inspecciones/' + key;
            updatedInspeccion[main] = inspeccion;

            var queue = 'inspecciones/queue/tasks/' + key;
            var copyInspeccion = angular.copy(inspeccion);
            copyInspeccion.idInspeccion = key;
            updatedInspeccion[queue] = copyInspeccion;


            return atomicInsert(updatedInspeccion);
        }

        function atomicInsert(data) {
            return $q(function(resolve, reject) {
                FBROOT.update(data, function(error) {
                    if (error) {
                        logger.error("atomicInsertInspeccion could not be saved." + error);
                        reject(error);
                    } else {
                        logger.info("atomicInsertInspeccion saved successfully.");
                        resolve();
                    }
                });
            });

        }

        function insertInspeccionCompletaFirebase(fbI, inspeccion) {
            var promises = [
                insertInspeccionFbUsuario(fbI, inspeccion),
                insertInspeccionFB(fbI, inspeccion),
                insertInspeccionQueueFB(fbI, inspeccion)

            ];

            return $q.all(promises)
                .then(allPromisesCompleted);

            function allPromisesCompleted() {
                logger.info('ingreso a todo completado');
            }


        }

        function insertInspeccionFbUsuario(fbI, inspeccion) {
            return $q(function(resolve, reject) {
                fbI.set(inspeccion, function(error) {
                    if (error) {
                        logger.error("insertInspeccionFbUsuario could not be saved." + error);
                        reject(error);
                    } else {
                        logger.info("insertInspeccionFbUsuario saved successfully.");
                        resolve();
                    }
                });
            });
        }

        function insertInspeccionFB(fbI, inspeccion) {
            return $q(function(resolve, reject) {
                FBROOT.child('inspecciones').child(fbI.key()).set(inspeccion, function(error) {
                    if (error) {
                        logger.error("insertInspeccionFB." + error);
                        reject(error);
                    } else {
                        logger.info("insertInspeccionFBsuccessfully.");
                        resolve();
                    }
                });
            });
        }

        function insertInspeccionQueueFB(fbI, inspeccion) {
            var copyInspeccion = angular.copy(inspeccion);
            copyInspeccion.idInspeccion = fbI.key();
            return $q(function(resolve, reject) {

                //TODO lo quiero dejar asi :  _inspeccionesQueueRef.child(fbI.key())set(), pero tendria que cambiar como funciona el queue
                _inspeccionesQueueRef.push().set(copyInspeccion, function(error) {
                    if (error) {
                        logger.error("insertInspeccionQueueFB." + error);
                        reject(error);
                    } else {
                        logger.info("insertInspeccionQueueFB.");
                        resolve();
                    }
                });
            });
        }



        function insertInspeccionLocal(fbI, inspeccion) {
            var copyInspeccion = angular.copy(inspeccion);
            copyInspeccion.$id = fbI.key();
            _inspecciones.insert(copyInspeccion);
        }

        function validateIndex(before, birthday) {
            var lastIndex = _bd.length - 1;
            console.log('lastIndex', lastIndex, 'before', before, 'birthday', birthday);
            if (lastIndex > before) {
                console.log('ejecutada');
                validateInserted(lastIndex, birthday);
            } else {
                console.log('otro timeout');
                var tm = $timeout(validateIndex, 5, false, before, birthday);
            }
        }

        function validateInserted(lastIndex, birthday) {
            //TODO, POR QUE recien ccreado no me cogio el valor del array sera que necesita un timeuout??
            var key = _bd.$keyAt(lastIndex);

            birthday.$id = key;
            /* // var birthday = _bd.$getRecord(key);
             var newObj = {
                 fbKey: key,
                 fbVal: birthday
             };
             console.log(lastIndex, _bd[lastIndex], key, newObj);
             _birthdays.insert(newObj);
             _temp.insert(newObj);*/

            _birthdays.insert(birthday);
            _temp.insert(birthday);
        }






    }
})();
