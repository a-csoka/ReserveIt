const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");
const moment = require('moment')

function addMinutes(date, minutes) {
    date.setMinutes(date.getMinutes() + minutes);
  
    return date;
}

describe('[POST] /addReservation', () => {
    let connection;
    let OwnerID;
    let BusinessID;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='addReservation@hotmail.com' or email='addReservation2@hotmail.com' or email='addReservation3@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='addReservation' or Name='addReservation2' or Name='addReservation3'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('addReservation@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const accountData2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('addReservation2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('addReservation3@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('addReservation', 'addReservation', 'addReservation@reserveit.hu', 'addReservation', 'addReservation', 'addReservation@reserveit.hu', 'addReservation')")
        await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('addReservation2', 'addReservation', 'addReservation@reserveit.hu', 'addReservation', 'addReservation', 'addReservation@reserveit.hu', 'addReservation')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [accountData2[0].insertId, BusinessID])
        OwnerID = accountData2[0].insertId
    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/addReservation')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/addReservation')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha nem kap adatot', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "addReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/addReservation')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha az ár nem szám', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "addReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: "22:00",
            End: "23:00",
            Price: "szöveg",
            Email: "addReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha az időpont vége hamarabb van, mint a kezdete', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "addReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: "2003-09-18",
            Start: "23:00",
            End: "22:00",
            Price: "10",
            Email: "addReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha a dátum kisebb, mint a mai', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "addReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: "2003-09-18",
            Start: moment(new Date()).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "addReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nem a vállalkozás tagja a hozzáadó', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "addReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "addReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(401)
    })

    it('Ha nem létező felhasználónak ad időpontot', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "addReservation2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "nemletezek@ads.hu",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha dolgozó nem létezik, akinek az időpontot akarják adni', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "addReservation2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: "nemletezik",
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "addReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha működik + Ha már van a dolgozónak akkor egy időpontja', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "addReservation2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "addReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(201)
        expect(response.body.errorMsg).toBe("Foglalás létrehozva!")
        
        const response2 = await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "addReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
        expect(response2.body.errorMsg).toBe("Ebben az intervallumban már van egy időpontja a dolgozónak!")
    })
})

