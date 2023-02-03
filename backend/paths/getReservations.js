module.exports = (app, sql_con, jwt) => {
    app.post("/getReservations", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(req.body.BusinessID && req.body.Time){
                if(data != null){
                    const reservations = await sql_con.promise().query("SELECT ReservationID, Name, WorkerID, FirstName, LastName, DATE_FORMAT(Start, '%H:%i') AS Start, DATE_FORMAT(End, '%H:%i') AS End, Price, Status, TIMESTAMPDIFF(MINUTE,ReserveIt_Reservations.Start, ReserveIt_Reservations.End) AS Length FROM `ReserveIt_Reservations` INNER JOIN ReserveIt_Accounts ON ReserveIt_Reservations.ReserverID = ReserveIt_Accounts.AccountID WHERE ReserveIt_Reservations.BusinessID=? AND DATE(Start) = ?", [req.body.BusinessID, req.body.Time])
                    const workers = await sql_con.promise().query("SELECT ReserveIt_BusinessEmployees.AccountID, FirstName, LastName FROM ReserveIt_BusinessEmployees INNER JOIN ReserveIt_Accounts ON ReserveIt_Accounts.AccountID=ReserveIt_BusinessEmployees.AccountID  WHERE BusinessID=? ", [req.body.BusinessID])
                    res.send({reservationData: reservations[0], workerData: workers[0]})
                }
            }
        }
    })
}