module.exports = (app, sql_con, jwt, isFieldEmpty, moment) => {
    app.post("/editReservation", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.BusinessID !== null && req.body.Name !== null && req.body.WorkerID !== null && req.body.Date !== null && req.body.Start !== null && req.body.End !== null && req.body.Price !== null){
                    if(isFieldEmpty(req.body.Name)){
                        res.status(400).send()
                        return
                    }
                    if(isFieldEmpty(req.body.WorkerID)){
                        res.status(400).send()
                        return
                    }
                    if(isFieldEmpty(req.body.Start)){
                        res.status(400).send()
                        return
                    }
                    if(isFieldEmpty(req.body.End)){
                        res.status(400).send()
                        return
                    }
                    if(typeof(parseInt(req.body.Price)) !== "number"){
                        res.status(400).send()
                        return
                    }
                    if((new Date(req.body.Date+" "+req.body.Start)).getTime() >= (new Date(req.body.Date+" "+req.body.End)).getTime()){
                        res.status(400).send()
                        return
                    }
                    const isAuthorized = await sql_con.promise().query("SELECT ReservationID FROM ReserveIt_Reservations WHERE BusinessID=? AND ReservationID=?", [req.body.BusinessID, req.body.ReservationID])
                    if(isAuthorized[0].length === 0){
                        res.status(401).send()
                        return
                    }
                    const isWorker = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=?", [req.body.BusinessID, data.AccountID])
                    if(isWorker[0].length === 0){
                        res.status(401).send()
                        return
                    }
                    const doesWorkerExist = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=?", [req.body.BusinessID, req.body.WorkerID])
                    if(doesWorkerExist[0].length === 0){
                        res.status(400).send()
                        return
                    } 
                    const doesOverlap = await sql_con.promise().query("SELECT * FROM ReserveIt_Reservations WHERE ? < End AND ? > Start AND BusinessID=? AND WorkerID=? AND ReservationID != ? LIMIT 1", [req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, req.body.BusinessID,req.body.WorkerID, req.body.ReservationID])
                    if(doesOverlap[0].length > 0){
                        res.status(400).send({errorMsg: "Ebben az intervallumban már van egy időpont!"})
                        return
                    }
                    /*
                    const doesOverlap2 = await sql_con.promise().query("SELECT * FROM ReserveIt_Reservations WHERE ? < End AND ? > StartAND ReserverID=? LIMIT 1", [req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, doesExist[0][0].AccountID])
                    if(doesOverlap2[0].length > 0){
                        res.send({errorMsg: "Ebben az intervallumban már van egy időpontja az ügyfélnek!"})
                        return
                    }
                    */
                    await sql_con.promise().query("INSERT INTO ReserveIt_Notifications(AccountID, BusinessID, Text) VALUES((SELECT ReserverID FROM ReserveIt_Reservations WHERE ReservationID=?), ?, ?)", [req.body.ReservationID,req.body.BusinessID, "Egy időpontodat szerkesztették! ("+req.body.Name+")"])
                    const editReservation =  await sql_con.promise().query("UPDATE ReserveIt_Reservations SET Name=?, WorkerID=?, BusinessID=?, Start=?, End=?, Price=?, Phone=?, Status=? WHERE ReservationID=?", [req.body.Name, req.body.WorkerID, req.body.BusinessID, req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, req.body.Price, req.body.Phone, req.body.State, req.body.ReservationID])
                    res.status(200).send({errorMsg: "Foglalás szerkesztve!"})
                    return
                }
                res.status(400).send()
                return
            }
            res.status(401).send()
            return
        }
        res.status(401).send()
        return
    })
}