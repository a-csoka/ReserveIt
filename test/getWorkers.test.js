const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /logout', () => {
    let connection;
    let token;
    let BusinessID;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='getWorkers@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='getWorkers'");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('getWorkers@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('getWorkers', 'getWorkers', 'getWorkers@reserveit.hu', 'getWorkers', 'getWorkers', 'getWorkers@reserveit.hu', 'getWorkers')")
        BusinessID = businessData[0].insertId
    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/getWorkers')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/getWorkers')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Nem tartalmaz vállalkozás azonosítót', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getWorkers@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/getWorkers')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Nem tartalmaz vállalkozás azonosítót', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getWorkers@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/getWorkers')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha minden jó', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getWorkers@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/getWorkers')
        .send({
            BusinessID: BusinessID
        })
        .set('Cookie', [token])
        .expect(200)
    })
})