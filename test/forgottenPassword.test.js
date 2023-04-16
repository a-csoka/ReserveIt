const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /forgottenPassword', () => {
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
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='forgottenPassword@hotmail.com' or email='forgottenPassword2@hotmail.com' or email='forgottenPassword3@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_ForgottenPasswordData WHERE VerificationID='tesztelostoken22'");

        const account = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('forgottenPassword@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_ForgottenPasswordData(AccountID, VerificationID) VALUES(?, 'tesztelostoken2')", [account[0].insertId])

        const account2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('forgottenPassword2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_ForgottenPasswordData(AccountID, VerificationID, Time) VALUES(?, 'tesztelostoken2', '2003-09-18 16:00')", [account2[0].insertId])

        const account3 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('forgottenPassword3@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
    });

    it('Ha nem létező emailt ad meg', async () => {
        const response = await request
        .post('/forgottenPassword')
        .send({
            email: "nemletezoemail"
        })
        .expect(400)
        expect(response.body["Email"]).toBe("Amennyiben megfelelő a cím elküldtük a levelet!")
    })

    it('Ha túl sok emailt küld 10 percen belül', async () => {
        const response = await request
        .post('/forgottenPassword')
        .send({
            email: "forgottenPassword@hotmail.com"
        })
        .expect(403)
    })

    it('Ha küldött kérelmet, de letelt a 10 perc', async () => {
        const response = await request
        .post('/forgottenPassword')
        .send({
            email: "forgottenPassword2@hotmail.com"
        })
        .expect(200)
        expect(response.body["Email"]).toBe("Amennyiben megfelelő a cím elküldtük a levelet!")
    })

    it('Normális eset', async () => {
        const response = await request
        .post('/forgottenPassword')
        .send({
            email: "forgottenPassword3@hotmail.com"
        })
        .expect(200)
        expect(response.body["Email"]).toBe("Amennyiben megfelelő a cím elküldtük a levelet!")
    })
})
