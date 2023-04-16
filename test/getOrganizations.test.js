const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[GET] /getOrganizations', () => {
    let connection;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='csokacsaba6@hotmail.com'");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('csokacsaba6@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
    })

    it('Ha nincs bejelentkezve.', async () => {
        const response = await request
            .get('/getOrganizations')
            .send()
            .expect(400)
    })

    it('Ha hibás a token.', async () => {
        const response = await request
            .get('/getOrganizations')
            .set('Cookie', ["userToken=ezegyhibástokenhaló"])
            .send()
            .expect(400)
    })

    it('Ha minden rendben.', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "csokacsaba6@hotmail.com",
            password: "Tesztelek2",
        })
        var token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
            .get('/getOrganizations')
            .set('Cookie', [token])
            .expect(200)
    })
})