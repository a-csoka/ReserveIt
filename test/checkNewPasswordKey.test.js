const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /checkNewPasswordKey', () => {
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
        await connection.query("DELETE FROM ReserveIt_ForgottenPasswordData WHERE VerificationID='tesztelostoken' or VerificationID='ezegyjotoken'");
        await connection.query("INSERT INTO ReserveIt_ForgottenPasswordData(AccountID, VerificationID, Time) VALUES(0, 'tesztelostoken', '2003-09-18 13:00')")
        await connection.query("INSERT INTO ReserveIt_ForgottenPasswordData(AccountID, VerificationID) VALUES(-1, 'ezegyjotoken')")
    });

    it('Ha nem létező linket ad meg', async () => {
        const response = await request
            .post('/checkNewPasswordKey')
            .send({
                EditKey: "eznemjo"
            })
            .expect(400)
            expect(response.body.State).toBe("Nem felismerhető link!")
    })

    
    it('Ha már lejárt linket ad meg', async () => {
        const response = await request
            .post('/checkNewPasswordKey')
            .send({
                EditKey: "tesztelostoken"
            })
            .expect(401)
            expect(response.body.State).toBe("Ez a link már lejárt!")
    })

    it('Ha minden megfelelő', async () => {
        const response = await request
            .post('/checkNewPasswordKey')
            .send({
                EditKey: "ezegyjotoken"
            })
            .expect(200)
            expect(response.body.State).toBeTruthy()
    })
})