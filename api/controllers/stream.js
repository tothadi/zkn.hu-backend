Stream = require('node-rtsp-stream')
stream = new Stream({
  name: 'rdf-cam',
  streamUrl: process.env.StreamURI,
  wsPort: process.env.CAMPORT,
  width: 1280,
  height: 720
})