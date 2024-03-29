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

        if(isFieldEmpty(req.body.OrgName) || isFieldEmpty(req.body.OrgLocation) || isFieldEmpty(req.body.OrgEmail) || isFieldEmpty(req.body.OwnerName) || isFieldEmpty(req.body.OwnerMail) || isFieldEmpty(req.body.OwnerPhone)){
            res.status(400).send()
            return
        }

        if(!emailValidator.validate(req.body.OrgEmail) || !emailValidator.validate(req.body.OwnerMail)){
            res.status(400).send()
            return
        }

        if(req.cookies.userToken == null){
            res.status(401).send()
            return
        }
        try{
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)

            const takenNameCheck = await sql_con.promise().query("SELECT Name FROM ReserveIt_Businesses WHERE Name=? LIMIT 1", [req.body.OrgName])
            if(takenNameCheck[0].length > 0){
                tempErr.OrgName = "Ez a név már foglalt!"
                res.status(400).send({errors: tempErr})
                return
            }
            const createOrg = await sql_con.promise().query("INSERT INTO ReserveIt_Businesses(Name, Address, BusinessEmail, BusinessPhone, OwnerName, OwnerEmail, OwnerPhone) VALUES(?, ?, ?, ?, ?, ?, ?)", [req.body.OrgName, req.body.OrgLocation, req.body.OrgEmail, req.body.OrgPhone, req.body.OwnerName, req.body.OwnerMail, req.body.OwnerPhone])
            const addOwner = await sql_con.promise().query("INSERT INTO ReserveIt_BusinessEmployees(AccountID, BusinessID, isOwner) VALUES(?, ?, 1)", [data.AccountID, createOrg[0].insertId])
            res.status(200).send({redirect: true})
            return
        }catch{
            res.status(401).send()
            return
        }
    })
}