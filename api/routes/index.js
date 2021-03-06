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
const ctrlResult = require('../controllers/resulthandling')
const ctrlIntro = require('../controllers/introhandling')
const ctrlCalendar = require('../controllers/calendarhandling')
//const ctrlStream = require('../controllers/stream')



router.get('/news', ctrlNews.sendNews)
router.get('/archives', ctrlNews.sendArchive)
router.post('/upload', ctrlNews.Addnews)

router.get('/intro', ctrlIntro.sendIntro)
router.get('/activities', ctrlActivities.sendActivities)
router.post('/play', ctrlResult.result)
router.post('/checkname', ctrlResult.checkName)
router.post('/checkpass', ctrlResult.checkPass)

//router.post('/updateact', ctrlActivities.updateActivities)
router.post('/updateintro', ctrlIntro.updateIntro)
router.post('/selectiveupdate', ctrlSelective.updateSelective)
router.get('/cal', ctrlCalendar.saveCal)
router.get('/cal-zeg-single', ctrlCalendar.calZegSingle)
router.get('/cal-zeg-multi', ctrlCalendar.calZegMulti)
router.get('/cal-videk', ctrlCalendar.calVidek)
router.get('/results', ctrlResult.retrieveTop);
//router.post('/result', ctrlResult.retrieveOwn);
//router.post('/signup', ctrlAuth.register);
//router.post('/signin', ctrlAuth.login);
//router.post('/play', ctrlResult.result);

module.exports = router;
