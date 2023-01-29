module.exports = (app, sql_con, jwt) => {
    app.get("/getBusinessInvites", async (req, res) =>{
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                const invites = await sql_con.promise().query("SELECT ReserveIt_Accounts.FirstName, ReserveIt_Accounts.LastName, ReserveIt_Businesses.Name, ReserveIt_BusinessInvites.BusinessID FROM ReserveIt_BusinessInvites JOIN ReserveIt_Accounts ON ReserveIt_Accounts.AccountID=ReserveIt_BusinessInvites.InviterID JOIN ReserveIt_Businesses ON ReserveIt_Businesses.BusinessID=ReserveIt_BusinessInvites.BusinessID", [data.AccountID])
                res.send({payload: invites[0]})
            }
        }
    })
}