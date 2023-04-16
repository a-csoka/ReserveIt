module.exports = (app, sql_con, jwt) => {
    app.post("/getWorkers", async (req, res) => {
        if(req.cookies.userToken != null){
            try {
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                if(req.body.BusinessID){
                    const workers = await sql_con.promise().query("SELECT ReserveIt_BusinessEmployees.AccountID, FirstName, LastName, isOwner FROM ReserveIt_BusinessEmployees INNER JOIN ReserveIt_Accounts ON ReserveIt_Accounts.AccountID=ReserveIt_BusinessEmployees.AccountID  WHERE BusinessID=? ", [req.body.BusinessID])
                    res.status(200).send({payload: workers[0]})
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