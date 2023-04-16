const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[GET] /getBusinessInvites', () => {
    let connection;
    let token;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='getBusinessInvites@reserveit.hu'");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('getBusinessInvites@reserveit.hu', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .get('/getBusinessInvites')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .get('/getBusinessInvites')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha minden rendben van', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getBusinessInvites@reserveit.hu",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .get('/getBusinessInvites')
        .set('Cookie', [token])
        .expect(200)
    })
})