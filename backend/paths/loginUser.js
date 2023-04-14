module.exports = (app, isFieldEmpty, sql_con, bcrypt, emailValidator, jwt) => {
    app.post("/loginUser", async (req, res) => {
        var tempErr = {
            "Email": "",
            "Password": "",
        }
    
        if(isFieldEmpty(req.body.email)){
            res.status(400).send()
            return
        }
        if(isFieldEmpty(req.body.password)){
            res.status(400).send()
            return
        }
    
        if(!emailValidator.validate(req.body.email)){
            res.status(400).send()
            return
        }
        const accountData = await sql_con.promise().query("SELECT * FROM ReserveIt_Accounts WHERE email=? LIMIT 1", [req.body.email])
        if(accountData[0].length === 0){
            tempErr["Email"] = "Hibás email vagy jelszó!"
            tempErr["Password"] = "Hibás email vagy jelszó!"
            res.status(400).send(tempErr)
            return
        }

        if(!await bcrypt.compare(req.body.password, accountData[0][0].Password)){
            tempErr["Email"] = "Hibás email vagy jelszó!"
            tempErr["Password"] = "Hibás email vagy jelszó!"
            res.status(400).send(tempErr)
            return
        }

        if(accountData[0][0].isEmailValidated === 0){
            tempErr["Email"] = "Ez az email cím még nincs megerősítve!"
            res.status(400).send(tempErr)
            return
        }

        console.log("[ReserveIt - Login]: Sikeres bejelentkezés! [Email: "+accountData[0][0].Email+"] [IP: "+((req.headers['x-forwarded-for'] || '').split(',').pop().trim() || req.socket.remoteAddress)+"]")
        await sql_con.promise().query("UPDATE ReserveIt_Accounts SET LastLoginDate=DEFAULT WHERE AccountID=?", [accountData[0][0].AccountID])

        LoginToken = jwt.sign({AccountID: accountData[0][0].AccountID, Email: accountData[0][0].Email}, process.env.JWT_KEY);
        res.cookie('userToken', token, {httpOnly: false, maxAge: 31556952000})
        res.status(200).send(tempErr)
        return
    })
}