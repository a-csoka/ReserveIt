const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /respondToInvite', () => {
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
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='respondToInvite@hotmail.com' or email='respondToInvite2@hotmail.com'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('respondToInvite@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('respondToInvite', 'respondToInvite', 'respondToInvite@reserveit.hu', 'respondToInvite', 'respondToInvite', 'respondToInvite@reserveit.hu', 'respondToInvite')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [accountData[0].insertId, BusinessID])
        const accountData2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('respondToInvite2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_BusinessInvites(InviterID, InvitedID, BusinessID) VALUES(?, ?, ?)", [accountData[0].insertId, accountData2[0].insertId, BusinessID]);

    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/respondToInvite')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/respondToInvite')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha nem kap adatot', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "respondToInvite2@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/respondToInvite')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nem létezik a meghívó', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "respondToInvite@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/respondToInvite')
        .send({
            Response: "accept",
            BusinessID: BusinessID
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha elfogadja a meghívót', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "respondToInvite2@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/respondToInvite')
        .send({
            Response: "accept",
            BusinessID: BusinessID
        })
        .set('Cookie', [token])
        .expect(200)
        expect(response.body.redirect).toBe("accept")
    })

    it('Ha elutasítja a meghívót', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "respondToInvite2@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/respondToInvite')
        .send({
            Response: "deny",
            BusinessID: BusinessID
        })
        .set('Cookie', [token])
        .expect(200)
        expect(response.body.redirect).toBe("deny")
    })
})