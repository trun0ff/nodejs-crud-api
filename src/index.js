import 'dotenv/config'
import { getReqData } from "../utils.js";
import http from "http";
import {isValidUuid} from "./uuidChecker.js";
import Controller from "./controller.js";

const PORT = process.env.APP_PORT || 5000;
const regexExpUuid = '/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi';
const basePath = '/api/users';

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

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});


export {server};