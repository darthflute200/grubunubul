const multer = require("multer");
const path = require("path");
const uploadfolder = "/Users/egeozdalyan/Desktop/grubunubul.com/views/uploads"
const storage = multer.diskStorage({
    destination: function(req,res,cb){
        cb(null,uploadfolder);
    },
    filename: function(req,file,cb){
        console.log(file);
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({ storage: storage });
module.exports = {upload , uploadfolder};