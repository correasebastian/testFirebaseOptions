var db, inspecciones, fotos, inspeccionesToSync, fotosToSync, users;
(function() {
    'use strict';

    angular
        .module('common.loki')
        .factory('LokiScm', LokiScm);

    LokiScm.$inject = ['$q', '$timeout', '$ionicPlatform', 'Loki', 'FBROOT', 'logger', 'UserInfo', 'exception'];

    /* @ngInject */
    function LokiScm($q, $timeout, $ionicPlatform, Loki, FBROOT, logger, UserInfo, exception) {

        var _db;
        var _alreadyLoad = false;
        var _fbAlreadyLoad = false;
        var _inspecciones = null;
        var _inspeccionesToSync = null;
        var _fotos = null;
        var _fotosToSync = null;
        var _users = null;
        var _inspeccionesURI;
        var _inspeccionesRawUserURI;
        var _inspeccionesQueueRef = FBROOT.child('inspecciones').child('queue').child('tasks');
        var _defaultGroup = null;

        //todo asignarle el fbarray
        var _fbInspecciones = [];
        var _fbFotos = [];

        var loading = null;
        var service = {
            getInspecciones: getInspecciones,
            getFotos: getFotos,
            setInspeccionesURI: setInspeccionesURI,
            addInspeccion: addInspeccion,
            isDbLoad: isDbLoad,
            getUserConfig: getUserConfig,
            saveUserData: saveUserData

        };


        ////
        // initDB();
        loadDbAsync();

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

            loadDbAsync()
                .then(function() {
                    var userData = getUserConfig(uid);
                    if (userData) {
                        console.log('userData on lokijs', userData);
                        userDataSet(userData, true);
                    } else {
                        UserInfo.getInfoUser(uid)
                            .then(userDataSet)
                            .catch(exception.catcherSimple('setInspeccionesURI'));
                    }
                })
                .catch(exception.catcherSimple('setInspeccionesURI'));

        }

        function userDataSet(userData, noSave) {
            console.log('userData  on lokijs', userData);
            _defaultGroup = userData.config.defaultGroup;
            if (!noSave) {
                console.log('saving data');
                saveUserData(userData);
            }
            trySyncAll();
        }



        function loadDbAsync() {
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
                            .catch(exception.qCatcher(reject, 'loadDbAsync'));

                    }

                }


            });
        }

        function initCollections(cbQ) {
            _db.loadDatabase({}, function() {
                console.timeEnd('loki');
                _alreadyLoad = true;
                loading = false;
                inspeccionesCollection();
                fotosCollection();
                inspeccionesToSyncCollection();
                fotosToSyncCollection();
                usersCollection();
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

        function inspeccionesCollection() {
            _inspecciones = _db.getCollection('inspecciones');
            _inspeccionesToSync = _db.getCollection('inspeccionesToSync');
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

        function inspeccionesToSyncCollection() {

            _inspeccionesToSync = _db.getCollection('_inspeccionesToSync');
            if (!_inspeccionesToSync) {
                _inspeccionesToSync = _db.addCollection('_inspeccionesToSync', {
                    indices: ['$id'],
                    clone: true
                });
                _inspeccionesToSync.ensureUniqueIndex('$id');
            }

            var isEnabled = true;
            _inspeccionesToSync.setChangesApi(isEnabled);
            inspeccionesToSync = _inspeccionesToSync;


        }

        function trySyncAll() {

            //puedo buscar despues de inspecciones si hay que actualizar fotos
            trySyncInspecciones();
        }


        function fotosCollection() {
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

        function usersCollection() {
            _users = _db.getCollection('users');

            if (!_users) {
                _users = _db.addCollection('users', {
                    indices: ['$id'],
                    clone: true
                });
                _users.ensureUniqueIndex('$id');

            }

            users = _users;

        }

        function fotosToSyncCollection() {
            _fotosToSync = _db.getCollection('fotosToSync');

            if (!_fotosToSync) {
                _fotosToSync = _db.addCollection('fotosToSync', {
                    indices: ['$id'],
                    clone: true
                });
                _fotosToSync.ensureUniqueIndex('$id');

                //ejemplo de como obtener el registro
                // temp.by('$id',"-K5fLRn_P7GM1VceDQTa")
            }

            fotosToSync = _fotosToSync;

            // //TODO
            // trySync();

        }

        function getInspecciones() {
            return loadDbAsync()
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
            return loadDbAsync()
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

            var group = 'groups/' + _defaultGroup + '/inspecciones/' + key;
            logger.info(group);

            updatedInspeccion[group] = inspeccion;

            return atomicInsert(key, updatedInspeccion);
        }

        function atomicInsert(key, data) {
            return $q(function(resolve, reject) {
                FBROOT.update(data, function(error) {
                    if (error) {
                        logger.error("atomicInsertInspeccion could not be saved." + error);
                        reject(error);
                    } else {
                        logger.info("atomicInsertInspeccion saved successfully.");
                        removeInspeccionToSyncById(key);
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
            _inspeccionesToSync.insert(copyInspeccion);
        }

        function removeInspeccionToSyncById(fbKey) {
            _inspeccionesToSync.removeWhere({
                '$id': fbKey
            });
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

        function trySyncInspecciones() {
            _inspeccionesToSync.data.forEach(function(obj, i) {
                console.log(obj, i);
                var key = obj.$id;
                var objClone = angular.copy(obj);

                if (deleteInvalidProperties(objClone)) {
                    console.log('format obj', key, objClone);
                    atomicInsertInspeccion(key, objClone);

                }

            });
        }

        function deleteInvalidProperties(data) {
            if (delete data.$id && delete data.$loki) {
                logger.info('formated data ok to sync with firebase');
                return true;

            } else {
                logger.error('cannor removeinvalid proprties', data);
                return false;
            }


        }

        function isDbLoad() {
            if (!_db) {
                return false;
            }
            return true;
        }

        function getUserConfig(uid) {

            return _users.by('$id', uid);

        }

        function saveUserData(data) {
            _users.insert(data);
        }

    }
})();
