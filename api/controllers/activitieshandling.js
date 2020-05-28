const mongoose = require('mongoose')
const Activities = mongoose.model('Activities')

module.exports.sendActivities = function (req, res) {

    Activities.find({}).sort({ sort: 1 }).exec(function (err, result) {
        if (err) throw err
        let results = JSON.stringify(result)
        res.status(200)
        res.json(results)
    })

}

