module.exports = (app, jwt) => {
    app.post("/logout", async (req, res) => {
        if(req.cookies.userToken != null){
            try {
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                res.clearCookie("userToken")
                res.status(200).end()
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