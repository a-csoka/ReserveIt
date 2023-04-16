const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /getReservations', () => {
    let connection;
    let BusinessID;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='getReservations@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='getReservations'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('getReservations@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('getReservations', 'getReservations', 'getReservations@reserveit.hu', 'getReservations', 'getReservations', 'getReservations@reserveit.hu', 'getReservations')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 0)", [accountData[0].insertId, BusinessID])
    });

    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/getReservations')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/getReservations')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha nem kap adatot', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getReservations@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/getReservations')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha minden rendben', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getReservations@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/getReservations')
        .send({
            BusinessID: BusinessID,
            Time: "2023-04-15"
        })
        .set('Cookie', [token])
        .expect(200)
    })
})