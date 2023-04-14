module.exports = (app, sql_con, jwt) => {
    app.post("/getUserFromEmail", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.Email){
                    const user = await sql_con.promise().query("SELECT AccountID, FirstName, LastName FROM ReserveIt_Accounts WHERE Email=? LIMIT 1", [req.body.Email])
                    if(user[0].length === 1){
                        res.status(200).send({FirstName: user[0][0].FirstName, LastName: user[0][0].LastName, AccountID: user[0][0].AccountID})
                        return
                    }else{
                        res.status(200).send({FirstName: "", LastName: "", AccountID: ""})
                        return
                    }
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