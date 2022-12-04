module.exports = (app, sql_con, crypto, mail_con) => {
    app.post("/forgottenpassword", async (req, res) => {
        var tempErr = {
            "Email": "Amennyiben megfelelő a cím elküldtük a levelet!",
        }
        sql_con.query("SELECT AccountID,Email FROM ReserveIt_Accounts WHERE email=? LIMIT 1", [req.body.email], function (err, resultOrigin){
            if (err) throw err;
            if(resultOrigin.length === 0){
                res.send(tempErr)
                return false
            }
            sql_con.query("SELECT Time FROM ReserveIt_ForgottenPasswordData WHERE AccountID=? LIMIT 1", [resultOrigin[0].AccountID], function (err, result){
                if(result.length === 1){
                    var recordTime = JSON.parse(JSON.stringify(result[0].Time));
                    var nowTime = Date.now();
                    var recordTime = new Date(result[0].Time).getTime();
                    if (recordTime+600000 >= nowTime) {
                        tempErr["Email"] = `Csak 10 percenként küldhetsz elfelejtett jelszó kérelmet! Következő lehetőség ${Math.ceil((recordTime+600000-nowTime)/1000/60)} perc múlva!`
                        res.send(tempErr)
                        return false
                    }
                }
                sql_con.query("DELETE FROM ReserveIt_ForgottenPasswordData WHERE AccountID=?", [resultOrigin[0].AccountID])
    
                crypto.randomBytes(22, function(err, buffer) {
                    var token = resultOrigin[0].AccountID+buffer.toString('hex');
    
                    mail_con.sendMail({
                        from: "Team ReserveIt <helpdesk.reserveit@gmail.com>",
                        to: resultOrigin[0].Email,
                        subject: "ReserveIt - Elfelejtett jelszó",
                        html: `Tisztelt felhasználó!
                        <br>
                        Erre a címre elfelejtett jelszó kérelem érkezett! A jelszava megváltoztatásához kattintson ide: <b><a href='http://`+req.hostname+`:3000/newpassword/`+token+`'>Új jelszó</a></b>
                        <br><br>
                        Amennyiben nem ön volt, kérjük ne tegyen semmit.
                        <br>
                        <br>
                        Tisztelettel,<br>
                        Team ReserveIt
                        `,
                    }, function(erR, info){
                        if (err) throw err
                        if(!err){
                            sql_con.query("INSERT INTO ReserveIt_ForgottenPasswordData(AccountID, VerificationID) VALUES(?,?)", [resultOrigin[0].AccountID, token])
                            console.log("[Mail]: Elfelejtett jelszó kérelem! [Cím: "+resultOrigin[0].Email+"]")
                            res.send(tempErr)
                        }
                    });
                });
    
            })
        })
    })
}