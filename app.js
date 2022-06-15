import * as user from "./controller.js";
import { getReqData } from "./utils.js";
import http from "http";

const PORT = process.env.PORT || 5000;

const server = http.createServer(async (req, res) => {
    if (req.url === "/api/users" && req.method === "GET") {
        const users = await new user().getUsers();
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(users));
    }

    else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "GET") {
        try {
            const id = req.url.split("/")[3];
            const user = await new user().getuser(id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(user));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    }

    else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "DELETE") {
        try {
            const id = req.url.split("/")[3];
            let message = await new user().deleteUser(id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message }));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    }

    else if (req.url.match(/\/api\/users\/([0-9]+)/) && req.method === "PUT") {
        try {
            const id = req.url.split("/")[3];
            let updatedUser = await new user().updateUser(id);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(updatedUser));
        } catch (error) {
            res.writeHead(404, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: error }));
        }
    }

    else if (req.url === "/api/users" && req.method === "POST") {
        let userData = await getReqData(req);
        let updateUser = await new user().createUser(JSON.parse(userData));
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updateUser));
    }

    else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Route not found" }));
    }
});

server.listen(PORT, () => {
    console.log(`server started on port: ${PORT}`);
});
server.on('error', function (e, res){
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Internal server error" }));
});