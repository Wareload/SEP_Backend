import {app} from './app';
import http from 'http'
import Debug from 'debug'

const debug = Debug('backend:server')

//http port
let port = 3000

app.set('port', port)

const server = http.createServer(app)

server.listen(port)

function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

server.on('error', onError);

function onListening() {
    const addr = server.address();
    // @ts-ignore
    const bind = typeof addr !== 'string' ? 'port ' + addr.port : 'pipe ' + addr;
    debug('Listening on ' + bind);
}

server.on('listening', onListening)