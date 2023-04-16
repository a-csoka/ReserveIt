module.exports = (app, sql_con, jwt) => {
    app.post("/isOrganizationAuthorized", async (req, res) => {
        if(req.cookies.userToken != null){
            try{
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                if(req.body.BusinessID){
                    const isAuthorized = await sql_con.promise().query("SELECT * FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=? LIMIT 1", [data.AccountID, req.body.BusinessID])
                    if(isAuthorized[0].length == 0){
                        res.status(403).send({authorized: false})
                        return
                    }
                    res.status(200).send({authorized: true, isOwner: isAuthorized[0][0].isOwner})
                    return
                }
                res.status(400).send()
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