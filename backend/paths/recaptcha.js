module.exports = (app) => {
    app.post("/recaptcha", async (req,res) => {
        await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_KEY}&response=${req.body.token}`, {
            method: 'post'
        })
            .then(async response => await response.json())
            .then(async google_response => {
                if(google_response.success === true){
                    await res.send({response: true})
                }
            });
    });
}