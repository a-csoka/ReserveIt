module.exports = (app, isFieldEmpty, sql_con, bcrypt, jwt) => {
    app.post("/changePassword", async (req, res) => {
        if(req.body.OldPassword != null){
            if(req.cookies.userToken != null){
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                if(data != null){
                    var tempErr = {
                        "OldPassword": "",
                        "Password": "",
                        "RePassword": "",
                    }
                    if(isFieldEmpty(req.body.OldPassword)){
                        return false
                    }
                    if(isFieldEmpty(req.body.password)){
                        return false
                    }
                    if(isFieldEmpty(req.body.RePassword)){
                        return false
                    }
    
                    if(req.body.password != req.body.RePassword){
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

                    const currentPassword = await sql_con.promise().query("SELECT Password FROM ReserveIt_Accounts WHERE AccountID=?", [data.AccountID])

                    if(!await bcrypt.compare(req.body.OldPassword, currentPassword[0][0].Password)){
                        tempErr["OldPassword"] = "Hibás jelszó!"
                        res.send({Errors: tempErr, Code: ""})
                        return false
                    }

                    if(await bcrypt.compare(req.body.password, currentPassword[0][0].Password)){
                        tempErr["Password"] = "A jelszavad nem lehet ugyanaz mint a jelenlegi!"
                        tempErr["RePassword"] = "A jelszavad nem lehet ugyanaz mint a jelenlegi!"
                        res.send({Errors: tempErr, Code: ""})
                        return false
                    }

                    const pass = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
                    const changePw = await sql_con.promise().query("UPDATE ReserveIt_Accounts SET Password=?", [pass])
                    tempErr["OldPassword"] = "A jelszavad sikeresen megváltoztattuk!"
                    res.send({Errors: tempErr, Code: "REDIRECT-LOGIN"})
                }
            }
        }else{
            var tempErr = {
                "Password": "",
                "RePassword": "",
            }
            sql_con.query("SELECT ReserveIt_ForgottenPasswordData.AccountID, ReserveIt_Accounts.Password FROM ReserveIt_ForgottenPasswordData INNER JOIN ReserveIt_Accounts ON ReserveIt_Accounts.AccountID = ReserveIt_ForgottenPasswordData.AccountID WHERE VerificationID=? LIMIT 1", [req.body.EditKey], async function (err, result){
                if(result.length == 0){

                    res.send({Errors: tempErr, Code: "REDIRECT-LOGIN"})
                    return false
                }

                if(isFieldEmpty(req.body.password)){
                    return false
                }
                if(isFieldEmpty(req.body.RePassword)){
                    return false
                }

                if(req.body.password != req.body.RePassword){
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

                if(await bcrypt.compare(req.body.password, result[0].Password)){
                    tempErr["Password"] = "A jelszavad nem lehet ugyanaz mint a jelenlegi!"
                    tempErr["RePassword"] = "A jelszavad nem lehet ugyanaz mint a jelenlegi!"
                    res.send({Errors: tempErr, Code: ""})
                    return false
                }

                const pass = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
                const changePw = await sql_con.promise().query("UPDATE ReserveIt_Accounts SET Password=?", [pass])
                tempErr["Password"] = "A jelszavad sikeresen megváltoztattuk!"
                tempErr["RePassword"] = "A jelszavad sikeresen megváltoztattuk!"
                res.send({Errors: tempErr, Code: "REDIRECT-LOGIN"})
                sql_con.promise().query("DELETE FROM ReserveIt_ForgottenPasswordData WHERE AccountID=?", [result[0].AccountID])
            })
        }
    })
}