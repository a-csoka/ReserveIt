module.exports = (app, isFieldEmpty, sql_con, bcrypt, emailValidator, crypto, mail_con) => {
    app.post("/registerUser", async (req, res) => {
        var tempErr = {
            "FirstName": "",
            "LastName": "",
            "Email": "",
            "Password": "",
            "RePassword": "",
        }
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

        const isEmailTaken = await sql_con.promise().query("SELECT email FROM ReserveIt_Accounts WHERE email=? LIMIT 1", [req.body.email])
        if(isEmailTaken[0].length > 0){
            tempErr["Email"] = "Ez az email cím már foglalt!"
            res.send(tempErr)
            return false
        }
        const pass = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
        const createAcc = await sql_con.promise().query("INSERT INTO ReserveIt_Accounts(Email, Password, FirstName, LastName) VALUES(?, ?, ?, ?)", [req.body.email, pass, req.body.firstName, req.body.lastName])
                  
        tempErr["Email"] = "Erősítsd meg az email címedet az arra küldött levélben!"
        res.send(tempErr)

        crypto.randomBytes(22, function(err, buffer) {
            var token = createAcc[0].insertId+buffer.toString('hex');
            mail_con.sendMail({
                from: "Team ReserveIt <helpdesk.reserveit@gmail.com>",
                to: req.body.email,
                subject: "ReserveIt - Megerősítés",
                html: `Tisztelt felhasználó!
                <br>
                Az email címével regisztráció történt az oldalunkon! Amennyiben ön volt kattintson a következő linkre: <b><a href='http://`+req.hostname+`:3000/verifyAccount/`+token+`'>Megerősítés</a></b>
                <br><br>
                Amennyiben nem ön volt, kérjük ne tegyen semmit.
                <br>
                <br>
                Tisztelettel,<br>
                Team ReserveIt
                `,
            }, async function(erR, info){
                if (err) throw err
                if(!err){
                    await sql_con.promise().query("INSERT INTO ReserveIt_VerificationData(AccountID,VerificationID) VALUES (?,?)", [createAcc[0].insertId, token])
                    console.log("[ReserveIt - Mail]: Megerősítő email elküldve! [Cím: "+req.body.email+"]")
                }
            })
        })
    
        return true
    
    })

}
