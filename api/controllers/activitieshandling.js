const mongoose = require('mongoose')
const Activities = mongoose.model('Activities')
const Selective = mongoose.model('Selective')

module.exports.sendActivities = function (req, res) {

    Activities.find({}).sort({ sort: 1 }).exec(function (err, result) {
        if (err) throw err
        let results = JSON.stringify(result)
        res.status(200)
        res.json(results)
    })

}

/*
module.exports.updateActivities = function (req, res) {

    const introData = req.body
    console.log(introData)


    Selective.find({}).sort({ order: 1 }).exec(function (err, result) {
        let filter = { sort: 1 },
            updated = { $set: { subs: result } },
            options = { upsert: true }

        Activities.updateOne(filter, updated, options, err => {
            res.status(200);
        })

    })




}*/