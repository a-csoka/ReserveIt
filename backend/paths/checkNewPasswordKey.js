module.exports = (app, sql_con) => {
    app.post("/checkNewPasswordKey", async (req, res) => {
        sql_con.query("SELECT Time FROM ReserveIt_ForgottenPasswordData WHERE VerificationID=? LIMIT 1", [req.body.EditKey], function (err, result){
            if(result.length == 0){
                res.send({State: false})
                return false
            }
        })
    })
}