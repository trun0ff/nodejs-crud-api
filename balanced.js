import {server} from "./src/index.js";
import cluster from 'cluster';
import os from "os";

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 1; i <= os.cpus().length; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}
else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    server.listen(process.env.APP_PORT, err => {
        err ?
            console.log("Error in server setup") :
            console.log(`Worker ${process.pid} started`);
    });
}
