module.exports = (app, sql_con, jwt, isFieldEmpty, moment) => {
    app.post("/addReservation", async (req, res) => {
        if(req.cookies.userToken != null){
            var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
            if(data != null){
                if(req.body.BusinessID !== null && req.body.Name !== null && req.body.WorkerID !== null && req.body.Date !== null && req.body.Start !== null && req.body.End !== null && req.body.Price !== null && req.body.Email !== null){
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
                    if(isFieldEmpty(req.body.Email)){
                        return false
                    }
                    if((new Date(req.body.Date+" "+req.body.Start)).getTime() >= (new Date(req.body.Date+" "+req.body.End)).getTime()){
                        return false
                    }
                    if(moment(req.body.Date+" "+req.body.Start).isSameOrBefore(new Date())){
                        return false
                    }
                    const isWorker = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=?", [req.body.BusinessID, data.AccountID])
                    if(isWorker[0].length === 0){
                        return false
                    }
                    const doesExist = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_Accounts WHERE Email=?", [req.body.Email])
                    if(doesExist[0].length === 0){
                        return false
                    }
                    const doesWorkerExist = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=?", [req.body.BusinessID, req.body.WorkerID])
                    if(doesWorkerExist[0].length === 0){
                        return false
                    } 
                    const doesOverlap = await sql_con.promise().query("SELECT * FROM ReserveIt_Reservations WHERE ? < End AND ? > Start AND BusinessID=? AND WorkerID=? LIMIT 1", [req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, req.body.BusinessID,req.body.WorkerID])
                    if(doesOverlap[0].length > 0){
                        res.send({errorMsg: "Ebben az intervallumban már van egy időpontja a dolgozónak!"})
                        return false
                    }
                    /*
                    const doesOverlap2 = await sql_con.promise().query("SELECT * FROM ReserveIt_Reservations WHERE ? < End AND ? > Start AND ReserverID=? LIMIT 1", [req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, doesExist[0][0].AccountID])
                    if(doesOverlap2[0].length > 0){
                        res.send({errorMsg: "Ebben az intervallumban már van egy időpontja az ügyfélnek!"})
                        return false
                    }
                    */
                    await sql_con.promise().query("INSERT INTO ReserveIt_Notifications(AccountID, BusinessID, Text) VALUES(?, ?, ?)", [doesExist[0][0].AccountID, req.body.BusinessID, "Hozzá lett adva egy időpont a naptáradhoz! ("+(req.body.Date).replaceAll("-", ". ")+". "+req.body.Start+"-"+req.body.End+")"])
                    const createReservation =  await sql_con.promise().query("INSERT INTO ReserveIt_Reservations(Name, ReserverID, WorkerID, BusinessID, Start, End, Price, Phone, Status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, 'Pending')", [req.body.Name, doesExist[0][0].AccountID, req.body.WorkerID, req.body.BusinessID, req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, req.body.Price, req.body.Phone])
                    res.send({errorMsg: "Foglalás létrehozva!"})
                }
            }
        }
    })
}