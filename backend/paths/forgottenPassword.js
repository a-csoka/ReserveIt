module.exports = (app, sql_con, crypto, mail_con) => {
    app.post("/forgottenpassword", async (req, res) => {
        var tempErr = {
            "Email": "Amennyiben megfelelő a cím elküldtük a levelet!",
        }
        const data = await sql_con.promise().query("SELECT AccountID,Email FROM ReserveIt_Accounts WHERE email=? LIMIT 1", [req.body.email])
        if(data[0].length === 0){
            res.status(400).send(tempErr)
            return
        }
        const isFlood = await sql_con.promise().query("SELECT Time FROM ReserveIt_ForgottenPasswordData WHERE AccountID=? LIMIT 1", [data[0][0].AccountID])
        if(isFlood[0].length === 1){
            var recordTime = JSON.parse(JSON.stringify(isFlood[0][0].Time));
            var nowTime = Date.now();
            var recordTime = new Date(isFlood[0][0].Time).getTime();
            if (recordTime+600000 >= nowTime) {
                tempErr["Email"] = `Csak 10 percenként küldhetsz elfelejtett jelszó kérelmet! Következő lehetőség ${Math.ceil((recordTime+600000-nowTime)/1000/60)} perc múlva!`
                res.status(403).send(tempErr)
                return
            }
        }
        await sql_con.promise().query("DELETE FROM ReserveIt_ForgottenPasswordData WHERE AccountID=?", [data[0][0].AccountID])

        await crypto.randomBytes(22, function(err, buffer) {
            var token = data[0][0].AccountID+buffer.toString('hex');

            mail_con.sendMail({
                from: "Team ReserveIt <helpdesk.reserveit@gmail.com>",
                to: data[0][0].Email,
                subject: "ReserveIt - Elfelejtett jelszó",
                html: `Tisztelt felhasználó!
                <br>
                Erre a címre elfelejtett jelszó kérelem érkezett! A jelszava megváltoztatásához kattintson ide: <b><a href='http://`+req.hostname+`:3000/loginPage/newpassword/`+token+`'>Új jelszó</a></b>
                <br><br>
                Amennyiben nem ön volt, kérjük ne tegyen semmit.
                <br>
                <br>
                Tisztelettel,<br>
                Team ReserveIt
                `,
            }, async function(erR, info){
                await sql_con.promise().query("INSERT INTO ReserveIt_ForgottenPasswordData(AccountID, VerificationID) VALUES(?,?)", [data[0][0].AccountID, token])
                console.log("[Mail]: Elfelejtett jelszó kérelem! [Cím: "+data[0][0].Email+"]")
                res.status(200).send(tempErr)
                return
            });
        });
    })
}