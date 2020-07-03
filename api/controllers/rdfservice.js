const io = require('../../bin/www').io
const stats = require('stats-lite')
const observe = require('observe')
const mongoose = require('mongoose')
const Weight = mongoose.model('Weight')
const picPath = '../../client/assets/image/weights/'

let weightBuffer = []
let img1Taken = false
let img2Taken = false
let images = []
let vehicle = {
    weight: 0
}
let observer = observe(vehicle)

require('./scale')
require('./stream')

async function setId() {

    let id
    let weightCount = 1
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
        dbContent = await Weight.find({ date: { $gt: new Date(todayForm) } })
    } catch (err) {
        console.log(err.message)
    }

    dbContent.forEach(elem => {
        weightCount++
    })
    if (weightCount < 10) {
        id = today + '_0' + weightCount
    } else {
        id = today + '_' + weightCount
    }
    return id
}

function namePics(id) {
    let pics = []
    const imageCount = images.length
    for (var i = 1; i = imageCount; i++) {
        let picId = ''
        if (imageCount < 10) {
            picId = id + '_0' + i + '.jpg'
        } else {
            picId = id + '_' + i + '.jpg'
        }
        pics.push(picId)
    }
    return pics
}

module.exports.getWeights = (weight) => {

    if (weight != observer.subject.weight) {
        observer.set('weight', weight)
    }

    if (weight !== undefined && typeof (weight) === 'number' && !isNaN(weight) && weight > 200) {
        weightBuffer.push(weight)
    }

    if (weight < 200 && !isNaN(weight)) {

        const avgWeight = stats.mode(weightBuffer)

        weightBuffer.length = 0

        if (avgWeight !== undefined && typeof (avgWeight) === 'number' && !isNaN(avgWeight) && avgWeight > 500) {

            setId().then(id => {

                let newWeight = new Weight()
                const now = new Date()
                newWeight.id = id
                newWeight.weight = avgWeight
                newWeight.date = now
                newWeight.pics = namePics(id)
                newWeight.save(function (err, product) {
                    if (err) {
                        console.log(err)
                    }
                    console.log(product + ' saved to db!')
                    /*for (var i = 0; i < images.length; i++) {
                        const path = picPath + product.pics[i]
                        const param = [cv.IMWRITE_JPEG_QUALITY, 50]
                        cv.imwrite(path, images[i], param)
                    }
                    images.length = 0
                    img1Taken = false
                    img2Taken = false*/
                })
            })
        }
    }

}

function tableUpdate() {
    Weight.find({}).sort({ date: -1 }).exec(function (err, result) {
        if (err) {
            console.log(err)
        } else if (result) {
            let todayWeights = []
            let today = new Date()
            let cYear = today.getFullYear()
            let cMonth = today.getMonth() + 1
            let cDay = today.getDate()

            for (var i = 0; i < result.length; i++) {

                let date = result[i].date
                let year = date.getFullYear()
                let month = date.getMonth() + 1
                let day = date.getDate()

                if (year === cYear && month === cMonth && day === cDay) {
                    todayWeights.push(result[i])
                }
            }
            io.emit('tableupdate', todayWeights)

        }
    })
}

observer.on('change', (change) => {
    io.emit('weight', observer.subject.weight)
    tableUpdate()
})

io.on('connection', function (client) {

    client.emit('connectStatus', 'Server Connected')

    client.on('join', function (data) {
        console.log(data)
        tableUpdate()
    });

    client.on('dateinput', function (data) {

        Weight.find({}).sort({ date: 1 }).exec(function (err, result) {
            if (err) {
                console.log(err)
            } else if (result) {

                let expectedWeights = []
                let today = new Date(data)
                let cYear = today.getFullYear()
                let cMonth = today.getMonth() + 1
                let cDay = today.getDate()

                for (var i = 0; i < result.length; i++) {

                    let date = result[i].date
                    let year = date.getFullYear()
                    let month = date.getMonth() + 1
                    let day = date.getDate()

                    if (year === cYear && month === cMonth && day === cDay) {
                        expectedWeights.push(result[i])
                    }
                }
                client.emit('updatebydate', expectedWeights)
            }
        })

    })

    client.on('disconnect', function () {
        console.log('Client disconnected')
    })

})