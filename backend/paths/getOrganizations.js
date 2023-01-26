module.exports = (app, sql_con, jwt) => {
    app.get("/getOrganizations", async (req, res) => {
        var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
        if(data != null){
            const getOrgs = await await sql_con.promise().query("SELECT ReserveIt_Businesses.BusinessID, Name, Address, BusinessEmail, BusinessPhone, OwnerName FROM ReserveIt_BusinessEmployees INNER JOIN ReserveIt_Businesses ON ReserveIt_BusinessEmployees.BusinessID = ReserveIt_Businesses.BusinessID WHERE AccountID=?", [data.AccountID])
            res.send({payload: getOrgs[0]})
        }
    })
}