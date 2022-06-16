import {users} from "./data.js";
import { v4 as uuidv4 } from 'uuid';

class Controller {
    async getUsers() {
        return new Promise((resolve, _) => resolve(users));
    }

    async getUser(uuid) {
        return new Promise((resolve, reject) => {
            let user = users.find((userObject) => userObject.id === uuid);
            if (user) {
                resolve(user);
            } else {
                reject(`user with id ${uuid} not found `);
            }
        });
    }

    async createUser(userData) {
        return new Promise((resolve, reject) => {
            if(!userData.username || !userData.age || !userData.hobbies)
            {
                reject(`username, age and hobbies are required`);
            }
            else {
                let newuser = {
                    id: uuidv4(),
                    ...userData,
                };
                users.push(newuser);
                resolve(newuser);
            }
        });
    }

    async updateUser(uuid, userData) {
        return new Promise((resolve, reject) => {
            let user = users.find((userObject) => userObject.id === uuid);
            if (!user) {
                reject(`No user with id ${uuid} found`);
            }
            let userIndex = users.findIndex((userDataRow => userDataRow.id === uuid));

            console.log(userData.age);
            if(userData.username){
                users[userIndex].username = userData.username;
            }
            if(userData.age){
                users[userIndex].age = userData.age;
            }
            if(userData.hobbies){
                users[userIndex].hobbies = userData.hobbies;
            }


            resolve(users[userIndex]);
        });
    }

    async deleteUser(uuid) {
        return new Promise((resolve, reject) => {
            let user = users.find((userObject) => userObject.id === uuid);
            if (!user) {
                reject(`No user with id ${uuid} found`);
            }
            let rowIndex = users.findIndex((userDataRow => userDataRow.id === uuid));
            users.splice(rowIndex, 1);
            resolve(`user deleted successfully`);
        });
    }
}
export {Controller};