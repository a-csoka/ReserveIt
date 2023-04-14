module.exports = (app, sql_con, jwt) => {
    app.delete("/removeReservation", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.ReservationID){
                    const doesExist = await sql_con.promise().query("SELECT BusinessID FROM ReserveIt_Reservations WHERE ReservationID=? LIMIT 1", [req.body.ReservationID])
                    if(doesExist[0].length === 0){
                        res.status(400).send()
                        return
                    }
                    const isWorker = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=? LIMIT 1", [doesExist[0][0].BusinessID, data.AccountID])
                    if(isWorker[0].length === 0){
                        res.status(400).send()
                        return
                    }

                    const deleteReservation = await sql_con.promise().query("DELETE FROM ReserveIt_Reservations WHERE ReservationID=?", [req.body.ReservationID])
                    res.status(200).send({deleted: true})
                    return
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