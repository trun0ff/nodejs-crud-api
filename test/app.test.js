import {isValidUuid} from "../src/uuidChecker.js";

process.env.IS_TEST = 3001;

import chai, {expect} from "chai";
import {users} from "../src/data.js"
import {server} from "../src/index.js";
import chaiHttp from "chai-http";
import Controller from "../src/controller.js";

const testUserData = {
    "username": "test_user",
    "age":20,
    "hobbies":["h1", "h2"]
};

chai.use(chaiHttp);
describe('Requests', () => {
    beforeEach((done) => { //Before each test we empty the database
        users.length = 0;
        done();
    });

    describe('/GET /api/users', () => {
        it('it should GET all users', (done) => {
            chai.request(server)
                .get('/api/users')
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.users.length).to.eql(0);
                    done();
                })
                .catch(done)
        });
    });

    describe('/POST /api/users', () => {
        it('it should create user via POST request', (done) => {
            chai.request(server)
                .post('/api/users')
                .send(testUserData)
                .then((res) => {
                    const responseUsers = res.body.users;
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(responseUsers.length).to.eql(1);
                    expect(responseUsers[0]).to.have.property('id');
                    expect(isValidUuid(res.body.users[0].id)).to.be.eql(true);
                    expect(responseUsers[0].username).to.be.eql('test_user');
                    expect(responseUsers[0].age).to.be.eql(20);
                    expect(responseUsers[0].hobbies).to.be.eql(["h1", "h2"]);
                    done();
                })
                .catch(done)
        });
    });

    describe('/GET /api/users/{uuid}', () => {
        it('it should get user by uuid', (done) => {
            new Controller().createUser(testUserData);

            chai.request(server)
                .get('/api/users/' + users[0].id)
                .then((res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('id');
                    expect(isValidUuid(res.body.id)).to.be.eql(true);
                    expect(res.body.username).to.be.eql('test_user');
                    expect(res.body.age).to.be.eql(20);
                    expect(res.body.hobbies).to.be.eql(["h1", "h2"]);
                    done();
                })
                .catch(done)
        });
    });
});