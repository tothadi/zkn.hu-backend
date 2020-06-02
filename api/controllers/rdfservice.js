const io = require('../../bin/www').io
const stats = require("stats-lite")
const observe = require('observe')
const mongoose = require('mongoose')
const Weight = mongoose.model('Weight')

const { runVideoDetection, cv } = require('./opencvutils')

let weightBuffer = []

require('./scale')

let vehicle = {
    weight: 0
}

let observer = observe(vehicle)

module.exports.getWeights = (weight) => {

    if (weight != observer.subject.weight) {
        observer.set('weight', weight)
    }

    if (weight !== undefined && typeof (weight) === 'number' && !isNaN(weight) && weight > 200) {
        weightBuffer.push(weight);
    }

    if (weight < 200 && !isNaN(weight)) {

        const avgWeight = stats.mode(weightBuffer)

        weightBuffer.length = 0

        if (avgWeight !== undefined && typeof (avgWeight) === 'number' && !isNaN(avgWeight) && avgWeight > 500) {

            let newWeight = new Weight()
            newWeight.weight = avgWeight
            newWeight.date = new Date()
            newWeight.save(function (err, product) {
                if (err) {
                    console.log(err)
                }
                console.log(product + ' saved to db!')
            })
        }
    }

}
//io
io.on('connection', function (client) {

    client.emit('connectStatus', 'Server Connected');

    client.on('join', function () {
        const sendToClient = (img) => {
            let frame = cv.imencode('.jpg', img).toString('base64');
            client.emit('stream', frame)
        }
        runVideoDetection(process.env.StreamURI, sendToClient)
    })

    client.on('join', function (data) {
        console.log(data);
    });

    client.on('join', function () {

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
                    client.emit('tableupdate', todayWeights)

                }
            })
        }

        tableUpdate()

        observer.on('change', (change) => {
            client.emit('weight', observer.subject.weight)
            tableUpdate()
        })

    })

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