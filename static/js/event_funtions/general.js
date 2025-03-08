import { config } from "../config.js";
import { 
    toggleManualButtonText, removeAllCirles, removeAllPaths, toggleButtonState, toggleCursor, getRandomHSL, toggleControls, resetAllText, toggleElementDisplay } from "../utils.js";
import { 
    pointRange, algorithmSelect, playBtn, pointCount, speedRange, speedCount, distance, averageCheck, geneticOptions, randomOptions } from "../dom.js";
import { socket } from "../socket.js";
import { emitGetPoints } from "../socket.js";

export function manualSelection() {
    if (!config.isSelecting){
        config.points = []
        toggleManualButtonText(false);
        removeAllCirles();
        removeAllPaths();
        [pointRange, algorithmSelect, playBtn].forEach(el => toggleButtonState(el, true));
        toggleCursor(true);
        config.isSelecting = true;
    }
    else {
        if (config.points.length < 1){
            emitGetPoints(config.numPoints, false);
            config.isSelecting = false;
        }
        else{
            emitGetPoints(config.numPoints, true);
        }
        toggleManualButtonText(true);
        toggleCursor(false);
        let play = config.algorithmSet? false: true;
        toggleControls(play, true, true);
        [pointRange, algorithmSelect].forEach(el => toggleButtonState(el, false));
        config.isSelecting = false;
    }
}

export function colorRangeInput(){
    const paths = document.querySelectorAll('path:not(.calc)');
    paths.forEach(path => {
        path.style.fill = getRandomHSL();
    });
}

export function pointRangeInput(){
    pointCount.textContent = pointRange.value;
    config.numPoints = parseInt(pointRange.value);

    // Send request to backend for new points
    emitGetPoints(config.numPoints, false);
}

export function speedRangeInput(){
    const delay = speedRange.value/100;
    socket.emit('update_delay', {delay: delay});
    speedCount.textContent = speedRange.value;
}

export function algorithmSelectChange(){
    config.algorithmSet = true;
    toggleControls(false, true, true);
    resetAllText();
    if (algorithmSelect.value === "random") {
        toggleElementDisplay(randomOptions, true);
        if (!averageCheck.checked){
            toggleControls(false, true, true);
        }
        // hide genetic algorithm options
        toggleElementDisplay(geneticOptions, false);
        distance.textContent = `Distance: 0`
        averageCheck.checked = false;
    }
    else if (algorithmSelect.value === "genetic"){
        toggleElementDisplay(geneticOptions, true);
        // hide random algorithm options
        toggleElementDisplay(randomOptions, false);
    } 
    else {
        distance.textContent = `Distance: 0`
        toggleElementDisplay(geneticOptions, false);
        toggleElementDisplay(randomOptions, false);
    }
}

export function updateRangeBackground(rangeInput) {
    const value = rangeInput.value;
    const percentage = ((value - rangeInput.min) / (rangeInput.max - rangeInput.min)) * 100;
    rangeInput.style.setProperty('--value', `${percentage}%`);
}