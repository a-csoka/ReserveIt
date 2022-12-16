module.exports = (app, sql_con) => {
    app.post("/checkNewPasswordKey", async (req, res) => {

        sql_con.query("SELECT * FROM ReserveIt_ForgottenPasswordData WHERE VerificationID=? LIMIT 1", [req.body.EditKey], function (err, result){
            if(result.length == 0){
                res.send({State: "Nem felismerhető link!"})
                return false
            }
            
            var recordTime = JSON.parse(JSON.stringify(result[0].Time));
            var nowTime = Date.now();
            var recordTime = new Date(result[0].Time).getTime();
            if (recordTime+600000 < nowTime) {
                res.send({State: "Ez a link már lejárt!"})
                return false
            }

            res.send({State: true})
        })
    })
}