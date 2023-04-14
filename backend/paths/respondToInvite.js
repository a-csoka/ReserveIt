module.exports = (app, sql_con, jwt) => {
    app.post("/respondToInvite", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.Response && req.body.BusinessID){
                    const doesInviteExist = await sql_con.promise().query("SELECT InvitedID, BusinessID FROM ReserveIt_BusinessInvites WHERE InvitedID=? AND BusinessID=?", [data.AccountID, req.body.BusinessID])
                    if(doesInviteExist[0].length == 0){            
                        res.status(400).send()
                        return
                    }
                    
                    if(req.body.Response == "accept"){
                        const addToBusiness = await sql_con.promise().query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?,?,0)", [data.AccountID, req.body.BusinessID])
                    }
                    const removeInvite = await sql_con.promise().query("DELETE FROM ReserveIt_BusinessInvites WHERE InvitedID=? AND BusinessID=?", [data.AccountID, req.body.BusinessID])
                    res.status(200).send({redirect: req.body.Response})
                }            
                res.status(400).send()
                return
            }            
            res.status(400).send()
            return
        }            
        res.status(400).send()
        return
    })
}