module.exports = (app, sql_con, jwt, isFieldEmpty, bcrypt) => {
    app.delete("/deleteOrganization", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.BusinessID !== null && req.body.Password !== null){
                    if(isFieldEmpty(req.body.Password)){
                        return false
                    }                    
                    const isAuthorized = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=? AND isOwner=1", [data.AccountID, req.body.BusinessID])
                    if(isAuthorized[0].length === 0){
                        return false
                    }
                    var tempErr = {
                        "OldPassword": "",
                        "OrgName": "",
                    }
                    const validPassword = await sql_con.promise().query("SELECT Password FROM ReserveIt_Accounts WHERE AccountID=?", [data.AccountID])
                    if(!await bcrypt.compare(req.body.Password, validPassword[0][0].Password)){
                        tempErr["OldPassword"] = "Hibás jelszó!"
                        res.send({Errors: tempErr})
                        return false
                    }
                    const changeName = await sql_con.promise().query("DELETE FROM ReserveIt_Businesses WHERE BusinessID=?", [req.body.BusinessID])
                    res.send({Redirect: true})
                }
            }
        }
    })
}