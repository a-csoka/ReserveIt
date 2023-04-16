module.exports = (app, sql_con, jwt) => {
    app.get("/getNotificationsCount", async (req, res) => {
        if(req.cookies.userToken != null){
            try{
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                const getNotifications = await sql_con.promise().query("SELECT count(ID) AS count FROM ReserveIt_Notifications WHERE isNew=1 AND AccountID=?", [data.AccountID])
                res.status(200).send({payload: getNotifications[0][0].count})
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