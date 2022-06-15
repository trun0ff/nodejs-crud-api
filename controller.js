const data = require("./data");

class Controller {
    async getUsers() {
        return new Promise((resolve, _) => resolve(data));
    }

    async getUser(id) {
        return new Promise((resolve, reject) => {
            let user = data.find((user) => user.id === parseInt(id));
            if (user) {
                resolve(user);
            } else {
                reject(`user with id ${id} not found `);
            }
        });
    }

    async createUser(user) {
        return new Promise((resolve, _) => {
            let newuser = {
                id: Math.floor(4 + Math.random() * 10),
                ...user,
            };

            resolve(newuser);
        });
    }

    async updateUser(id) {
        return new Promise((resolve, reject) => {
            let user = data.find((user) => user.id === parseInt(id));
            if (!user) {
                reject(`No user with id ${id} found`);
            }
            user["completed"] = true;
            resolve(user);
        });
    }

    async deleteUser(id) {
        return new Promise((resolve, reject) => {
            let user = data.find((user) => user.id === parseInt(id));
            if (!user) {
                reject(`No user with id ${id} found`);
            }
            resolve(`user deleted successfully`);
        });
    }
}
module.exports = Controller;