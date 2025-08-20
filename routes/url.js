const express = require("express");
const router = express.Router();
const {handleGenShortURL,handleGetAnalytics} = require('../controllers/url')

router.post('/', handleGenShortURL);
router.get('/analytics/:shortId',handleGetAnalytics)

module.exports = router;