const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /getUserReservations', () => {
    let connection;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='csokacsaba7@hotmail.com'");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('csokacsaba7@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
    })

    it('Ha nincs bejelentkezve.', async () => {
        const response = await request
            .post('/getUserReservations')
            .send()
            .expect(400)
    })

    it('Ha hibás a token.', async () => {
        const response = await request
            .post('/getUserReservations')
            .set('Cookie', ["userToken=ezegyhibástokenhaló"])
            .send()
            .expect(400)
    })

    it('Ha nem kap dátumot', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "csokacsaba7@hotmail.com",
            password: "Tesztelek2",
        })
        var token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
            .post('/getUserReservations')
            .set('Cookie', [token])
            .expect(400)
    })

    it('Ha minden rendben.', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "csokacsaba7@hotmail.com",
            password: "Tesztelek2",
        })
        var token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
            .post('/getUserReservations')
            .send({Time: "2023-04-14"})
            .set('Cookie', [token])
            .expect(200)
    })
})