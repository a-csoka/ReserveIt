module.exports = (app, sql_con, jwt) => {
    app.post("/getUserReservations", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.Time){
                    const reservations = await sql_con.promise().query("SELECT ReservationID, Name, WorkerID, FirstName, LastName, DATE_FORMAT(Start, '%H:%i') AS Start, DATE_FORMAT(End, '%H:%i') AS End, Date_Format(Start, '%Y-%m-%d') AS Date,Price, Status, TIMESTAMPDIFF(MINUTE,ReserveIt_Reservations.Start, ReserveIt_Reservations.End) AS Length, Phone, Email FROM `ReserveIt_Reservations` INNER JOIN ReserveIt_Accounts ON ReserveIt_Reservations.ReserverID = ReserveIt_Accounts.AccountID WHERE ReserveIt_Accounts.AccountID=? AND DATE(Start) = ?", [data.AccountID, req.body.Time])
                    res.send({reservationData: reservations[0]})
                }
            }
        }
    })
}