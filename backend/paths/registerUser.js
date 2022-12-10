module.exports = (app, isFieldEmpty, sql_con, bcrypt, emailValidator, crypto, mail_con) => {
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
    
                crypto.randomBytes(22, function(err, buffer) {
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

}
