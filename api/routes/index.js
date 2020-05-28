const express = require('express')
const router = express.Router()
const jwt = require('express-jwt')
//var auth = jwt({
//  secret: process.env.secret,
//  userProperty: 'payload'
//});

//var ctrlProfile = require('../controllers/profile');
//var ctrlAuth = require('../controllers/authentication');
const ctrlNews = require('../controllers/newshandling')
const ctrlActivities = require('../controllers/activitieshandling')
const ctrlSelective = require('../controllers/selectivehandling')
const ctrlResult = require('../controllers/resulthandling');


router.get('/news', ctrlNews.sendNews)
router.get('/archives', ctrlNews.sendArchive)
router.post('/upload', ctrlNews.Addnews)

router.get('/activities', ctrlActivities.sendActivities)
router.get('/selective', ctrlSelective.sendSelective)
router.get('/island', ctrlSelective.sendIsland)
router.post('/play', ctrlResult.result)
router.post('/checkname', ctrlResult.checkName)
router.post('/checkpass', ctrlResult.checkPass)


router.post('/selectiveupdate', ctrlSelective.updateSelective)
//router.get('/user', auth, ctrlProfile.profileRead);
router.get('/results', ctrlResult.retrieveTop);
//router.post('/result', ctrlResult.retrieveOwn);

//router.post('/signup', ctrlAuth.register);
//router.post('/signin', ctrlAuth.login);
//router.post('/play', ctrlResult.result);

module.exports = router;
