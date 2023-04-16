const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /getUserFromEmail', () => {
    let connection;
    let AccountID
    let token;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='getUserFromEmail@hotmail.com'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('getUserFromEmail@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        AccountID = accountData[0].insertId
    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/getUserFromEmail')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/getUserFromEmail')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha nincs megadva email', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getUserFromEmail@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/getUserFromEmail')
        .send({
            Email: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha kap emailt, de nincs hozzá felhasználó', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getUserFromEmail@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/getUserFromEmail')
        .send({
            Email: "eznemegyvalosemail"
        })
        .set('Cookie', [token])
        .expect(400)
    })

    
    it('Ha minden rendben van', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "getUserFromEmail@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/getUserFromEmail')
        .send({
            Email: "getUserFromEmail@hotmail.com"
        })
        .set('Cookie', [token])
        .expect(200)
        expect({
            FirstName: "Teszt", 
            LastName: "Elek",
            AccountID: AccountID
        })
    })
})