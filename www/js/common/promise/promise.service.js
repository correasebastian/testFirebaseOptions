(function() {
    'use strict';

    angular
        .module('blocks.promise')
        .factory('promise', promise);

    promise.$inject = ['logger', '$q', '$timeout',
        // 'store',
        '$interval', 'Sqlite'
    ];

    /* @ngInject */
    function promise(logger, $q, $timeout,
        // store,
        $interval, Sqlite) {
        var service = {
            emulate: emulate,
            existsConsulta: existsConsulta
        };
        return service;

        function emulate(msg, data, delay, error, notify) {
            delay = (delay) ? delay : 1000;
            var intervalms = delay / 10;
            var i=0;

            var q = $q.defer();

            if (notify) {

                var interval = $interval(
                    function() {
                        q.notify(i++);
                    }, intervalms

                );

            }

            $timeout(function() {
                logger.log(msg, delay);
                $interval.cancel(interval);

                if (error) {
                    q.reject('error on : ' + msg);

                } else {
                    q.resolve(data);
                }

            }, delay);

            return q.promise;

        }

        function existsConsulta() {
            /*  var deferred = $q.defer();
              var n = 1;
              if (store.get('consulta') && store.get('dataInit') && Sqlite.db) {
                  deferred.resolve(true);
              } else {
                  var interval = $interval(
                      function() {
                          n += 1;
                          // logger.info(n);
                          if (store.get('consulta') && Sqlite.db) {
                              $interval.cancel(interval);
                              deferred.resolve(true);
                          }
                      }, 500);

              }

              return deferred.promise;*/
        }
    }
})();
