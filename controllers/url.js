const shortid = require("shortid");
const URL = require('../models/url')

async function generateNewShortUrl(req,res){
    const {url} = req.body;
    if(!url) return res.status(400).json({error:'URL is Required'})

    const shortID = shortid(8);

    await URL.create({
        shortId: shortID,
        redirectURL:url,
        visitHistory:[],

    });
    
    return res.json({ id: shortID, redirectTo: '/' });

    //

}

async function handleGetAnalytics(req,res){

    const shortId = req.params.shortId;
    const result = await URL.findOne({shortId});
    
    return res.json({
        totalClicks : result.visitHistory.length, 
        analytics: result.visitHistory,
    })
    
}

module.exports = {
    generateNewShortUrl,
    handleGetAnalytics,
}