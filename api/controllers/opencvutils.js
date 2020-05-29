const path = require('path');

const cv = require('opencv4nodejs');

exports.cv = cv;

const grabFrames = (videoFile, delay, onFrame) => {
    const cap = new cv.VideoCapture(videoFile)
    cap.set(cv.CAP_PROP_FRAME_WIDTH, 1280);
    cap.set(cv.CAP_PROP_FRAME_HEIGHT, 720);
    let done = false;
    const intvl = setInterval(() => {
        let frame = cap.read();
        // loop back to start on end of stream reached
        if (frame.empty) {
            cap.reset();
            frame = cap.read();
        }
        onFrame(frame);

        const key = cv.waitKey(delay);
        done = key !== -1 && key !== 255;
        if (done) {
            clearInterval(intvl);
            console.log('Key pressed, exiting.');
        }
    }, 0);
};
exports.grabFrames = grabFrames;

exports.runVideoDetection = (src, detect) => {
    grabFrames(src, 10, frame => {
        detect(frame)
    });
};

exports.drawRectAroundBlobs = (binaryImg, dstImg, minPxSize, maxPxSize, fixedRectWidth) => {
    const {
        centroids,
        stats
    } = binaryImg.connectedComponentsWithStats();

    // pretend label 0 is background
    for (let label = 1; label < centroids.rows; label += 1) {
        const [x1, y1] = [stats.at(label, cv.CC_STAT_LEFT), stats.at(label, cv.CC_STAT_TOP)];
        const [x2, y2] = [
            x1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_WIDTH)),
            y1 + (fixedRectWidth || stats.at(label, cv.CC_STAT_HEIGHT))
        ];
        const size = stats.at(label, cv.CC_STAT_AREA);
        const blue = new cv.Vec(255, 0, 0);
        if (minPxSize < size && maxPxSize > size) {
            const topLeft = new cv.Point(x1, y1)
            const bottomRight = new cv.Point(x2, y2)
            const rect = new cv.Rect(x1, y1, x2 - x1, y2 - y1)
            dstImg.drawRectangle(
                topLeft,
                bottomRight,
                { color: blue, thickness: 2 }
            );
            const region = dstImg.getRegion(rect)
            detect(region, size)
        }
    }
};

const drawRect = (image, rect, color, opts = { thickness: 2 }) =>
    image.drawRectangle(
        rect,
        color,
        opts.thickness,
        cv.LINE_8
    );

exports.drawRect = drawRect;
exports.drawBlueRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec(255, 0, 0), opts);
exports.drawGreenRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec(0, 255, 0), opts);
exports.drawRedRect = (image, rect, opts = { thickness: 2 }) =>
    drawRect(image, rect, new cv.Vec(0, 0, 255), opts);