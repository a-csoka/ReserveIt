module.exports = (app, sql_con) => {
    app.post("/verifyAccount", async (req, res) => {
        const accountData = await sql_con.promise().query("SELECT * FROM ReserveIt_VerificationData WHERE VerificationID=? LIMIT 1", [req.body.EditKey])
            if(accountData[0].length == 0){
                res.status(401).send({State: "Ez a link nem megfelelő!"})
                return
            }

            sql_con.query("DELETE FROM ReserveIt_VerificationData WHERE AccountID=?", [accountData[0][0].AccountID])
            
            var recordTime = JSON.parse(JSON.stringify(accountData[0][0].Time));
            var nowTime = Date.now();
            var recordTime = new Date(accountData[0][0].Time).getTime();
            if (recordTime+3600000 < nowTime) {
                sql_con.query("DELETE FROM ReserveIt_Accounts WHERE AccountID=?", [accountData[0][0].AccountID])
                res.status(402).send({State: "Ez a link már lejárt!"})
                return
            }
            
            sql_con.query("UPDATE ReserveIt_Accounts SET isEmailValidated=1 WHERE AccountID=?", [accountData[0][0].AccountID])
            res.status(200).send({State: "Az email címed sikeresen megerősítésre került!"})
    })
}