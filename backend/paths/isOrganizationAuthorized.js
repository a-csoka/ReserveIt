module.exports = (app, sql_con, jwt) => {
    app.post("/isOrganizationAuthorized", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.BusinessID){
                    const isAuthorized = await sql_con.promise().query("SELECT * FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=? LIMIT 1", [data.AccountID, req.body.BusinessID])
                    if(isAuthorized[0].length == 0){
                        res.send({authorized: false})
                        return false
                    }
                    res.send({authorized: true, isOwner: isAuthorized[0][0].isOwner})
                    return true
                }
            }
        }
    })
}