'use strict';

var WebObjectLoader = (function () {
    var instance = null;

    function createInstance() {
        var object = new Object("I am the instance");
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        },

        load: function (file, callback) {
            callback(file);
        }
    };
})();

export default WebObjectLoader;