const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[DELETE] /removeReservation', () => {
    let connection;
    let ReservationID;
    let BusinessID
    beforeEach(async () => {  
        connection = await createPool({
            host: process.env.SQL_HOST,
            user: process.env.SQL_USER,
            password: process.env.SQL_PASSWORD,
            database: process.env.SQL_DATABASE,
            port: parseInt(process.env.SQL_PORT),
        });  
        await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='removeReservation@hotmail.com' or email='removeReservation2@hotmail.com' or email='removeReservation3@hotmail.com'");
        await connection.query("DELETE FROM ReserveIt_Businesses WHERE Name='removeReservation' or Name='removeReservation2' or Name='removeReservation3'");
        const accountData = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('removeReservation@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const accountData2 = await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('removeReservation2@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        await connection.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName, isEmailValidated) VALUES('removeReservation3@hotmail.com', '$2b$10$vL9vIEOaaSC6YV4f5J8T.eqbUAwMI8KfIAQREgZ/CtnvwU3uP0Kte', 'Teszt', 'Elek', 1)");
        const businessData = await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('removeReservation', 'removeReservation', 'removeReservation@reserveit.hu', 'removeReservation', 'removeReservation', 'removeReservation@reserveit.hu', 'removeReservation')")
        await connection.query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES('removeReservation2', 'removeReservation', 'removeReservation@reserveit.hu', 'removeReservation', 'removeReservation', 'removeReservation@reserveit.hu', 'removeReservation')")
        BusinessID = businessData[0].insertId
        await connection.query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 0)", [accountData[0].insertId, BusinessID])
        const reservationData = await connection.query("INSERT INTO ReserveIt_Reservations(Name, ReserverID, WorkerID, BusinessID, Start, End, Price, Phone, Status) VALUES('Unit Test', ?, ?, ?, '2023-04-16 13:30', '2023-14-16 14:30', '1000', '', 'Pending')", [accountData2[0].insertId, accountData[0].insertId, BusinessID])
        ReservationID = reservationData[0].insertId
    });

   
    it('Ha nincs bejelentkezve', async () => {
        const response = await request
        .delete('/removeReservation')
        .expect(400)
    })

    it('Ha a token hibás', async () => {
        const response = await request
        .delete('/removeReservation')
        .set('Cookie', ["userToken=ezegyhibástokenhaló"])
        .expect(400)
    })

    it('Ha nem kap adatot', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "removeReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]


        const response = await request
        .delete('/removeReservation')
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nem létezik a foglalás', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "removeReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]


        const response = await request
        .delete('/removeReservation')
        .send({
            ReservationID: "NEMLETEZIK"
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha nem a vállalkozás tagja', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "removeReservation2@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]


        const response = await request
        .delete('/removeReservation')
        .send({
            ReservationID: ReservationID
        })
        .set('Cookie', [token])
        .expect(400)
    })

    it('Ha minden rendben', async () => {
        const source = await request
        .post('/loginUser')
        .send({
            email: "removeReservation@hotmail.com",
            password: "Tesztelek2",
        })
        const token = source.header["set-cookie"][0].split(";")[0]


        const response = await request
        .delete('/removeReservation')
        .send({
            ReservationID: ReservationID
        })
        .set('Cookie', [token])
        .expect(200)
    })
})