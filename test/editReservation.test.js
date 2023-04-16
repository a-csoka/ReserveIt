const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");
const moment = require("moment")

function addMinutes(date, minutes) {
    date.setMinutes(date.getMinutes() + minutes);
  
    return date;
}

describe('[POST] /editReservation', () => {
    let connection;
    let BusinessID;
    let ReservationID;
    let OwnerID;
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='editReservation@hotmail.com' or email='editReservation2@hotmail.com' or email='editReservation3@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='editReservation' or Name='editReservation2' or Name='editReservation3'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('editReservation@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const accountData2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('editReservation2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('editReservation3@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('editReservation', 'editReservation', 'editReservation@reserveit.hu', 'editReservation', 'editReservation', 'editReservation@reserveit.hu', 'editReservation')")
        await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('editReservation2', 'editReservation', 'editReservation@reserveit.hu', 'editReservation', 'editReservation', 'editReservation@reserveit.hu', 'editReservation')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [accountData2[0].insertId, BusinessID])
        OwnerID = accountData2[0].insertId
        const reservationData = await connection.query("INSERT INTO ReserveIt_Reservations(Name, ReserverID, WorkerID, BusinessID, Start, End, Price, Phone, Status) VALUES('Unit Test', ?, ?, ?, ?, ?, '69', '', 'Pending')", [accountData2[0].insertId, accountData[0].insertId, BusinessID, moment(addMinutes(new Date(), 1)).format('YYYY-MM-DD HH:mm'), moment(addMinutes(new Date(), 3)).format('YYYY-MM-DD HH:mm')])
        ReservationID = reservationData[0].insertId
    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .post('/editReservation')
        .expect(401)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .post('/editReservation')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(401)
    })


    it('Ha nem kap adatot', async() => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/editReservation')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha az ár nem szám', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: ReservationID,
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: "22:00",
            End: "23:00",
            Price: "szöveg",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha az időpont vége hamarabb van, mint a kezdete', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: ReservationID,
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: "2003-09-18",
            Start: "23:00",
            End: "22:00",
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha a dátum kisebb, mint a mai', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: ReservationID,
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: "2003-09-18",
            Start: moment(new Date()).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nem létezik az időpont', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: "nem letezik",
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(401)
    })

    it('Ha nem a vállalkozás tagja a hozzáadó', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: ReservationID,
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(401)
    })

    it('Ha az időpont szerkesztő nem a vállalkozás tagja', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: ReservationID,
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: "nemletezik",
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(401)
    })

    it('Ha a dolgozó nem létezik akinek az időpontot adják', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: ReservationID,
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: "nemletezik",
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha már a dolgozónak van abban az időben egy időpontja', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]

        await request
        .post('/addReservation')
        .send({
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 1)).format('HH:mm'),
            End: "23:59",
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(201)
        
        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: ReservationID,
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 5)).format('HH:mm'),
            End: moment(addMinutes(new Date(), 8)).format('HH:mm'),
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha minden rendben van', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "editReservation2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]
        
        const response = await request
        .post('/editReservation')
        .send({
            ReservationID: ReservationID,
            BusinessID: BusinessID,
            Name: "Unit Test",
            WorkerID: ""+OwnerID,
            Date: moment(new Date()).format('YYYY-MM-DD'),
            Start: moment(addMinutes(new Date(), 10)).format('HH:mm'),
            End: moment(addMinutes(new Date(), 13)).format('HH:mm'),
            Price: "10",
            Email: "editReservation@hotmail.com",
            Phone: ""
        })
        .set('Cookie', [token])
        .expect(200)
        expect(response.body.errorMsg).toBe("Foglalás szerkesztve!")
    })
})