import cluster from 'cluster';
import os from "os";
import http from "http";
import Controller from "./src/controller.js";
import {isValidUuid} from "./src/uuidChecker.js";
import {getReqData} from "./utils.js";


if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 1; i <= os.cpus().length; i++) {
        cluster.fork({APP_PORT: 3000 + i});
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
}
else {
    const server = http.createServer(async (req, res) => {
        if (req.url.startsWith("/api/users") && req.method === "GET") {
            let endOfUrl = req.url.substring(basePath.length)
            if(endOfUrl === '' || endOfUrl === '/') {
                const users = await new Controller().getUsers();
                sendResponse(res, 200, users);
            }
            else {
                try {
                    const uuid = req.url.split("/")[3];
                    if(!isValidUuid(uuid)) {
                        sendResponse(res, 400, { message: "userId is invalid"});
                    }
                    const user = await new Controller().getUser(uuid);
                    sendResponse(res, 200, user);
                } catch (error) {
                    sendResponse(res, 404, { message: error});
                }
            }
        }

        else if (req.url === "/api/users" && req.method === "POST") {
            try {
                let userData = await getReqData(req);
                let updateUser = await new Controller().createUser(JSON.parse(userData));
                sendResponse(res, 201, updateUser);
            }
            catch (e) {
                sendResponse(res, 404, { message: "Request body does not contain required fields"});
            }
        }

        else if (req.url.startsWith("/api/users") && req.method === "PUT") {
            let endOfUrl = req.url.substring(basePath.length)
            if(endOfUrl === '' || endOfUrl === '/') {
                sendResponse(res, 404, {message: "User id not found"})
            }
            else {
                try {
                    const uuid = req.url.split("/")[3];
                    if(!isValidUuid(uuid)) {
                        sendResponse(res, 400, { message: "user id is invalid"});
                    }
                    const id = req.url.split("/")[3];
                    let userData = await getReqData(req);
                    let updatedUser = await new Controller().updateUser(id, JSON.parse(userData));
                    sendResponse(res, 200, updatedUser);
                } catch (error) {
                    sendResponse(res, 404, { message: error});
                }
            }
        }

        else if (req.url.startsWith("/api/users") && req.method === "DELETE") {
            let endOfUrl = req.url.substring(basePath.length)
            if(endOfUrl === '' || endOfUrl === '/') {
                sendResponse(res, 404, {message: "User id not found"})
            }
            else {
                try {
                    const uuid = req.url.split("/")[3];
                    if(!isValidUuid(uuid)) {
                        sendResponse(res, 400, { message: "user id is invalid"});
                    }
                    const id = req.url.split("/")[3];
                    let message = await new Controller().deleteUser(id);
                    sendResponse(res, 204, {message});
                } catch (error) {
                    sendResponse(res, 404, { message: error});
                }
            }
        }

        else {
            sendResponse(res, 404, { message: "Route not found" })
        }
    });

    const sendResponse = (result, statusCode, data) => {
        result.writeHead(statusCode, { "Content-Type": "application/json" });
        result.end(JSON.stringify(data));
    }

    server.on('clientError', (err, socket) => {
        socket.end('HTTP/1.1 500 Bad Request\r\n\r\n');
    });

    server.listen(process.env.APP_PORT, (err) => {
        err ? console.log("Error in server setup") : console.log(`Worker ${process.pid} started on port ${process.env.APP_PORT}`);
    });
}
