module.exports = (app, sql_con, jwt) => {
    app.post("/getUserReservations", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.Time){
                    const reservations = await sql_con.promise().query("SELECT ReservationID, Name, CONCAT(Worker.FirstName, ' ', Worker.LastName) AS WorkerName, Customer.FirstName, Customer.LastName, DATE_FORMAT(Start, '%H:%i') AS Start, DATE_FORMAT(End, '%H:%i') AS End, Date_Format(Start, '%Y-%m-%d') AS Date, Price, Status, TIMESTAMPDIFF(MINUTE, Reservation.Start, Reservation.End) AS Length, Phone, Customer.Email FROM ReserveIt_Reservations AS Reservation INNER JOIN ReserveIt_Accounts AS Customer ON Customer.AccountID=Reservation.ReserverID INNER JOIN ReserveIt_Accounts AS Worker ON Worker.AccountID=WorkerID WHERE Customer.AccountID=? AND DATE(Start) = ?", [data.AccountID, req.body.Time])
                    res.send({reservationData: reservations[0]})
                }
            }
        }
    })
}