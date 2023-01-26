module.exports = (app, isFieldEmpty, sql_con, emailValidator, jwt) => {
    app.post("/createOrganization", async (req, res) => {
        var tempErr = {
            OrgName: "",
            OrgLocation: "",
            OrgMail: "",
            OrgPhone: "",
    
            OwnerName: "",
            OwnerMail: "",
            OwnerPhone: "",
        }

        if(isFieldEmpty(req.body.OrgName)){
            return false
        }
        if(isFieldEmpty(req.body.OrgLocation)){
            return false
        }
        if(isFieldEmpty(req.body.OrgEmail)){
            return false
        }
        if(isFieldEmpty(req.body.OwnerName)){
            return false
        }
        if(isFieldEmpty(req.body.OwnerMail)){
            return false
        }
        if(isFieldEmpty(req.body.OwnerPhone)){
            return false
        }

        if(!emailValidator.validate(req.body.OrgEmail)){
            return false
        }
        if(!emailValidator.validate(req.body.OwnerMail)){
            return false
        }

        if(req.cookies.userToken == null){
            return false
        }
        var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)

        if(data != null){
            const takenNameCheck = await sql_con.promise().query("SELECT Name FROM ReserveIt_Businesses WHERE Name=? LIMIT 1", [req.body.OrgName])
            if(takenNameCheck[0].length > 0){
                tempErr.OrgName = "Ez a név már foglalt!"
                res.send({errors: tempErr})
                return false
            }
            const createOrg = await sql_con.promise().query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES(?, ?, ?, ?, ?, ?, ?)", [req.body.OrgName, req.body.OrgLocation, req.body.OrgEmail, req.body.OrgPhone, req.body.OwnerName, req.body.OwnerMail, req.body.OwnerPhone])
            const addOwner = await sql_con.promise().query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [data.AccountID, createOrg[0].insertId])
            res.send({redirect: true})
        }
    })
}