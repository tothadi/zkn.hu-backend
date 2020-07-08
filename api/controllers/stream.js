
const child_process = require('child_process'),
    path = process.env.StreamURI,//'./cars.mp4'//
    ffmpeg = require('fluent-ffmpeg')

module.exports.sendStream = function (req, res) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Connection': 'Keep-Alive',
        'Content-Type': 'video/mp4'
    })

    ffmpeg()
        .input(path)
        .native()
        .inputOptions(
            '-rtsp_transport', 'tcp'
        )
        .noAudio()
        .on('start', function (commandLine) {
            console.log('Spawned Ffmpeg with command: ' + commandLine);
        })
        .on('codecData', function (data) {
            console.log('Input is ' + data.audio + ' audio ' +
                'with ' + data.video + ' video');
        })
        .on('stderr', function (stderrLine) {
            console.log('Stderr output: ' + stderrLine);
        })
        .on('error', function (err, stdout, stderr) {
            console.log('Cannot process video: ' + err.message);
        })
        .output(stream)
        .format('mp4')
        .outputOptions([
            '-an',
            '-c:v', 'copy',
            '-movflags', '+frag_keyframe+empty_moov+default_base_moof',
            '-metadata', 'title="media source extensions"'
        ])
        .pipe(res)
    /*const ffmpeg = child_process.spawn('ffmpeg', [
        '-fflags', '+igndts', '-an', '-rtsp_transport', 'tcp',
        '-i', path,
        '-an', '-c:v', 'copy', '-f', 'mp4', '-movflags', '+frag_keyframe+empty_moov+default_base_moof', '-metadata', 'title="media source extensions"', 'pipe:1'
    ]).then(() => {

    })

    ffmpeg.stderr.setEncoding('utf8');
    ffmpeg.stderr.on('data', (data) => {
        console.log(data)
    })

    ffmpeg.stdout.on('data', data => {
        data.pipe(res)
    })*/



    req.on('close', () => {
        res.destroy()
    })

}