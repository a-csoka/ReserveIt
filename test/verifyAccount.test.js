const app = require('../backend/server')
const request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /verifyAccount', () => {
    let connection;
    beforeEach(async () => {  
      connection = await createPool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE,
        port: parseInt(process.env.SQL_PORT),
      });  
      await connection.query("DELETE FROM ReserveIt_VerificationData WHERE AccountID=-1 OR AccountID=-2");
      await connection.query("INSERT INTO ReserveIt_VerificationData(AccountID, VerificationID, Time) VALUES(-2, 'ezilyenlejartkulcs', '2003-09-08 18:00')");
      await connection.query("INSERT INTO ReserveIt_VerificationData(AccountID, VerificationID) VALUES(-1, 'ezilyenteszteloskulcs')");
    });


    it('Ha hibás kódot kap.', async () => {
        const response = await request
            .post('/verifyAccount')
            .send({
                EditKey: "semmi"
            })
            .expect(401)
            expect(response.body.State).toBe("Ez a link nem megfelelő!")
    })

    it('Hogyha lejárt kulcsot kap.', async () => {
        const response = await request
            .post('/verifyAccount')
            .send({
                EditKey: "ezilyenlejartkulcs"
            })
            .expect(402)
        expect(response.body.State).toBe("Ez a link már lejárt!")
    })

    it('Ha létező kulcsot kap.', async () => {
        const response = await request
            .post('/verifyAccount')
            .send({
                EditKey: "ezilyenteszteloskulcs"
            })
            .expect(200)
        expect(response.body.State).toBe("Az email címed sikeresen megerősítésre került!")
    })
})