const port = 4000;
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
const cors = require("cors")

app.use(express.json())
app.use(cors())

//database connection with mongodb
mongoose.connect("mongodb+srv://mohanaofficial04:Mohu%400417@cluster0.e8hkq.mongodb.net/Ecommerce")

//API CONNECTION
app.get("/",(req,res)=>{
    res.send("Express app is running")
})

const storage = multer.diskStorage({
    destination:'./upload/images',
    filename:(req,file,cb)=>{
       return cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({storage:storage})

app.use('/images',express.static('./upload/images'))

app.post('/upload',upload.single('product'),(req,res)=>{
    res.json({
        success:1,
        image_url:`http://localhost:${port}/images/${req.file.filename}`
    })
})

app.listen(port,(err)=>{
    if(!err){
        console.log("Port running on "+port);   
    }
    else{
        console.log("Error: "+err);
    }
})