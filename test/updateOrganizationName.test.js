const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /updateOrganizationName', () => {
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
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='updateOrganizationName@hotmail.com' or email='updateOrganizationName2@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='updateOrganizationName' or Name='updateOrganizationName2' or Name='updateOrganizationName3'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('updateOrganizationName@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const accountData2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('updateOrganizationName2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('updateOrganizationName', 'updateOrganizationName', 'updateOrganizationName@reserveit.hu', 'updateOrganizationName', 'updateOrganizationName', 'updateOrganizationName@reserveit.hu', 'updateOrganizationName')")
        await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('updateOrganizationName2', 'updateOrganizationName', 'updateOrganizationName@reserveit.hu', 'updateOrganizationName', 'updateOrganizationName', 'updateOrganizationName@reserveit.hu', 'updateOrganizationName')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 0)", [accountData[0].insertId, BusinessID])
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [accountData2[0].insertId, BusinessID])
    });

    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/updateOrganizationName')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/updateOrganizationName')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha nincs mező', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "updateOrganizationName@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/updateOrganizationName')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nincs joga', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "updateOrganizationName@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/updateOrganizationName')
        .send({
            BusinessID: BusinessID,
            Password: "rosszjelszo",
            newName: "ujNev"
        })
        .set('Cookie', [token])
        .expect(403)
    })

    it('Ha rossz jelszot ad meg', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "updateOrganizationName2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/updateOrganizationName')
        .send({
            BusinessID: BusinessID,
            Password: "rosszjelszo",
            newName: "ujNev"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Errors["OldPassword"]).toBe("Hibás jelszó!")
    })

    it('Ha már ez a vállalkozásának a neve', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "updateOrganizationName2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/updateOrganizationName')
        .send({
            BusinessID: BusinessID,
            Password: "Tesztelek2",
            newName: "updateOrganizationName"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Errors["OrgName"]).toBe("Már ez a vállalkozásod neve!")
    })

    it('Ha már más vállalkozásának ez a neve', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "updateOrganizationName2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/updateOrganizationName')
        .send({
            BusinessID: BusinessID,
            Password: "Tesztelek2",
            newName: "updateOrganizationName2"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Errors["OrgName"]).toBe("Ez a vállalkozás név már foglalt!")
    })

    it('Ha minden megfelelő', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "updateOrganizationName2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/updateOrganizationName')
        .send({
            BusinessID: BusinessID,
            Password: "Tesztelek2",
            newName: "updateOrganizationName3"
        })
        .set('Cookie', [token])
        .expect(200)
        expect(response.body.Errors["OrgName"]).toBe("A vállalkozásod nevét sikeresen megváltoztattuk!")
    })
})