const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /deleteOrganization', () => {
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
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='deleteOrganization@hotmail.com' or email='deleteOrganization2@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='deleteOrganization'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('deleteOrganization@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const accountData2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('deleteOrganization2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('deleteOrganization', 'deleteOrganization', 'deleteOrganization@reserveit.hu', 'deleteOrganization', 'deleteOrganization', 'deleteOrganization@reserveit.hu', 'deleteOrganization')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 0)", [accountData[0].insertId, BusinessID])
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [accountData2[0].insertId, BusinessID])
    });

    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .delete('/deleteOrganization')
        .expect(401)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .delete('/deleteOrganization')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(401)
    })

    it('Ha üresek a mezők', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "deleteOrganization@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .delete('/deleteOrganization')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nincs joga törölni', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "deleteOrganization@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .delete('/deleteOrganization')
        .send({
            BusinessID: BusinessID,
            Password: "Tesztelek2"
        })
        .set('Cookie', [token])
        .expect(403)
    })

    it('Ha rossz jelszót ad meg', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "deleteOrganization2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .delete('/deleteOrganization')
        .send({
            BusinessID: BusinessID,
            Password: "Tesztelek400"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Errors["OldPassword"]).toBe("Hibás jelszó!")
    })

    it('Ha minden jó', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "deleteOrganization2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .delete('/deleteOrganization')
        .send({
            BusinessID: BusinessID,
            Password: "Tesztelek2"
        })
        .set('Cookie', [token])
        .expect(200)
    })
})