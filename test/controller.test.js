import Controller from "../src/controller.js"
import {expect} from "chai";
import {isValidUuid} from "../src/uuidChecker.js";
import {users} from "../src/data.js"

describe('get data method', () => {
    before(() => {
        users.length = 0;
    })
    it('should be empty', async () => {
        const users = await new Controller().getUsers();
        expect(users).to.eql({users: []});
    });
});

describe('work with user methods', () => {
    const userData = {
        "username": "test_user",
        "age":20,
        "hobbies":["h1", "h2"]
    };
    beforeEach(() => {
        users.length = 0;
    })
    it('creates user with UUID id', async () => {
       const responseData = await new Controller().createUser(userData);
       expect(responseData.users[0]).to.have.property('id');
       expect(isValidUuid(responseData.users[0].id)).to.equal(true);
    });
    it('deletes the user', async () => {
        const controller = new Controller();
        const data = await controller.createUser(userData);
        expect(users.length).to.eql(1);
        await controller.deleteUser(data.users[0].id);
        expect(users.length).to.eql(0);
    });
});
