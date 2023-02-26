module.exports = (app, sql_con, jwt, isFieldEmpty, bcrypt) => {
    app.post("/updateOrganizationName", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.newName !== null && req.body.Password !== null && req.body.BusinessID !== null){
                    if(isFieldEmpty(req.body.Password)){
                        return false
                    }
                    if(isFieldEmpty(req.body.newName)){
                        return false
                    }
                    var tempErr = {
                        "OldPassword": "",
                        "OrgName": "",
                    }
                    const isAuthorized = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=? AND isOwner=1", [data.AccountID, req.body.BusinessID])
                    if(isAuthorized[0].length === 0){
                        return false
                    }
                    const validPassword = await sql_con.promise().query("SELECT Password FROM ReserveIt_Accounts WHERE AccountID=?", [data.AccountID])
                    if(!await bcrypt.compare(req.body.Password, validPassword[0][0].Password)){
                        tempErr["OldPassword"] = "Hibás jelszó!"
                        res.send({Errors: tempErr})
                        return false
                    }
                    const isNameTaken = await sql_con.promise().query("SELECT BusinessID FROM ReserveIt_Businesses WHERE Name=?", [req.body.newName])
                    if(isNameTaken[0].length > 0){
                        if(isNameTaken[0][0].BusinessID == req.body.BusinessID){
                            tempErr["OrgName"] = "Már ez a vállalkozásod neve!"
                        }else{
                            tempErr["OrgName"] = "Ez a vállalkozás név már foglalt!"
                        }
                        res.send({Errors: tempErr})
                        return false
                    }
                    const changeName = await sql_con.promise().query("UPDATE ReserveIt_Businesses SET Name=? WHERE BusinessID=?", [req.body.newName, req.body.BusinessID])
                    tempErr["OrgName"] = "A vállalkozásod nevét sikeresen megváltoztattuk!"
                    res.send({Errors: tempErr})
                }
            }
        }
    })
}