module.exports = (app, isFieldEmpty, sql_con, bcrypt, emailValidator) => {
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
}