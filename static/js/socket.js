import {
    bestDistance, worseDistance, averageDistance,
    epoch, distance, pointRange, manual, algorithmSelect } from "./dom.js";
import { updateLines, updatePoints } from "./canvas.js";
import { toggleButtonState, toggleControls, togglePlayButtonText } from "./utils.js";
import { config } from "./config.js";
import { stopTimer } from "./timer.js";
import { getValidRange } from "./event_funtions/map.js";
import { toggleAlgorithmOptions } from "./utils.js";
    
export const socket = io({ transports: ['websocket'], forceNew: true });

export function setUpSocketEvents(){
    if (socket.connected) {
        socket.disconnect();  // Close any existing socket
    }

    socket.connect();
    
    // Handle the points data from the backend
    socket.on('receive_points', function(data) {
        config.points = data.points;
        updatePoints();
    });
    
    // Display information about the epoch
    socket.on('update_info', function(data) {
        bestDistance.textContent = `Best distance: ${data['best']}km`
        worseDistance.textContent = `Worse distance: ${data['worse']}km`
        averageDistance.textContent = `Average distance: ${data['average']}km`
        epoch.textContent = `Epoch ${data['epoch']}`
    });
    
    // Display distance in genetic and random solutions
    socket.on('update_distance', function(data) {
        distance.textContent = `Distance: ${data['distance']}km`
    });
    
    // Display distance in genetic and random solutions
    socket.on('update_average_distance', function(data) {
        distance.textContent = `Average Distance: ${data['distance']}km`
    });
    
    // Handle backend sending updates on algorithm progress
    socket.on('update_lines', function(data) {
        const solution = data.solution;
        const points = data.points
        const type = data.type
        updateLines(solution, points, type);
    });
    
    socket.on('algorithm_finished', function(data) {
        // Stop the algorithm
        socket.emit('stop_algorithm', {});
        toggleControls(false, true, true);
        toggleAlgorithmOptions(algorithmSelect.value, false);
        stopTimer(config.intervalId);
        togglePlayButtonText(false);
        [pointRange, manual, algorithmSelect].forEach(el => toggleButtonState(el, false));
    });
}

export function emitGetPoints(numPoints, manual){
    const validRange = getValidRange();
    socket.emit('get_points', { 
        numPoints: numPoints,
        manual: manual,
        xMax: validRange.xMax,
        xMin: validRange.xMin,
        yMax: validRange.yMax,
        yMin: validRange.yMin
    });
}