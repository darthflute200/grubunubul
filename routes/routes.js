const express = require('express');
const { Op } = require('sequelize');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const path = require('path');
const {upload , uploadfolder} = require("../middlewares/multermiddleware");
const router = express.Router();
const app = express();
const bcrypt = require('bcrypt');
const User = require("../models/usermodel");
const ilan = require("../models/ilanmodel");
const fs = require("fs");
const authMiddleware = require("../middlewares/authmiddleware");
const { DATE } = require('sequelize');
const session = require('express-session');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
function generateToken() {
    return crypto.randomBytes(20).toString('hex');
  }
router.get("/",authMiddleware,async function(req,res){
    const ilanlar = await ilan.findAll({
        include: User
    });
    res.render(path.join(__dirname,"../views/user","anasayfa.ejs"),{ilanlar});
});
router.get("/forgot-password",async function(req,res){
    res.render(path.join(__dirname,"../views/user","forgotpassword.ejs"));
});
router.post("/forgot-password", async function(req,res){
    const user = await User.findOne({where: {email: req.body.email}});
    if(!user){
        res.status(404).send("Kullanıcı Bulunamadı");
    }
    const token = generateToken();
    await User.update(
        {
          resetpassword: token,
          resetpassworddate: Date.now() + 3600000
        },
        {
          where: { email: req.body.email }
        }
      );
    const transporter = nodemailer.createTransport({
       service: "hotmail",
       auth:{
        user: "egeozdalyan2001@hotmail.com",
        pass: "Gomeeg2001"
       }
    });
    const mailOptions = {
        to: req.body.email,
        from: 'egeozdalyan2001@hotmail.com',
        subject: 'Şifre Sıfırlama',
        text: `Şifrenizi sıfırlamak için aşağıdaki bağlantıya tıklayın: \n\n
                http://${req.headers.host}/reset-password/${token}\n\n
                Bağlantı 1 saat boyunca geçerlidir.`
    };
    await transporter.sendMail(mailOptions);
    res.send("mailinize eposta gönderildi")
});
router.get("/reset-password/:token", async function(req,res){
    try{
        const token = req.params.token;
        const user = await User.findOne({
            where: {
              resetpassword: token,
              resetpassworddate: { [Op.gt]: Date.now() }
            }
          });
          if(!user){
            res.status(404).send("bağlantısı dolmuş veya geçersiz bağlantı");
          }
          res.render(path.join(__dirname,"../views/user","resetpassword.ejs"),{token});
    }
    catch(err){
        console.log(err);
    }
});
router.post("/reset-password/:token", async function(req,res){
    try {
        const { token } = req.params;
        const user = await User.findOne({
          where: {
            resetpassword: token,
            resetpassworddate: { [Op.gt]: Date.now() }
          }
        });
    
        if (!user) {
          return res.status(400).send('Geçersiz veya süresi dolmuş bağlantı.');
        }
        const newpassword = await hashpassword(req.body.newpassword)
        await User.update(
            {
              resetpassword: null,
              resetpassworddate: null,
              password: newpassword
            },
            {
              where: { id : user.id }
            }
          );
        res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
})
router.get("/uyekayit", function(req,res){
    try{
        res.render(path.join(__dirname,"../views/user","uyekayit.ejs"));
    }
    catch(err){
        console.log(err);
    }
});
router.get("/ilanlarim", authMiddleware, async function(req,res){
    try{
        if(req.session.user){
            const ilanlarim = await ilan.findAll({
                include: User,
                where:{
                    UserId: req.session.user.id
                }
            });
            res.render(path.join(__dirname,"../views/user","ilanlarim.ejs"),{ilanlarim});
        }
    }
    catch(err){
        console.log(err);
    }
});
router.post("/uyekayit", async function(req, res){
    const hashedpassword = await hashpassword(req.body.password);
    try {
        if(req.body.password == req.body.passwordRepeat){
          await User.create({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedpassword,
            sex: req.body.cinsiyet,
            UserroleId: 3
        });
        res.redirect("/");
        }
        else{
            res.render("user/uyekayit",{hata : "Şifreler aynı olmalı"});
        }
      } catch (err) {
        console.log(err);
      }
});
async function hashpassword(password){
    try{
        const hashedpassword = await bcrypt.hash(password, 10);
        return hashedpassword;
    }
    catch(err){
        console.log(err);
    }
}
router.get("/uyegiris" , function(req , res){
    try{
        res.render(path.join(__dirname,"../views/user","uyegiris.ejs"));
    }
    catch(err){
        console.log(err);
    }
});
router.get("/hesabim", authMiddleware, async function(req , res){
    try{
        if(req.session.user){
            const hesapbilgileri = await User.findOne({
                where:{
                    id: req.session.user.id
                }
            })
           res.render(path.join(__dirname,"../views/user","hesabim.ejs"), {hesapbilgileri});
        }
    }
    catch(err){
        console.log(err);
    }
});
router.get("/ilanver",authMiddleware, function(req , res){
    if(req.session.user){
       try{
          res.render(path.join(__dirname,"../views/user","ilanver.ejs"));
        }
        catch(err){
           console.log(err);
        }
    }
});
router.get("/profilduzenle",authMiddleware, async function(req , res){
    if(req.session.user){
       try{
        const hesabıduzenle = await User.findOne({
            where:{
                id: req.session.user.id
            }
        })
        res.render(path.join(__dirname,"../views/user","profilduzenle.ejs"), {hesabıduzenle});
        }
        catch(err){
           console.log(err);
        }
    }
});
router.post("/profilduzenle", authMiddleware, async function(req, res){
    try{
       const profilduzenle = await User.update({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            phone: req.body.phone,
            sex: req.body.cinsiyet
        },{
            where:{
                id: req.session.user.id
            }
        });
        if(req.body.oldpassword){
            const user = await User.findOne({
                where:{
                    id: req.session.user.id
                }
            });
            if(user){
                const sifresorgula = checkPassword(req.body.oldpassword, user.password);
                if(sifresorgula){
                    const newpassword = await hashpassword(req.body.newpassword)
                    const sifreupdate = User.update({
                        password: newpassword
                    },{
                        where:{
                            id: req.session.user.id
                        }
                    });
                }
            }
        }
        res.redirect("/hesabim");
    }
    catch(err){
        console.log(err);
    }
});
router.post("/ilanver", authMiddleware ,upload.single("grupresmi"), async (req , res) => {
    try{ 
        await ilan.create({
        baslik: req.body.baslik,
        acıklama: req.body.aciklama,
        grupresmi: req.file.filename,
        aranan: req.body.aranan,
        UserId: req.session.user.id,
        tarih: new Date().toLocaleDateString("tr-TR")
       });
       res.redirect("/");
    }
    catch(err){
        console.log(err);
    }
});
router.get("/logout" , function(req , res){
    if(req.session.user){
       try{
          req.session.destroy();
          res.redirect("/");
        }
        catch(err){
           console.log(err);
        }
    }
});
router.get("/ilanduzenle/:ilanid" , async function(req , res){
    if(req.session.user){
        const Ilanid = req.params.ilanid;
        const mevcutilan = await ilan.findOne({
            where:{
                UserId : req.session.user.id,
                ilanid: Ilanid
            }
        });
        if(!mevcutilan){
            res.status(404).send("ilan bulunamadı");
        }
        res.render(path.join(__dirname,"../views/user","ilanduzenle.ejs"),{mevcutilan});
    }
});
router.post("/ilanduzenle/:ilanid" ,upload.single("grupresmi"), async function(req , res){
    if(req.session.user){
        const Ilanid = req.params.ilanid;
        const ilanupdate = await ilan.update({
            baslik : req.body.baslik,
            acıklama : req.body.aciklama,
            aranan : req.body.aranan
        },{
            where:{
                UserId : req.session.user.id,
                ilanid: Ilanid
            }
        });
        if(req.file){
            const mevcutilan = await ilan.findOne({
                where:{
                    UserId : req.session.user.id,
                    ilanid : Ilanid
                }
            });
            const deletephotopath = "/Users/egeozdalyan/Desktop/grubunubul.com/views/uploads/" + mevcutilan.grupresmi;
            fs.unlink(deletephotopath, (err) =>{
                if (err) {
                    console.error("Dosya silinirken bir hata oluştu:", err);
                } 
            })
            const ilanremi = await ilan.update({
                grupresmi : req.file.filename
            },{
                where:{
                    UserId : req.session.user.id,
                    ilanid: Ilanid
                }
            });
        }
        res.redirect("/");
    }
});
router.post("/uyegiris", async function(req,res){
    email = req.body.email;
    password = req.body.password;
    try{
        const user = await User.findOne({
            where:{
               email: email
            }
        })
        if(user){
            Ispasswordvalid = checkPassword(password, user.password);
            if(Ispasswordvalid){
                req.session.user = {
                    id : user.id,
                    name: user.name,
                    surname : user.surname,
                    userroleid : user.UserroleId
                }
                res.redirect("/");
                console.log(req.session.user);
            }
            else{
                console.log("parola yanlış");
            }
        }
        else{
            console.log("kullanıcı bulunamadı")
        }
    }
    catch(err){
        console.log(err);
    }
});
router.get("/ilani-sil/:ilanid", async function(req,res){
    if(req.session.user){
        const mevcutilan = await ilan.findOne({
            where:{
                ilanid : req.params.ilanid,
                UserId: req.session.user.id
            }
        });
        const deletephotopath = "/Users/egeozdalyan/Desktop/grubunubul.com/views/uploads/" + mevcutilan.grupresmi;
        fs.unlink(deletephotopath, (err) =>{
            if(err){
                console.log(err);
            }
        })
        const ilanısil = await ilan.destroy({
            where:{
                ilanid : req.params.ilanid,
                UserId: req.session.user.id
            }
        });
        res.redirect("/")
    }
})
async function checkPassword(inputPassword, hashedPassword) {
    try {
      const match = await bcrypt.compare(inputPassword, hashedPassword);
      return match;
    } catch (error) {
      console.error('Parola karşılaştırma hatası:', error);
      return false;
    }
  }
module.exports = router;