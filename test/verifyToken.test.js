const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");


describe('[POST] /verifyToken', () => {
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
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='csokacsaba5@hotmail.com'");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('csokacsaba5@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
    })
       
    it('Nincs bejelentkezve', async () => {
        const response = await request
            .get('/verifyToken')
            .expect(200)
        expect(response.body.tokenState).toBeFalsy()
    })

    it('Rossz token', async () => {
        const response = await request
            .get('/verifyToken')
            .set('Cookie', ["userToken=HEBIHEBIHEBIHEBI"])
            .expect(400)
    })

    it('Hibás adatokat tartalmazó token', async () => {
        const response = await request
            .get('/verifyToken')
            .set('Cookie', ["userToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBY2NvdW50SUQiOjI4NSwiRW1haWwiOiJuZW1qbyIsImlhdCI6MTY4MTQ5OTU4MX0.N7D6QDg9kCKCk2CcN9q9m6XcG640B61OmjoWP31eel0"])
            .expect(400)
    })

    it('Be van jelentkezve', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "csokacsaba4@hotmail.com",
            password: "Tesztelek2",
        })
        var token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
            .get('/verifyToken')
            .set('Cookie', [token])
            .expect(200)
        expect(response.body.tokenState).toBeTruthy()
    })
})
