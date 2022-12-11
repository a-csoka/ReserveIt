module.exports = (app, sql_con) => {
    app.post("/verifyAccount", async (req, res) => {
        sql_con.query("SELECT * FROM ReserveIt_VerificationData WHERE VerificationID=? LIMIT 1", [req.body.EditKey], function (err, result){
            if(result.length == 0){
                res.send({State: "Ez a link nem megfelelő!"})
                return false
            }

            sql_con.query("DELETE FROM ReserveIt_VerificationData WHERE AccountID=?", [result[0].AccountID])
            
            var recordTime = JSON.parse(JSON.stringify(result[0].Time));
            var nowTime = Date.now();
            var recordTime = new Date(result[0].Time).getTime();
            if (recordTime+3600000 < nowTime) {
                sql_con.query("DELETE FROM ReserveIt_Accounts WHERE AccountID=?", [result[0].AccountID])
                res.send({State: "Ez a link már lejárt!"})
                return false
            }
            
            sql_con.query("UPDATE ReserveIt_Accounts SET isEmailValidated=1 WHERE AccountID=?", [result[0].AccountID])
            res.send({State: "Az email címed sikeresen megerősítésre került!"})
        })
    })
}