module.exports = (app, sql_con, jwt) => {
    app.get("/getAllOrganizations", async (req, res) => {
        var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
        if(data != null){
            const getOrgs = await await sql_con.promise().query("SELECT BusinessID, Name, Address, BusinessEmail, BusinessPhone, OwnerName FROM ReserveIt_Businesses")
            res.send({payload: getOrgs[0]})
        }
    })
}