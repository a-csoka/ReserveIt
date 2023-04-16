const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /createOrganization', () => {
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
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='createOrganization@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='createOrganization'");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('createOrganization@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
    });

    it('Ha üres mező van', async () => {
        const response = await request
        .post('/createOrganization')
        .send({
            OrgName: "",
            OrgLocation: "",
            OrgPhone: "",
            OrgEmail: "",

            OwnerName: "",
            OwnerMail: "",
            OwnerPhone: ""
        })
        .expect(400)
    })

    it('Ha rossz az email formátum', async () => {
        const response = await request
        .post('/createOrganization')
        .send({
            OrgName: "createOrganization",
            OrgLocation: "createOrganization",
            OrgPhone: "createOrganization",
            OrgEmail: "nemjo",

            OwnerName: "createOrganization",
            OwnerMail: "createOrganization",
            OwnerPhone: "createOrganization"
        })
        .expect(400)
    })

    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/createOrganization')
        .send({
            OrgName: "createOrganization",
            OrgLocation: "createOrganization",
            OrgPhone: "createOrganization",
            OrgEmail: "createOrganization@reserveit.hu",

            OwnerName: "createOrganization",
            OwnerMail: "createOrganization@reserveit.hu",
            OwnerPhone: "createOrganization"
        })
        .expect(401)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/createOrganization')
        .send({
            OrgName: "createOrganization",
            OrgLocation: "createOrganization",
            OrgPhone: "createOrganization",
            OrgEmail: "createOrganization@reserveit.hu",

            OwnerName: "createOrganization",
            OwnerMail: "createOrganization@reserveit.hu",
            OwnerPhone: "createOrganization"
        })
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(401)
    })

    it('Ha foglalt a vállalkozás neve és sikeres létrehozás', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "createOrganization@hotmail.com",
            password: "Tesztelek2",
        })
        token = source.header["set-cookie"][0].split(";")[0]

        await request
        .post('/createOrganization')
        .send({
            OrgName: "createOrganization",
            OrgLocation: "createOrganization",
            OrgPhone: "createOrganization",
            OrgEmail: "createOrganization@reserveit.hu",

            OwnerName: "createOrganization",
            OwnerMail: "createOrganization@reserveit.hu",
            OwnerPhone: "createOrganization"
        })
        .set('Cookie', [token])

        const response = await request
        .post('/createOrganization')
        .send({
            OrgName: "createOrganization",
            OrgLocation: "createOrganization",
            OrgPhone: "createOrganization",
            OrgEmail: "createOrganization@reserveit.hu",

            OwnerName: "createOrganization",
            OwnerMail: "createOrganization@reserveit.hu",
            OwnerPhone: "createOrganization"
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response.body.errors.OrgName).toBe("Ez a név már foglalt!")
    })
})