const { reject } = require('bcrypt/promises');
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const fetch = require('isomorphic-fetch');
var cors = require('cors')

require('dotenv').config();
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
});
mail_con.verify().then(console.log("[Mail]: A kapcsolat sikeresen létrejött!")).catch(console.error);

function isFieldEmpty(text){
    if(typeof(text) !== "undefined"){
        if(text.replace(" ", "") !== ""){
            return false
        }
    }
    return true
}

app.get("/verify/:id", async(req, res) => {
    await sql_con.query("SELECT * FROM ReserveIt_VerificationData WHERE VerificationID=? LIMIT 1", [req.params.id], function (err, result) {
        if (err) throw err;
        if(result.length > 0){
            res.send("Az email címed sikeresen megerősítésre került!")
            sql_con.query("DELETE FROM ReserveIt_VerificationData WHERE AccountID=?", [result[0].AccountID])
            sql_con.query("UPDATE ReserveIt_Accounts SET isEmailValidated=1 WHERE AccountID=?", [result[0].AccountID])
            return true
        }else{
            res.send("Nem felismerhető megerősítő link!")
            return false
        }
    })
})

app.post("/registerUser", async (req, res) => {
    var tempErr = {
        "FirstName": "",
        "LastName": "",
        "Email": "",
        "Password": "",
        "RePassword": "",
    }
    async function serverSideFieldEmptyCheck(){
        if(isFieldEmpty(req.body.firstName)){
            return false
        }
        if(isFieldEmpty(req.body.lastName)){
            return false
        }
        if(isFieldEmpty(req.body.email)){
            return false
        }
        if(isFieldEmpty(req.body.password)){
            return false
        }
        if(isFieldEmpty(req.body.rePassword)){
            return false
        }

        if(req.body.password !== req.body.rePassword){
            return false
        }

        if(!new RegExp(".{8}").test(req.body.password)){
            return false
        }
        if(!new RegExp("(?=.*[A-Z])").test(req.body.password)){
            return false
        }
        if(!new RegExp("(?=.*[0-9])").test(req.body.password)){
            return false
        }

        if(!emailValidator.validate(req.body.email)){
            return false
        }
        await isEmailAlreadyExist()
    }
    await serverSideFieldEmptyCheck()

    async function isEmailAlreadyExist(){
        await sql_con.query("SELECT email FROM ReserveIt_Accounts WHERE email=? LIMIT 1", [req.body.email], function (err, result) {
            if (err) throw err;
            if(result.length > 0){
                tempErr["Email"] = "Ez az email cím már foglalt!"
                res.send(tempErr)
                return false
            }
            createUser()
        })
    }


    async function createUser(){
        const pass = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
        await sql_con.query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName) VALUES(?, ?, ?, ?)", [req.body.email, pass, req.body.firstName, req.body.lastName], function(err) {
            sendVerificationEmail()
        })
    }

    async function sendVerificationEmail(){
        
        await sql_con.query("SELECT AccountID from ReserveIt_Accounts WHERE Email=? LIMIT 1", [req.body.email], function(err,result) {
            if (err) throw err;
            tempErr["Email"] = "Erősítsd meg az email címedet az arra küldött levélben!"
            res.send(tempErr)

            require('crypto').randomBytes(22, function(err, buffer) {
                var token = result[0].AccountID+buffer.toString('hex');
                mail_con.sendMail({
                    from: "Team ReserveIt <helpdesk.reserveit@gmail.com>",
                    to: req.body.email,
                    subject: "ReserveIt - Megerősítés",
                    html: `Tisztelt felhasználó!
                    <br>
                    Az email címével regisztráció történt az oldalunkon! Amennyiben ön volt kattintson a következő linkre: <b><a href='http://`+req.get("host")+`/verify/`+token+`'>Megerősítés</a></b>
                    <br><br>
                    Amennyiben nem ön volt, kérjük ne tegyen semmit.
                    <br>
                    <br>
                    Tisztelettel,<br>
                    Team ReserveIt
                    `,
                }, function(erR, info){
                    if (err) throw err
                    if(!err){
                        sql_con.query("INSERT INTO ReserveIt_VerificationData(AccountID,VerificationID) VALUES (?,?)", [result[0].AccountID, token])
                        console.log("[ReserveIt - Mail]: Megerősítő email elküldve! [Cím: "+req.body.email+"]")
                    }
                });
            });
        })

        return true
    }

})

app.post("/loginUser", async (req, res) => {
    var tempErr = {
        "Email": "",
        "Password": "",
    }

    if(isFieldEmpty(req.body.email)){
        return false
    }
    if(isFieldEmpty(req.body.password)){
        return false
    }

    if(!emailValidator.validate(req.body.email)){
        return false
    }

    async function doesUserExist(){
        sql_con.query("SELECT * FROM ReserveIt_Accounts WHERE email=? LIMIT 1", [req.body.email], async function (err, result) {
            if (err) throw err;
            if(result.length === 0){
                tempErr["Email"] = "Hibás email vagy jelszó!"
                tempErr["Password"] = "Hibás email vagy jelszó!"
                res.send(tempErr)
                return false
            }

            if(!await bcrypt.compare(req.body.password, result[0].Password)){
                tempErr["Email"] = "Hibás email vagy jelszó!"
                tempErr["Password"] = "Hibás email vagy jelszó!"
                res.send(tempErr)
                return false
            }

            if(result[0].isEmailValidated === 0){
                tempErr["Email"] = "Ez az email cím még nincs megerősítve!"
                res.send(tempErr)
                return false
            }

            console.log("[ReserveIt - Login]: Sikeres bejelentkezés! [Email: "+result[0].Email+"] [IP: "+((req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress)+"]")
            sql_con.query("UPDATE ReserveIt_Accounts SET LastLoginDate=DEFAULT WHERE AccountID=?", [result[0].AccountID])

            return true

        })
    }
    await doesUserExist()
})

app.post("/recaptcha", async (req,res) => {
    await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_KEY}&response=${req.body.token}`, {
        method: 'post'
    })
        .then(async response => await response.json())
        .then(async google_response => {
            if(google_response.success === true){
                await res.send({response: true})
            }
        });
});

app.post("/forgottenpassword", async (req, res) => {
    var tempErr = {
        "Email": "Amennyiben megfelelő a cím elküldtük a levelet!",
    }
    sql_con.query("SELECT AccountID,Email FROM ReserveIt_Accounts WHERE email=? LIMIT 1", [req.body.email], function (err, resultOrigin){
        if (err) throw err;
        if(resultOrigin.length === 0){
            res.send(tempErr)
            return false
        }
        sql_con.query("SELECT Time FROM ReserveIt_ForgottenPasswordData WHERE AccountID=? LIMIT 1", [resultOrigin[0].AccountID], function (err, result){
            if(result.length === 1){
                var recordTime = JSON.parse(JSON.stringify(result[0].Time));
                var nowTime = Date.now();
                var recordTime = new Date(result[0].Time).getTime();
                if (recordTime+600000 >= nowTime) {
                    tempErr["Email"] = `Csak 10 percenként küldhetsz elfelejtett jelszó kérelmet! Következő lehetőség ${Math.ceil((recordTime+600000-nowTime)/1000/60)} perc múlva!`
                    res.send(tempErr)
                    return false
                }
            }
            sql_con.query("DELETE FROM ReserveIt_ForgottenPasswordData WHERE AccountID=?", [resultOrigin[0].AccountID])

            require('crypto').randomBytes(22, function(err, buffer) {
                var token = resultOrigin[0].AccountID+buffer.toString('hex');

                mail_con.sendMail({
                    from: "Team ReserveIt <helpdesk.reserveit@gmail.com>",
                    to: resultOrigin[0].Email,
                    subject: "ReserveIt - Elfelejtett jelszó",
                    html: `Tisztelt felhasználó!
                    <br>
                    Erre a címre elfelejtett jelszó kérelem érkezett! A jelszava megváltoztatásához kattintson ide: <b><a href='http://`+req.hostname+`:3000/newpassword/`+token+`'>Új jelszó</a></b>
                    <br><br>
                    Amennyiben nem ön volt, kérjük ne tegyen semmit.
                    <br>
                    <br>
                    Tisztelettel,<br>
                    Team ReserveIt
                    `,
                }, function(erR, info){
                    if (err) throw err
                    if(!err){
                        sql_con.query("INSERT INTO ReserveIt_ForgottenPasswordData(AccountID, VerificationID) VALUES(?,?)", [resultOrigin[0].AccountID, token])
                        console.log("[ReserveIt - Mail]: Elfelejtett jelszó kérelem! [Cím: "+resultOrigin[0].Email+"]")
                        res.send(tempErr)
                    }
                });
            });

        })
    })
})

app.post("/checkNewPasswordKey", async (req, res) => {
    sql_con.query("SELECT Time FROM ReserveIt_ForgottenPasswordData WHERE VerificationID=? LIMIT 1", [req.body.EditKey], function (err, result){
        if(result.length == 0){
            res.send({State: false})
            return false
        }
    })
})

app.listen(port, () => console.log(`Listening on port ${port}`));

