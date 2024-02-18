const express = require('express')
const path = require('path')
const {connectToMongoDB} = require('./connect')
const urlRoute = require('./routes/url')
const staticRoute = require('./routes/staticRouter')
const URL = require('./models/url')
const app  = express();
const PORT =3000;
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.set('view engine','ejs');

app.set('views',path.resolve("./views"));


connectToMongoDB(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(error => console.error('Error connecting to MongoDB:', error));

app.use('/url',urlRoute);

app.use('/',staticRoute);

app.get('/url/:shortId', async (req,res) =>{

    const shortId = req.params.shortId;

    const entry = await URL.findOneAndUpdate({
        shortId
    },
    {
        $push: {
        VisitHistory: {
            timestamp : Date.now(),
        },
        },
    }
);
res.redirect(entry.redirectURL)
});


module.exports = app;