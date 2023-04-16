module.exports = (app, isFieldEmpty, sql_con, bcrypt, jwt) => {
    app.post("/changePassword", async (req, res) => {
        if(req.body.OldPassword != null){
            if(req.cookies.userToken != null){
                try{
                    var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                    var tempErr = {
                        "OldPassword": "",
                        "Password": "",
                        "RePassword": "",
                    }
                    if(isFieldEmpty(req.body.OldPassword) || isFieldEmpty(req.body.password) || isFieldEmpty(req.body.RePassword)){
                        res.status(400).send()
                        return
                    }
    
                    if(req.body.password != req.body.RePassword){
                        res.status(400).send()
                        return
                    }
    
                    if(!new RegExp(".{8}").test(req.body.password) || !new RegExp("(?=.*[A-Z])").test(req.body.password) || !new RegExp("(?=.*[0-9])").test(req.body.password)){
                        res.status(400).send()
                        return
                    }

                    const currentPassword = await sql_con.promise().query("SELECT Password FROM ReserveIt_Accounts WHERE AccountID=?", [data.AccountID])

                    if(!await bcrypt.compare(req.body.OldPassword, currentPassword[0][0].Password)){
                        tempErr["OldPassword"] = "Hibás jelszó!"
                        res.status(400).send({Errors: tempErr, Code: ""})
                        return
                    }

                    if(await bcrypt.compare(req.body.password, currentPassword[0][0].Password)){
                        tempErr["Password"] = "A jelszavad nem lehet ugyanaz mint a jelenlegi!"
                        tempErr["RePassword"] = "A jelszavad nem lehet ugyanaz mint a jelenlegi!"
                        res.status(400).send({Errors: tempErr, Code: ""})
                        return
                    }

                    const pass = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
                    const changePw = await sql_con.promise().query("UPDATE ReserveIt_Accounts SET Password=?", [pass])
                    tempErr["OldPassword"] = "A jelszavad sikeresen megváltoztattuk!"
                    res.status(200).send({Errors: tempErr, Code: "REDIRECT-LOGIN"})
                    return true
                }catch{
                    res.status(403).send()
                    return
                }
            }
            res.status(403).send()
            return
        }else{
            var tempErr = {
                "Password": "",
                "RePassword": "",
            }
            const result = await sql_con.promise().query("SELECT ReserveIt_ForgottenPasswordData.AccountID, ReserveIt_Accounts.Password FROM ReserveIt_ForgottenPasswordData INNER JOIN ReserveIt_Accounts ON ReserveIt_Accounts.AccountID = ReserveIt_ForgottenPasswordData.AccountID WHERE VerificationID=? LIMIT 1", [req.body.EditKey])
            if(result[0].length == 0){
                res.status(401).send({Errors: tempErr, Code: "REDIRECT-LOGIN"})
                return
            }

            if(isFieldEmpty(req.body.password) || isFieldEmpty(req.body.RePassword)){
                res.status(400).send()
                return
            }

            if(req.body.password != req.body.RePassword){
                res.status(400).send()
                return
            }

            if(!new RegExp(".{8}").test(req.body.password) || !new RegExp("(?=.*[A-Z])").test(req.body.password) || !new RegExp("(?=.*[0-9])").test(req.body.password)){
                res.status(400).send()
                return
            }

            if(await bcrypt.compare(req.body.password, result[0][0].Password)){
                tempErr["Password"] = "A jelszavad nem lehet ugyanaz mint a jelenlegi!"
                tempErr["RePassword"] = "A jelszavad nem lehet ugyanaz mint a jelenlegi!"
                res.status(400).send({Errors: tempErr, Code: ""})
                return
            }

            const pass = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
            const changePw = await sql_con.promise().query("UPDATE ReserveIt_Accounts SET Password=?", [pass])
            tempErr["Password"] = "A jelszavad sikeresen megváltoztattuk!"
            tempErr["RePassword"] = "A jelszavad sikeresen megváltoztattuk!"
            res.status(200).send({Errors: tempErr, Code: "REDIRECT-LOGIN"})
            sql_con.promise().query("DELETE FROM ReserveIt_ForgottenPasswordData WHERE AccountID=?", [result[0][0].AccountID])
            return
        }
    })
}