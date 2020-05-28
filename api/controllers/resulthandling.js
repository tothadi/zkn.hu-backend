var mongoose = require('mongoose');
var Result = mongoose.model('Result');

var sendJSONresponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.retrieveTop = function (req, res) {

    Result.find({}).sort({ time: 1 }).exec(function (err, result) {
        
        if (err) {
            console.log(err);
        } else {
            res.status(200);
            res.json(result);
        }
    });
}

module.exports.checkPass = function (req, res) {

    const pass = req.body.password
    console.log(pass)
    if (pass === process.env.secret) {
        res.json({
            'found': true
        })
    } else {
        res.json({
            'found': false
        })
    }
}

module.exports.checkName = function (req, res) {

    const user = req.body.username
    Result.findOne({ username: user }).exec(function (err, user) {
        if (err) {
            console.log(err)
        } else {
            if (user) {
                res.json({
                    'found': true
                })
            } else {
                res.json({
                    'found': false
                })
            }
        }
    })
}

module.exports.result = function (req, res) {

    const newResult = new Result();
    newResult.time = req.body.time;
    newResult.username = req.body.username;
    newResult.date = req.body.date;
    newResult.save(function (err) {
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