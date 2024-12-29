const port = 4000;
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")
const multer = require("multer")
const path = require("path")
const cors = require("cors");
const { error } = require("console");

//middlewares
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

//schema for creating products
const Product = mongoose.model("Product",{
    id:{
        type:Number,
        required:true
    },
    name: {
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    new_price:{
        type:Number,
        required:true
    },
    old_price:{
        type:Number,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    available:{
        type:Boolean,
        default:true
    }
})

//api for adding a product
app.post('/addproduct',async(req,res)=>{
    let products = await Product.find({})
    let id;
    if(products.length>0){
        const last_element_array = products.slice(-1)
        const last_elemnt = last_element_array[0]
        id = last_elemnt.id + 1
    }
    else{
        id=1
    }
    const product = new Product({
        id:id,
        name:req.body.name,
        image:req.body.image,
        category:req.body.category,
        new_price:req.body.new_price,
        old_price:req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("saved");  
    res.json({
        success:1,
        name:req.body.name
    })
})

//api for deleting a product
app.post("/removeproduct",async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id})
    console.log("Deleted");
    res.json({
        success:true,
        name:req.body.name
    }) 
})

//api to get all the products
app.get("/getallproducts",async(req,res)=>{
    const product = await Product.find({})
    console.log("Got all products");
    res.send(product)
})

//Schema for creating user model
const Users = mongoose.model("Users",{
    name:{
        type:String
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String
    },
    cartData:{
        type:Object
    },
    date:{
        type:Date,
        default:Date.now()
    }
})

app.post("/signup",async(req,res)=>{
    let check = await Users.findOne({email:req.body.email})
    if(check){
        return res.status(400).json({
            success:false,
            errors:"Email already exists!"
        })
    }
    let cart = {};
    for(let i=0;i<300;i++){
        cart[i]=0;
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart
    })
    await user.save()
    const data ={
        user:{
            id:user.id
        }
    }
    const token = jwt.sign(data,"secret_ecom")
    res.json({success:true,token})
})

//api for creating login
app.post("/login",async(req,res)=>{
    let user = await Users.findOne({email:req.body.email})
    if(user){
        const comparePass = user.password === req.body.password
        if(comparePass){
            const data={
                user:{
                  id:user.id
                }
            }
            const token = jwt.sign(data,"secret_ecom")
            res.json({success:true,token})
        }
        else{
            res.json({success:false,error:"Wrong password"})
        }
    }
    else{
        res.json({success:false,error:"No such email exists"})
    }
})

app.get('/newcollections',async(req,res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8)
    console.log("NewCollections Fetched");
    res.send(newcollection)
})

app.get('/popularinwomen',async(req,res)=>{
    let products = await Product.find({category:"women"})
    let popularinwomen = products.slice(0,4)
    console.log("Popular in women products fetched");
    res.send(popularinwomen)
    
})

const fetchUser = async(req,res,next)=>{
  const token = req.header('auth-token')
  if(!token){
    res.status(401).send({errors:"Please authenticate using valid token"})
  }
  else{
    try{
        const data = jwt.verify(token,'secret_ecom');
        req.user = data.user;
        next()
    }catch(err){
        res.status(401).send({errors:"please authenticate"})
    }
  }
}

app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("The added item is:",req.body,req.user);
    let userData = await Users.findOne({_id:req.user.id})
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.json({msg:"Added to cart"})
})

app.post('/removefromcart',fetchUser,async(req,res)=>{
    console.log("The removed item is:",req.body,req.user);
    let userData = await Users.findOne({_id:req.user.id})
    if(userData.cartData[req.body.itemId]>0)
    userData.cartData[req.body.itemId] -=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData})
    res.json({msg:"Removed from cart"})
    
})

app.listen(port,(err)=>{
    if(!err){
        console.log("Port running on "+port);   
    }
    else{
        console.log("Error: "+err);
    }
})