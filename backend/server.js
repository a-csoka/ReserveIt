const express = require('express');
const {Sequelize} = require('sequelize');
const app = express();
const port = process.env.PORT || 5000;

require('dotenv').config();

const sequelize = new Sequelize(process.env.SQL_DATABASE, process.env.SQL_USER, process.env.SQL_PASSWORD, {
    host: process.env.SQL_HOST,
    dialect: "mysql",
    port: parseInt(process.env.SQL_PORT),
});

sequelize.authenticate().then(() => {
    console.log('[Adatbázis]: A kapcsolat sikeresen létrejött!');
 }).catch((error) => {
    console.error('[Adatbázis]: ', error);
 });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


function isFieldNotEmpty(string){
    if(string.replace(" ", "")){
        return true
    }
    return false
}

app.post("/registerUser", async (req, res) => {
    if (isFieldNotEmpty(req.body.firstName)){

    }
    if(isFieldNotEmpty(req.body.lastName)){
        
    }
    if(isFieldNotEmpty(req.body.email)){

    }
    if(isFieldNotEmpty(req.body.password)){

    }
    if(isFieldNotEmpty(req.body.rePassword)){
        
    }
})

app.listen(port, () => console.log(`Listening on port ${port}`));

