module.exports = (app, jwt, sql_con) => {
    app.get("/verifyToken", async (req,res) => {
        var decode = false
        if(req.cookies.userToken != null){
            try{
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                const sqlcucc = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_Accounts WHERE AccountID=? AND Email=?", [data.AccountID, data.Email])
                decode = true
            }catch{
                res.status(400).send()
                return
            }
        }
        res.status(200).json({tokenState: decode})
        return
    });
}