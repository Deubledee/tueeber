var Server = require('upnpserver');

var server = new Server({
    log: true,
    name: "Leonard",
    hostname: "localhost",
    dlnaSupport: true
}, [
        '/home/diogo',
        { path: '/home/diogo' },
        { path: '/Vídeos', mountPoint: '/My movies' },
        { path: '/Images', mountPoint: '/Personnal/My albums' },
    ]);
server.start();

console.log(server.repositories, server._upnpClasses);
