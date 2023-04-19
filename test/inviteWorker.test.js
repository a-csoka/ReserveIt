const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /inviteWorker', () => {
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
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='inviteWorker@hotmail.com' or email='inviteWorker2@hotmail.com' or email='inviteWorker3@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='inviteWorker' or Name='inviteWorker2' or Name='inviteWorker3'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('inviteWorker@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const accountData2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('inviteWorker2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('inviteWorker3@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('inviteWorker', 'inviteWorker', 'inviteWorker@reserveit.hu', 'inviteWorker', 'inviteWorker', 'inviteWorker@reserveit.hu', 'inviteWorker')")
        await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('inviteWorker2', 'inviteWorker', 'inviteWorker@reserveit.hu', 'inviteWorker', 'inviteWorker', 'inviteWorker@reserveit.hu', 'inviteWorker')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 0)", [accountData[0].insertId, BusinessID])
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [accountData2[0].insertId, BusinessID])
    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/inviteWorker')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/inviteWorker')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha nem kap adatot', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "inviteWorker@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/inviteWorker')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nincs joga meghívni', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "inviteWorker@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/inviteWorker')
        .send({
            BusinessID: BusinessID,
            Email: "teszt@teszt.hu"
        })
        .set('Cookie', [token])
        .expect(403)
        expect(response.body.Err).toBe("Ehhez nincs jogod!")
    })

    it('Ha nem található a megadott email cím', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "inviteWorker2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/inviteWorker')
        .send({
            BusinessID: BusinessID,
            Email: "nemtalalhatoemail@inviteWorker.hu"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Err).toBe("Nem található a megadott email cím!")
    })

    it('Ha már a vállalkozás tagja', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "inviteWorker2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/inviteWorker')
        .send({
            BusinessID: BusinessID,
            Email: "inviteWorker@hotmail.com"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Err).toBe("Már hozzá van adva a vállalkozáshoz!")
    })

    it('Ha működik + Ha már kapott meghívót', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "inviteWorker2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        await request
        .post('/inviteWorker')
        .send({
            BusinessID: BusinessID,
            Email: "inviteWorker3@hotmail.com"
        })
        .set('Cookie', [token])
        .expect(200)

        const response = await request
        .post('/inviteWorker')
        .send({
            BusinessID: BusinessID,
            Email: "inviteWorker3@hotmail.com"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Err).toBe("Már meg van hívva a vállalkozásba!")
    })
})