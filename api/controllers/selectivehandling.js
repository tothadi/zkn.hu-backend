const mongoose = require('mongoose')
const IncomingForm = require('formidable').IncomingForm
const Selective = mongoose.model('Selective')
const Island = mongoose.model('Island')

module.exports.sendSelective = function (req, res) {

    Selective.find({}).exec(function (err, result) {
        if (err) throw err
        let results = JSON.stringify(result)
        res.status(200)
        res.json(results)
    })

}

module.exports.sendIsland = function (req, res) {

    Island.find({}).exec(function (err, result) {
        if (err) throw err
        let results = JSON.stringify(result)
        res.status(200)
        res.json(results)
    })

}

module.exports.updateSelective = function (req, res) {

    var form = new IncomingForm()

    form.on('file', (field, file) => {

        let selectiveData = JSON.parse(file.name)
        let selective = {
            id: selectiveData.id,
            title: selectiveData.title,
            text: selectiveData.text
        }
        console.log(selective)

    })

    form.on('end', () => {

        res.status(200).json('OK');

    })

    form.parse(req)

};

module.exports.save = function (req, res) {

    const newSelective = new Selective();
    newSelective.id = 'test';
    newSelective.title = 'test';
    newSelective.text = 'test';
    newSelective.pic = 'test';
    newSelective.clicked = false;
    newSelective.save(function (err) {
        res.status(200);
        if (err) {
            res.json({
                'Save status': err
            });
        } else {
            res.json({
                'Save status': 'ok!'
            });
        }
    });

};