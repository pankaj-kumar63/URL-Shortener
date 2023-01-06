const express = require("express");

const app = express();
const shortUrlModel = require('./models/ShortUrl');
const mongoose  = require("mongoose");
require('dotenv').config()
const url = `${process.env.MONGO_URI}`;
const shortId = require("shortid")
const path = require("path")
const cors = require("cors")
app.use(express.urlencoded({extended:false}));
app.use(express.json())
app.use(express.static('./public'))
app.use(cors())
app.set('views', path.join(__dirname, './public'))
// app.set('view engine','ejs');

//    database connection start

const connectionParams={
    useNewUrlParser: true,
    useUnifiedTopology: true 
}
mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

//      database connection end

app.listen(process.env.PORT||8000,()=>console.log("server started!"));

//for validating the url
function isValidURL(url) {
    var res = url.match(/^(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    return (res !== null)
  };


//home page
app.get("/",(req,res)=>{
    res.render("index");
})

//api endpoint for shortening the url
app.post("/shortUrl",async (req,res)=>{
    const {url} = req.body;
    if(!url || !isValidURL(url))
    {
        return res.status(400).json({error:"invalid url"})
    }
    let shortUrl = await shortUrlModel.findOne({full:url})
    if(!shortUrl)
    {
        shortUrl = shortId.generate();
        await shortUrlModel.create({full:url,short:shortUrl});
    }
    else
    shortUrl = shortUrl.short
    res.status(201).json({shortUrl:`${process.env.NAME}/${shortUrl}`});
})

//REDIRECTING SHORT TO ORGINAL URL
app.get("/:shortUrl",async (req,res)=>{
    const shortUrl = req.params.shortUrl;
    const urlinfo = await shortUrlModel.findOne({short:shortUrl});

    if(urlinfo==null)
    return res.sendStatus(404);
    res.redirect(urlinfo.full);
})