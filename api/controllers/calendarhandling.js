'use strict'
const
    mongoose = require('mongoose'),
    Street = mongoose.model('Street'),
    excelToJson = require('convert-excel-to-json'),
    fs = require('fs');

const result = excelToJson({
    source: fs.readFileSync('utcak.xlsx'),
    columnToKey: {
        A: 'street',
        B: 'area',
        C: 'single',
        D: 'multi',
        E: 'yellow',
        F: 'blue',
        G: 'green'
    }
});

let counter = 0

module.exports.saveCal = function (req, res) {

    console.log(req.body)

    result.utcak.forEach((elem, i) => {
        let mix = []
        mix.push(parseInt(elem.multi.substr(1, 1)))
        if (elem.multi.length > 3) {
            mix.push(parseInt(elem.multi.substr(3, 1)))
        }
        const newStreet = new Street()
        newStreet.index = i
        newStreet.street = elem.street
        newStreet.area = elem.area
        newStreet.single = elem.single
        newStreet.multi = mix
        newStreet.yellow = elem.yellow
        newStreet.blue = elem.blue
        newStreet.green = elem.green
        newStreet.save(err => {
            if (err) {
                console.log(err.message)
            } else {
                counter++
            }
        });
    })

    res.json(`${counter} utca elmentve`)

}

module.exports.calZegMulti = (req, res) => {
    Street.find({}).sort({ index: 1 }).exec(function (err, results) {
        if (err) throw err
        let cal = results
            .reduce((r, c) => {
                if (c.multi.length > 1) {
                    r.push(c)
                }
                return r
            }, [])
            .map(result => {
                let calElem = {
                    street: result.street,
                    area: result.area,
                    single: result.single,
                    multi: result.multi,
                    yellow: result.yellow,
                    blue: result.blue,
                    green: result.green
                }
                return calElem
            })
        res.status(200)
        res.json(cal)
    })
}

module.exports.calZegSingle = (req, res) => {
    Street.find({}).sort({ index: 1 }).exec(function (err, results) {
        if (err) throw err
        let cal = results
            .map(result => {
                let calElem = {
                    street: result.street,
                    area: result.area,
                    single: result.single,
                    multi: result.multi,
                    yellow: result.yellow,
                    blue: result.blue,
                    green: result.green
                }
                return calElem
            })
        res.status(200)
        res.json(cal)
    })
}

module.exports.calVidek = (req, res) => {
    Street.find({}).sort({ index: 1 }).exec(function (err, result) {
        if (err) throw err
        res.status(200)
        res.json(result)
    })
}