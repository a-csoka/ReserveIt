module.exports = (app, sql_con, jwt, isFieldEmpty, moment) => {
    app.post("/editReservation", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.BusinessID !== null && req.body.Name !== null && req.body.WorkerID !== null && req.body.Date !== null && req.body.Start !== null && req.body.End !== null && req.body.Price !== null){
                    if(isFieldEmpty(req.body.Name)){
                        return false
                    }
                    if(isFieldEmpty(req.body.WorkerID)){
                        return false
                    }
                    if(isFieldEmpty(req.body.Start)){
                        return false
                    }
                    if(isFieldEmpty(req.body.End)){
                        return false
                    }
                    if(typeof(parseInt(req.body.Price)) !== "number"){
                        return false
                    }
                    if((new Date(req.body.Date+" "+req.body.Start)).getTime() >= (new Date(req.body.Date+" "+req.body.End)).getTime()){
                        return false
                    }
                    const isAuthorized = await sql_con.promise().query("SELECT ReservationID FROM ReserveIt_Reservations WHERE BusinessID=? AND ReservationID=?", [req.body.BusinessID, req.body.ReservationID])
                    if(isAuthorized[0].length === 0){
                        return false
                    }
                    const isWorker = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=?", [req.body.BusinessID, data.AccountID])
                    if(isWorker[0].length === 0){
                        return false
                    }
                    const doesWorkerExist = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=?", [req.body.BusinessID, req.body.WorkerID])
                    if(doesWorkerExist[0].length === 0){
                        return false
                    } 
                    const doesOverlap = await sql_con.promise().query("SELECT * FROM ReserveIt_Reservations WHERE ? < End AND ? > Start AND BusinessID=? AND WorkerID=? AND ReservationID != ? LIMIT 1", [req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, req.body.BusinessID,req.body.WorkerID, req.body.ReservationID])
                    if(doesOverlap[0].length > 0){
                        res.send({errorMsg: "Ebben az intervallumban már van egy időpont!"})
                        return false
                    }
                    const editReservation =  await sql_con.promise().query("UPDATE ReserveIt_Reservations SET Name=?, WorkerID=?, BusinessID=?, Start=?, End=?, Price=?, Phone=?, Status=? WHERE ReservationID=?", [req.body.Name, req.body.WorkerID, req.body.BusinessID, req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, req.body.Price, req.body.Phone, req.body.State, req.body.ReservationID])
                    res.send({errorMsg: "Foglalás szerkesztve!"})
                }
            }
        }
    })
}