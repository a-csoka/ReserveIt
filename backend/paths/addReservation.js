module.exports = (app, sql_con, jwt, isFieldEmpty, moment) => {
    app.post("/addReservation", async (req, res) => {
        if(req.cookies.userToken != null){
            try{
                var data = jwt.verify(req.cookies.userToken, process.env.JWT_KEY)
                if(isFieldEmpty(req.body.Name) || isFieldEmpty(req.body.WorkerID) || isFieldEmpty(req.body.Start) || isFieldEmpty(req.body.End) || isFieldEmpty(req.body.Email)){
                    res.status(400).send()
                    return
                }
                if(isNaN(parseInt(req.body.Price))){
                    res.status(400).send()
                    return
                }
                if((new Date(req.body.Date+" "+req.body.Start)).getTime() >= (new Date(req.body.Date+" "+req.body.End)).getTime()){
                    res.status(400).send()
                    return
                }
                if(moment(req.body.Date+" "+req.body.Start).isSameOrBefore(new Date())){
                    res.status(400).send()
                    return
                }
                const isWorker = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=?", [req.body.BusinessID, data.AccountID])
                if(isWorker[0].length === 0){
                    res.status(401).send()
                    return
                }
                const doesExist = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_Accounts WHERE Email=?", [req.body.Email])
                if(doesExist[0].length === 0){
                    res.status(400).send()
                    return
                }
                const doesWorkerExist = await sql_con.promise().query("SELECT AccountID FROM ReserveIt_BusinessEmployees WHERE BusinessID=? AND AccountID=?", [req.body.BusinessID, req.body.WorkerID])
                if(doesWorkerExist[0].length === 0){
                    res.status(400).send()
                    return
                } 
                const doesOverlap = await sql_con.promise().query("SELECT * FROM ReserveIt_Reservations WHERE ? < End AND ? > Start AND BusinessID=? AND WorkerID=? LIMIT 1", [req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, req.body.BusinessID,req.body.WorkerID])
                if(doesOverlap[0].length > 0){
                    res.status(400).send({errorMsg: "Ebben az intervallumban már van egy időpontja a dolgozónak!"})
                    return
                }
                /*
                const doesOverlap2 = await sql_con.promise().query("SELECT * FROM ReserveIt_Reservations WHERE ? < End AND ? > Start AND ReserverID=? LIMIT 1", [req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, doesExist[0][0].AccountID])
                if(doesOverlap2[0].length > 0){
                    res.send({errorMsg: "Ebben az intervallumban már van egy időpontja az ügyfélnek!"})
                    return
                }
                */
                await sql_con.promise().query("INSERT INTO ReserveIt_Notifications(AccountID, BusinessID, Text) VALUES(?, ?, ?)", [doesExist[0][0].AccountID, req.body.BusinessID, "Hozzá lett adva egy időpont a naptáradhoz! ("+(req.body.Date).replaceAll("-", ". ")+". "+req.body.Start+"-"+req.body.End+")"])
                await sql_con.promise().query("INSERT INTO ReserveIt_Reservations(Name, ReserverID, WorkerID, BusinessID, Start, End, Price, Phone, Status) VALUES(?, ?, ?, ?, ?, ?, ?, ?, 'Pending')", [req.body.Name, doesExist[0][0].AccountID, req.body.WorkerID, req.body.BusinessID, req.body.Date+" "+req.body.Start, req.body.Date+" "+req.body.End, req.body.Price, req.body.Phone])
                res.status(201).send({errorMsg: "Foglalás létrehozva!"})
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