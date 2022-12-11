module.exports = (app, isFieldEmpty, sql_con, bcrypt, mail_con) => {
    app.post("/changePassword", async (req, res) => {
        var tempErr = {
            "Password": "",
            "RePassword": "",
        }
        sql_con.query("SELECT * FROM ReserveIt_ForgottenPasswordData WHERE VerificationID=? LIMIT 1", [req.body.EditKey], async function (err, result){
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

            const pass = await bcrypt.hash(req.body.password, await bcrypt.genSalt(10))
            sql_con.query("UPDATE ReserveIt_Accounts SET Password=?", [pass], function(err) {
                tempErr["Password"] = "A jelszavad sikeresen megváltoztattuk!"
            })
        })
    })
}