module.exports = (app, sql_con, jwt) => {
    app.get("/getAllOrganizations", async (req, res) => {
        if(req.cookies.userToken != null){
            try{
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                const getOrgs = await await sql_con.promise().query("SELECT BusinessID, Name, Address, BusinessEmail, BusinessPhone, OwnerName FROM ReserveIt_Businesses")
                res.status(200).send({payload: getOrgs[0]})
                return
            }catch{
                res.status(400).send()
                return
            }
        }
        res.status(400).send()
        return
    })
}