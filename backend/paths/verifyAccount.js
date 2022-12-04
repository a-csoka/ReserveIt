module.exports = (app, sql_con) => {
    app.get("/verify/:id", async(req, res) => {
        await sql_con.query("SELECT * FROM ReserveIt_VerificationData WHERE VerificationID=? LIMIT 1", [req.params.id], function (err, result) {
            if (err) throw err;
            if(result.length > 0){
                res.send("Az email címed sikeresen megerősítésre került!")
                sql_con.query("DELETE FROM ReserveIt_VerificationData WHERE AccountID=?", [result[0].AccountID])
                sql_con.query("UPDATE ReserveIt_Accounts SET isEmailValidated=1 WHERE AccountID=?", [result[0].AccountID])
                return true
            }else{
                res.send("Nem felismerhető megerősítő link!")
                return false
            }
        })
    })
}