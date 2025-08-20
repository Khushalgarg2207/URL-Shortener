const express = require("express");
const app = express();
const PORT = 8002;
const URL = require('./models/url');
const connectMongoDb = require('./connect');
const path = require("path");

const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const {checkForAuthentication,restrictTo} = require('./middlewares/auth');
const cookieParser = require("cookie-parser");

connectMongoDb('mongodb://localhost:27017/short-url')
.then(console.log("MongoDb connected"));

app.set("view engine","ejs");
app.set("views",path.resolve('./views'))

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use('/url',restrictTo(["NORMAL","ADMIN"]),urlRoute);
app.use('/',staticRoute);
app.use('/user',userRoute);


app.get('/url/:shortId',async (req,res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId
    },{$push: {
        visitHistory: {
            timestamp: Date.now(),
        }
    }})
    res.redirect(entry.redirectURL);
})
app.listen(PORT,() => console.log(`Server connected to port ${PORT}`))