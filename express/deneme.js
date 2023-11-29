const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const db = require("./db");
const session = require("express-session");
const userrole = require("../models/userrolesmodel");
const user = require("../models/usermodel");
const createTableRelations = require('../models/tables');
createTableRelations();
async function sync(){
    try{
        user.sync({alter:true});
        userrole.sync({alter:true});
        console.log("tablolarınız oluşturuldu");
    }
    catch(err){
        console.log(err);
    }
}
sync();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const sessionconnect = app.use(session({
    secret: "Gomeeg2001",
    resave: false,
    saveUninitialized: true
}))
const userRouters = require('../routes/routes');
app.locals.sequelize = db;
app.use(userRouters);
app.listen(port , () =>{
    console.log(`Sunucu ${port} numaralı port üzerinde çalışıyor`);
});
app.use(express.static(path.join(__dirname,"../views")));
app.set("view engine","ejs");
module.exports = sessionconnect;