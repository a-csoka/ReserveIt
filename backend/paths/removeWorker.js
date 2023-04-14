module.exports = (app, sql_con, jwt) => {
    app.delete("/removeWorker", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.BusinessID){
                    const isOwner = await sql_con.promise().query("SELECT isOwner FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=? LIMIT 1", [data.AccountID, req.body.BusinessID])
                    if(isOwner[0][0].isOwner == 0){            
                        res.status(400).send()
                        return
                    }
                    const deleteQuery = await sql_con.promise().query("DELETE FROM ReserveIt_BusinessEmployees WHERE AccountID=? AND BusinessID=?", [req.body.KickID, req.body.BusinessID])
                    res.status(200).send()
                    return
                }            
                res.status(400).send()
                return
            }            
            res.status(400).send()
            return
        }            
        res.status(400).send()
        return
    })
}