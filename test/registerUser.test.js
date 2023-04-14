const app = require('../backend/server')
const request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /registerUser', () => {
    let connection;
    beforeEach(async () => {  
      connection = await createPool({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE,
        port: parseInt(process.env.SQL_PORT),
      });  
      await connection.query("DELETE FROM ReserveIt_Accounts WHERE email='csokacsaba2@hotmail.com'");
    });


    it('Ha nem kap adatot.', async () => {
        const response = await request
            .post('/registerUser')
            .send({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                rePassword: ""
            })
            .expect(400)
    })
    it('Ha egyeznek meg a jelszavak.', async () => {
        const response = await request
            .post('/registerUser')
            .send({
                firstName: "Teszt",
                lastName: "Elek",
                email: "hdvirtualdragon@gmail.com",
                password: "teszt",
                rePassword: "nemteszt"
            })
            .expect(400)
    })
    it('Ha nem megfelelő jelszavat ad meg.', async () => {
        const response = await request
            .post('/registerUser')
            .send({
                firstName: "Teszt",
                lastName: "Elek",
                email: "hdvirtualdragon@gmail.com",
                password: "teszt",
                rePassword: "teszt"
            })
            .expect(400)
    })
    it('Ha rossz az email formátum.', async () => {
        const response = await request
            .post('/registerUser')
            .send({
                firstName: "Teszt",
                lastName: "Elek",
                email: "eznemigazanegyjoemail",
                password: "Tesztelek2",
                rePassword: "Tesztelek2"
            })
            .expect(400)
    })
    it('Ha foglalt email címet ad meg.', async () => {
        const response = await request
            .post('/registerUser')
            .send({
                firstName: "Teszt",
                lastName: "Elek",
                email: "acsokacsaba@gmail.com",
                password: "Tesztelek2",
                rePassword: "Tesztelek2"
            })
            .expect(400)
        expect(response.body["Email"]).toBe('Ez az email cím már foglalt!')
    })
    it('Ez pedig a megfelelő.', async () => {
        const response = await request
            .post('/registerUser')
            .send({
                firstName: "Teszt",
                lastName: "Elek",
                email: "csokacsaba2@hotmail.com",
                password: "Tesztelek2",
                rePassword: "Tesztelek2"
            })
            .expect(200)
        expect(response.body["Email"]).toBe("Erősítsd meg az email címedet az arra küldött levélben!")
    })


})