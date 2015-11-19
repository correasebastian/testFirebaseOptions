(function() {
    'use strict';

    angular
        .module('common.firebase')
        .factory('Presence', Presence);

    Presence.$inject = ['FBROOT', 'logger'];

    /* @ngInject */
    function Presence(FBROOT, logger) {
        var _myConnectionsRef = null;
        var _lastOnlineRef = null;
        var _connectedRef = null;
        var _isOnline = null;

        var service = {
            config: config,
            run: run
        };
        return service;

        ////////////////

        function config(uid) {
            _myConnectionsRef = FBROOT.child("users").child(uid).child("connections");
            // stores the timestamp of my last disconnect (the last time I was seen online)
            _lastOnlineRef = FBROOT.child("users").child(uid).child("lastOnline");
            _connectedRef = FBROOT.child(".info/connected");
        }



        function run() {

            _connectedRef.on('value', function(snap) {
                logger.info('connectedrefchange', snap.val()|| snap);
                if (snap.val() === true) {
                    logger.success('online');
                    _isOnline = true;
                    // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
                    // add this device to my connections list
                    // this value could contain info about the device or a timestamp too
                    var con = _myConnectionsRef.push(true);
                    // when I disconnect, remove this device
                    con.onDisconnect().remove();
                    // when I disconnect, update the last time I was seen online
                    _lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
                } else {
                    logger.error('OFFLINE');
                    _isOnline = false;

                }
            }, function(err) {
                logger.error(err);
            });
        }
    }
})();
