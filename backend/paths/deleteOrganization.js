module.exports = (app, sql_con, jwt, isFieldEmpty, bcrypt) => {
    app.delete("/deleteOrganization", async (req, res) => {
        if(req.cookies.userToken != null){
            try{
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                if(isFieldEmpty(req.body.Password)){
                    res.status(400).send()
                    return
                }                    
                const isAuthorized = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=? AND isOwner=1", [data.AccountID, req.body.BusinessID])
                if(isAuthorized[0].length === 0){
                    res.status(403).send()
                    return
                }
                var tempErr = {
                    "OldPassword": "",
                    "OrgName": "",
                }
                const validPassword = await sql_con.promise().query("SELECT Password FROM ReserveIt_Accounts WHERE AccountID=?", [data.AccountID])
                if(!await bcrypt.compare(req.body.Password, validPassword[0][0].Password)){
                    tempErr["OldPassword"] = "Hibás jelszó!"
                    res.status(400).send({Errors: tempErr})
                    return
                }
                await sql_con.promise().query("DELETE FROM ReserveIt_Businesses WHERE BusinessID=?", [req.body.BusinessID])
                await sql_con.promise().query("DELETE FROM ReserveIt_BusinessInvites WHERE BusinessID=?", [req.body.BusinessID])
                res.status(200).send({Redirect: true})
                return
            }catch{
                res.status(401).send()
                return
            }
        }
        res.status(401).send()
        return
    })
}