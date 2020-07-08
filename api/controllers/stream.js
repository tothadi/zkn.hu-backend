const child_process = require('child_process'),
    path = process.env.StreamURI,//'./cars.mp4',//
    ffmpeg = child_process.spawn('ffmpeg', [
        '-fflags', 'nobuffer',
        '-fflags', 'discardcorrupt',
        '-flags', 'low_delay',
        '-probesize', '32',
        '-analyzeduration', '0',
        '-an',
        '-rtsp_transport', 'tcp',// '-use_wallclock_as_timestamps', '1',
        '-i', path,
        //'-copytb', '1',
        '-preset', 'ultrafast',
        '-an',
        '-c:v', 'copy',
        '-maxrate', '500k',
        '-f', 'mp4',
        '-movflags', '+frag_keyframe+empty_moov+default_base_moof',
        'pipe:1'
    ])

ffmpeg.stderr.setEncoding('utf8');
ffmpeg.stderr.on('data', (data) => {
    console.log(data)
})

module.exports.sendStream = function (req, res) {

    res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Connection': 'Keep-Alive',
        'Content-Type': 'video/mp4'
    })

    ffmpeg.stdout.pipe(res)

}