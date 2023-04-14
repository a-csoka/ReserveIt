const app = require('../backend/server')
const request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /loginUser', () => {
    let connection;
    beforeEach(async () => {  
      connection = await createPool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE,
        port: parseInt(process.env.SQL_PORT),
      });  
      await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='csokacsaba2@hotmail.com' OR email='csokacsaba3@hotmail.com'");
      await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('csokacsaba2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 0)");
      await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('csokacsaba3@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
    });

    it('Ha üres mezőt hagy.', async () => {
        const response = await request
            .post('/loginUser')
            .send({
                email: "",
                password: "",
            })
            .expect(400)
    })

    it('Ha olyan emailt ad, amely nem létezik a rendszerben.', async () => {
        const response = await request
            .post('/loginUser')
            .send({
                email: "mlmkalapomat@acsoka.hu",
                password: "RepaRetekMogyoro2",
            })
            .expect(400)
        expect(response.body["Email"]).toBe("Hibás email vagy jelszó!")
        expect(response.body["Password"]).toBe("Hibás email vagy jelszó!")
    })

    it('Ha rossz jelszót ad meg.', async () => {
        const response = await request
            .post('/loginUser')
            .send({
                email: "csokacsaba3@hotmail.com",
                password: "nemjojelszo",
            })
            .expect(400)
        expect(response.body["Email"]).toBe("Hibás email vagy jelszó!")
        expect(response.body["Password"]).toBe("Hibás email vagy jelszó!")
    })

    it('Ha még meg nem erősített fiókkal jelentkezik be.', async () => {
        const response = await request
            .post('/loginUser')
            .send({
                email: "csokacsaba2@hotmail.com",
                password: "Tesztelek2",
            })
            .expect(400)
        expect(response.body["Email"]).toBe("Ez az email cím még nincs megerősítve!")
    })

    it('Sikeres bejelentkezés', async () => {
        const response = await request
            .post('/loginUser')
            .send({
                email: "csokacsaba3@hotmail.com",
                password: "Tesztelek2",
            })
            .expect(200)
    })
})