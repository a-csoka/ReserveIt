module.exports = (app, sql_con, jwt) => {
    app.post("/inviteWorker", async (req, res) => {
        if(req.cookies.userToken != null){
            try{
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                if(req.body.BusinessID && req.body.Email){
                    const canInvite = await await sql_con.promise().query("SELECT isOwner FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=? LIMIT 1", [data.AccountID, req.body.BusinessID])
                    if(canInvite[0][0].isOwner == 0){
                        res.status(403).send({Err: "Ehhez nincs jogod!"})
                        return
                    }

                    const user = await await sql_con.promise().query("SELECT AccountID FROM ReserveIt_Accounts WHERE Email=? LIMIT 1", [req.body.Email])
                    if(user[0].length == 0){
                        res.status(400).send({Err: "Nem található a megadott email cím!"})
                        return
                    }
                    const isAlreadyMember = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=? LIMIT 1", [user[0][0].AccountID, req.body.BusinessID])
                    if(isAlreadyMember[0].length != 0){
                        res.status(400).send({Err: "Már hozzá van adva a vállalkozáshoz!"})
                        return
                    }
                    const isAlreadyInvited = await sql_con.promise().query("SELECT InviterID FROM ReserveIt_BusinessInvites WHERE InvitedID=? AND BusinessID=? LIMIT 1", [user[0][0].AccountID, req.body.BusinessID])
                    if(isAlreadyInvited[0].length != 0){
                        res.status(400).send({Err: "Már meg van hívva a vállalkozásba!"})
                        return
                    }

                    const invite = await sql_con.promise().query("INSERT INTO ReserveIt_BusinessInvites(InviterID, InvitedID, BusinessID) VALUES (?, ?, ?)", [data.AccountID, user[0][0].AccountID, req.body.BusinessID])
                    res.status(200).send({Err: "A meghívót elküldtük!"})
                }
            }catch{
                res.status(400).send()
                return
            }
        }
        res.status(400).send()
        return
    })
}