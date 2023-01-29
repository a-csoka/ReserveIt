module.exports = (app, jwt) => {
    app.post("/logout", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                res.clearCookie("userToken")
                res.end()
            }
        }
    })
}