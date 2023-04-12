module.exports = (app, sql_con, jwt) => {
    app.get("/getNotificationsCount", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                const getNotifications = await sql_con.promise().query("SELECT count(ID) AS count FROM ReserveIt_Notifications WHERE isNew=1 AND AccountID=?", [data.AccountID])
                res.send({payload: getNotifications[0][0].count})
            }
        }
    })
}