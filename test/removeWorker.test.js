const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[DELETE] /removeWorker', () => {
    let connection;
    let BusinessID;
    let KickID;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='removeWorker@hotmail.com' or email='removeWorker2@hotmail.com' or email='removeWorker3@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='removeWorker' or Name='removeWorker2' or Name='removeWorker3'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('removeWorker@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const accountData2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('removeWorker2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('removeWorker3@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('removeWorker', 'removeWorker', 'removeWorker@reserveit.hu', 'removeWorker', 'removeWorker', 'removeWorker@reserveit.hu', 'removeWorker')")
        await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('removeWorker2', 'removeWorker', 'removeWorker@reserveit.hu', 'removeWorker', 'removeWorker', 'removeWorker@reserveit.hu', 'removeWorker')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 0)", [accountData[0].insertId, BusinessID])
        KickID = accountData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [accountData2[0].insertId, BusinessID])
    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .delete('/removeWorker')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .delete('/removeWorker')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha nem kap adatot', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "removeWorker@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .delete('/removeWorker')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nincs joga', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "removeWorker@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .delete('/removeWorker')
        .send({
            BusinessID: BusinessID,
            KickID: KickID
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha minden rendben', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "removeWorker2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .delete('/removeWorker')
        .send({
            BusinessID: BusinessID,
            KickID: KickID
        })
        .set('Cookie', [token])
        .expect(200)
    })
})