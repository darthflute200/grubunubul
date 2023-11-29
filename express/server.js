const express = require('express');
const path = require('path');
const session = require("express-session");
const multer = require("multer");
const userrole = require("../models/userrolesmodel");
const user = require("../models/usermodel");
const ilan = require("../models/ilanmodel");
const createTableRelations = require('../models/tables');
const db = require("./db");
const csrf = require("csurf");
const cookie = require("cookie-parser");
createTableRelations();
async function sync(){
    try{
        user.sync({alter:true});
        userrole.sync({alter:true});
        ilan.sync({alter: true});
        console.log("tablolarınız oluşturuldu");
    }
    catch(err){
        console.log(err);
    }
}
sync();
const csrfprotect = csrf({cookie: true});
const app = express();
const port = 3000;

// Middleware'ler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const csrfmiddleware = [
    cookie(),
    csrfprotect
]

// Oturum middleware'i
app.use(session({
    secret: "Gomeeg2001",
    resave: false,
    saveUninitialized: true
}));

// Rota tanımları
const userRouters = require('../routes/routes');
app.use(userRouters);

// Sunucu dinleme
app.listen(port, () => {
    console.log(`Sunucu ${port} numaralı port üzerinde çalışıyor`);
});

// Statik dosyalar
app.use(express.static(path.join(__dirname, "../views")));
app.set("view engine", "ejs");
dosyakonum = app.use(express.static(path.join(__dirname, '../uploads')));
console.log(dosyakonum);

// Oturum bağlantısını export et
module.exports = app;



