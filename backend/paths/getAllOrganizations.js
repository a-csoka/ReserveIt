module.exports = (app, sql_con, jwt) => {
    app.get("/getAllOrganizations", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                const getOrgs = await await sql_con.promise().query("SELECT BusinessID, Name, Address, BusinessEmail, BusinessPhone, OwnerName FROM ReserveIt_Businesses")
                res.status(200).send({payload: getOrgs[0]})
                return
            }
            res.status(400).send()
            return
        }
        res.status(400).send()
        return
    })
}