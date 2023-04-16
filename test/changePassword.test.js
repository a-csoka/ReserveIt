const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /changePassword', () => {
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
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='changePassword@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_ForgottenPasswordData WHERE VerificationID='tesztelostoken22'");

        const account = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('changePassword@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_ForgottenPasswordData(AccountID, VerificationID) VALUES(?, 'changePassword')", [account[0].insertId])
    });
    

    it('[Elfelejtett jelszó] Nem létező link', async () => {
        const response = await request
            .post('/changePassword')
            .send({
                EditKey: "nemletezolinkEMBER"
            })
            .expect(401)
    })

    it('[Elfelejtett jelszó] Üres mezők', async () => {
        const response = await request
            .post('/changePassword')
            .send({
                EditKey: "changePassword",
                password: "",
                RePassword: ""
            })
            .expect(400)
    })

    it('[Elfelejtett jelszó] Eltérő jelszavak', async () => {
        const response = await request
            .post('/changePassword')
            .send({
                EditKey: "changePassword",
                password: "Tesztelek1",
                RePassword: "Tesztelek2"
            })
            .expect(400)
    })

    it('[Elfelejtett jelszó] Nem megfelelő jelszó', async () => {
        const response = await request
            .post('/changePassword')
            .send({
                EditKey: "changePassword",
                password: "eznemjo",
                RePassword: "eznemjo"
            })
            .expect(400)
    })

    it('[Elfelejtett jelszó] Ha a jelszó ugyanaz, mint a jelenlegi', async () => {
        const response = await request
            .post('/changePassword')
            .send({
                EditKey: "changePassword",
                password: "Tesztelek2",
                RePassword: "Tesztelek2"
            })
            .expect(400)
            expect(response.body.Errors["Password"]).toBe("A jelszavad nem lehet ugyanaz mint a jelenlegi!")
            expect(response.body.Errors["RePassword"]).toBe("A jelszavad nem lehet ugyanaz mint a jelenlegi!")
    })

    it('[Elfelejtett jelszó] Ha minden rendben van', async () => {
        const response = await request
            .post('/changePassword')
            .send({
                EditKey: "changePassword",
                password: "Tesztelek3",
                RePassword: "Tesztelek3"
            })
            .expect(200)
            expect(response.body.Errors["Password"]).toBe("A jelszavad sikeresen megváltoztattuk!")
            expect(response.body.Errors["RePassword"]).toBe("A jelszavad sikeresen megváltoztattuk!")
    })

    it('[Jelszó változtatás] Ha nincs bejelentkezve', async () => {
        const response = await request
            .post('/changePassword')
            .send({
                OldPassword: "random"
            })
            .expect(403)
    })

    
    it('[Jelszó változtatás] Ha a token hibás', async () => {
        const response = await request
        .post('/changePassword')
        .send({
            OldPassword: "random"
        })
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(403)
    })

    it('[Jelszó változtatás] Ha a mezők üresek', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "changePassword@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/changePassword')
        .send({
            OldPassword: "random",
            password: "",
            RePassword: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('[Jelszó változtatás] Ha a jelszavak nem egyeznek meg', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "changePassword@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/changePassword')
        .send({
            OldPassword: "random",
            password: "Tesztelek1",
            RePassword: "Tesztelek2"
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('[Jelszó változtatás] Ha a jelszavak nem megfelelőek', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "changePassword@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/changePassword')
        .send({
            OldPassword: "random",
            password: "eznemjo",
            RePassword: "eznemjo"
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('[Jelszó változtatás] Ha hibás régi jelszót ad meg', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "changePassword@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/changePassword')
        .send({
            OldPassword: "Tesztele3",
            password: "Tesztelek1",
            RePassword: "Tesztelek1"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Errors["OldPassword"]).toBe("Hibás jelszó!")
    })

    it('[Jelszó változtatás] Ha a megadott jelszó ugyanaz, mint a jelenlegi', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "changePassword@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/changePassword')
        .send({
            OldPassword: "Tesztelek2",
            password: "Tesztelek2",
            RePassword: "Tesztelek2"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.Errors["Password"]).toBe("A jelszavad nem lehet ugyanaz mint a jelenlegi!")
        expect(response.body.Errors["RePassword"]).toBe("A jelszavad nem lehet ugyanaz mint a jelenlegi!")
    })

    it('[Jelszó változtatás] Ha minden rendben van', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "changePassword@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/changePassword')
        .send({
            OldPassword: "Tesztelek2",
            password: "Tesztelek3",
            RePassword: "Tesztelek3"
        })
        .set('Cookie', [token])
        .expect(200)
        expect(response.body.Errors["OldPassword"]).toBe("A jelszavad sikeresen megváltoztattuk!")
    })
})
