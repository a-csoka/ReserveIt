const app = require('../backend/server')
var request = require('supertest')(app)
const dotenv = require('dotenv').config()
const { createPool } = require("mysql2/promise");

describe('[POST] /recaptcha', () => {
    it('Ha nem kap tokent', async () => {
        const response = await request
        .post('/recaptcha')
        .expect(500)
    })
})