const mongoose = require('mongoose')
const Intro = mongoose.model('Intro')

module.exports.sendIntro = function (req, res) {

    Intro.find({}).exec(function (err, result) {
        if (err) throw err
        let results = JSON.stringify(result)
        res.status(200)
        res.json(results)
    })

}

module.exports.updateIntro = function (req, res) {


    const introData = req.body,
        filter = { id: 0 },
        updated = { $set: { id: 0, text: introData.text, date: new Date(), sign: introData.sign, rank: introData.rank } },
        options = { upsert: true }

    Intro.updateOne(filter, updated, options, err => {
        res.status(200);
        if (err) {
            console.log(err)
            res.json({
                'saved': false,
                'message': err
            });
        } else {
            res.json({
                'saved': true,
                'message': 'ok'
            });
        }
    });

};