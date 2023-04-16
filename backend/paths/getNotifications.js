module.exports = (app, sql_con, jwt) => {
    app.get("/getNotifications", async (req, res) => {
        if(req.cookies.userToken != null){
            try{     
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                await sql_con.promise().query("UPDATE ReserveIt_Notifications SET isNew=0 WHERE AccountID=?", [data.AccountID])
                const getNotifications = await sql_con.promise().query("SELECT ReserveIt_Businesses.Name, ReserveIt_Notifications.Text FROM ReserveIt_Notifications INNER JOIN ReserveIt_Businesses ON ReserveIt_Businesses.BusinessID=ReserveIt_Notifications.BusinessID WHERE ReserveIt_Notifications.AccountID=? ORDER BY ID DESC;", [data.AccountID])
                res.status(200).send({payload: getNotifications[0]})
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