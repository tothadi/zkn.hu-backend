const fs = require('fs')
const mongoose = require('mongoose')
const IncomingForm = require('formidable').IncomingForm
const News = mongoose.model('News')
const picPath = './client/assets/image/news/'

var imageCount = 0
var pics = []

module.exports.sendArchive = function (req, res) {

    let now = new Date()
    let year = now.getFullYear().toString()

    News.find({}).sort({ date: -1 }).exec(function (err, result) {
        if (err) throw err
        let results = JSON.stringify(result)
        res.status(200)
        res.json(results)
    })

}

module.exports.sendNews = function (req, res) {

    News.find({}).sort({ date: -1 }).exec(function (err, result) {
        if (err) throw err
        let results = JSON.stringify(result)
        res.status(200)
        res.json(results)
    })

}

async function setId() {

    let id
    var newsCount = 1
    let now = new Date()
    let year = now.getFullYear().toString()
    let month = now.getMonth() + 1
    if (month < 10) {
        month = '0' + month
    } else {
        month = month.toString()
    }
    let day = now.getDate()
    if (day < 10) {
        day = '0' + day
    } else {
        day = day.toString()
    }
    let today = year + month + day
    let todayForm = `${year}-${month}-${day}`

    let dbContent
    try {
        dbContent = await News.find({ date: { $gt: new Date(todayForm) } })
    } catch (err) {
        console.log(err.message)
    }

    dbContent.forEach(elem => {
        newsCount++
    })
    if (newsCount < 10) {
        id = today + '_0' + newsCount
    } else {
        id = today + '_' + newsCount
    }
    return id
}

function saveNews(newsData, id) {

    const newNews = new News()
    newNews.id = id
    newNews.title = newsData.title
    newNews.date = new Date()
    newNews.text = newsData.text
    newNews.sign = newsData.sign
    newNews.rank = newsData.rank
    newNews.pics = pics
    newNews.save(err => {
        if (err) {
            console.log(err.message)
        } else {
            imageCount = 0
            pics.length = 0
            console.log(`saved to db: ${newNews}`)
        }
    });

}

module.exports.Addnews = async function (req, res) {

    var form = new IncomingForm()

    setId().then(id => {

        form.on('file', (field, file) => {

            imageCount++;

            let newsData = JSON.parse(file.name)
            let news = {
                title: newsData.title,
                text: newsData.text,
                sign: newsData.sign,
                rank: newsData.rank
            }
            let picCount = newsData.picCount
            let picId = '';
            let ext = '';
            let type = file.type;
            if (type.substr(0, 4) == 'text') {
                fs.readFile(file.path, { encoding: 'utf8' }, (err, data) => {
                    if (err) throw err;
                    console.log(JSON.parse(data))
                });
            }
            if (type.substr(0, 5) == 'image') {
                ext = type.substr(6);
                if (ext == 'jpeg') {
                    ext = 'jpg'
                }
                if (imageCount < 10) {
                    picId = id + '_0' + imageCount + '.' + ext
                } else {
                    picId = id + '_' + imageCount + '.' + ext
                }
                pics.push(picId)
                let fileName = picPath + picId
                fs.readFile(file.path, (err, data) => {
                    if (err) throw err;
                    fs.writeFile(fileName, data, function (err) {
                        if (err) throw err;
                        console.log(`saved to: ${fileName}`)
                    });
                });
            }

            if (imageCount === picCount) {
                saveNews(news, id);
            }

        }),
            form.on('end', () => {

                res.status(200).json('OK');

            })


        form.parse(req)

    });




}
