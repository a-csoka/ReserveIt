module.exports = (app, sql_con) => {
    app.post("/checkNewPasswordKey", async (req, res) => {
        const pdata = await sql_con.promise().query("SELECT * FROM ReserveIt_ForgottenPasswordData WHERE VerificationID=? LIMIT 1", [req.body.EditKey])
        if(pdata[0].length == 0){
            res.status(400).send({State: "Nem felismerhető link!"})
            return
        }
        
        var recordTime = JSON.parse(JSON.stringify(pdata[0][0].Time));
        var nowTime = Date.now();
        var recordTime = new Date(pdata[0][0].Time).getTime();
        if (recordTime+600000 < nowTime) {
            res.status(401).send({State: "Ez a link már lejárt!"})
            return
        }

        res.status(200).send({State: true})
        return
    })
}