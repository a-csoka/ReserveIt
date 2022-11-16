const { reject } = require('bcrypt/promises');
const express = require('express');
const mysql = require('mysql');
const app = express();
const port = process.env.PORT || 5000;
const emailValidator = require("email-validator");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');

require('dotenv').config();
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
                        console.log(token)
                        sql_con.query("INSERT INTO ReserveIt_VerificationData(AccountID,VerificationID) VALUES (?,?)", [result[0].AccountID, token])
                        console.log("[ReserveIt - Mail]: Megerősítő email elküldve! [Cím: "+req.body.email+"]")
                    }
                });
            });
        })

        return true
    }

})

app.listen(port, () => console.log(`Listening on port ${port}`));

