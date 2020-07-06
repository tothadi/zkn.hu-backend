const child_process = require('child_process'),
    path = process.env.StreamURI,//'./cars.mp4'//
    ffmpeg = child_process.spawn('ffmpeg', [
        '-reorder_queue_size', '5', '-rtsp_transport', 'tcp',
        '-i', path, '-framerate', '25',
        '-an', '-c:v', 'copy', '-f', 'mp4', '-movflags', '+frag_keyframe+empty_moov+default_base_moof+igndts', '-metadata', 'title="media source extensions"', 'pipe:1'
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