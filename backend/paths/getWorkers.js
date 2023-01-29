module.exports = (app, sql_con, jwt) => {
    app.post("/getWorkers", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.BusinessID){
                    const workers = await sql_con.promise().query("SELECT ReserveIt_BusinessEmployees.AccountID, FirstName, LastName, isOwner FROM ReserveIt_BusinessEmployees INNER JOIN ReserveIt_Accounts ON ReserveIt_Accounts.AccountID=ReserveIt_BusinessEmployees.AccountID  WHERE BusinessID=? ", [req.body.BusinessID])
                    res.send({payload: workers[0]})
                }
            }
        }
    })
}