const express = require('express')
const mysql = require('mysql2')
const port = process.env.PORT || 5000
const emailValidator = require("email-validator")
const bcrypt = require("bcrypt")
const nodemailer = require('nodemailer')
const fetch = require('isomorphic-fetch')
const cors = require('cors')
const crypto = require('crypto')
const app = express()
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const moment = require('moment')

require('dotenv').config();

app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://127.0.0.1:3000'}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

function isFieldEmpty(text){
    if(typeof(text) !== "undefined"){
        if(text.replace(" ", "") !== ""){
            return false
        }
    }
    return true
}

console.log(process.env.DUMMY_TEXT)

const sql_con = mysql.createConnection({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DATABASE,
    port: parseInt(process.env.SQL_PORT),
});


sql_con.connect(function(err) {
    if (err) {
      return console.error('[Adatbázis]: ' + err.message);
    }
    console.log('[Adatbázis]: A kapcsolat sikeresen létrejött!');
})

const mail_con = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.MAIL_ADDRESS,
      pass: process.env.MAIL_PASSWORD
    }
})
mail_con.verify().then(console.log("[Mail]: A kapcsolat sikeresen létrejött!")).catch(console.error);

require("./paths/loginUser.js")(app, isFieldEmpty, sql_con, bcrypt, emailValidator, jwt);
require("./paths/registerUser.js")(app, isFieldEmpty, sql_con, bcrypt, emailValidator, crypto, mail_con);
require("./paths/verifyAccount.js")(app, sql_con);
require("./paths/recaptcha.js")(app, sql_con, crypto, mail_con);
require("./paths/forgottenpassword.js")(app, sql_con, crypto, mail_con);
require("./paths/checkNewPasswordKey.js")(app, sql_con);
require("./paths/changePassword.js")(app, isFieldEmpty, sql_con, bcrypt, jwt);
require("./paths/verifyToken.js")(app, jwt, sql_con);
require("./paths/createOrganization.js")(app, isFieldEmpty, sql_con, emailValidator, jwt);
require("./paths/getOrganizations.js")(app, sql_con, jwt);
require("./paths/getAllOrganizations.js")(app, sql_con, jwt);
require("./paths/isOrganizationAuthorized.js")(app, sql_con, jwt);
require("./paths/inviteWorker.js")(app, sql_con, jwt);
require("./paths/getBusinessInvites.js")(app, sql_con, jwt);
require("./paths/respondToInvite.js")(app, sql_con, jwt);
require("./paths/getWorkers.js")(app, sql_con, jwt);
require("./paths/removeWorker.js")(app, sql_con, jwt);
require("./paths/logout.js")(app, jwt);
require("./paths/getReservations.js")(app, sql_con, jwt);
require("./paths/getUserFromEmail.js")(app, sql_con, jwt);
require("./paths/addReservation.js")(app, sql_con, jwt, isFieldEmpty, moment);


app.listen(port, () => console.log(`[Backend]: A backend elérhető! [Port: ${port}]`));

