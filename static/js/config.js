function getExactPathBounds() {
    const paths = Array.from(document.querySelectorAll('path[id]'));

    let xMin = Infinity, yMin = Infinity;
    let xMax = -Infinity, yMax = -Infinity;

    paths.forEach(path => {
        const bbox = path.getBBox();
        xMin = Math.min(xMin, bbox.x);
        yMin = Math.min(yMin, bbox.y);
        xMax = Math.max(xMax, bbox.x + bbox.width);
        yMax = Math.max(yMax, bbox.y + bbox.height);
    });

    return {
        xMin,
        xMax,
        yMin,
        yMax,
        width: xMax - xMin,
        height: yMax - yMin
    };
}

export const config = {
    bounds: getExactPathBounds(),
    MAX_POINTS: 200,
    numPoints: parseInt(pointRange.value),
    points: [],
    isPaused: false,
    isSelecting: false,
    algorithmSet: false,
    elapsedTimeInSeconds: 0,
    intervalId: null
} 