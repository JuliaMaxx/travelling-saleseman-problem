import { algorithmSelect, averageCheck, pointRange, manual } from "../dom.js";
import { 
    toggleButtonState, removeAllPaths, getAlgorithmParams, toggleControls, togglePlayButtonText, resetAllText } from "../utils.js";
import { startTimer, stopTimer } from "../timer.js";
import { socket } from "../socket.js";
import { config } from "../config.js";

export function playAlgorithm(){
    const selectedAlgorithm = algorithmSelect.value;
    if (selectedAlgorithm !== "random" || averageCheck.checked) {
        [pointRange, manual, algorithmSelect].forEach(el => toggleButtonState(el, true));
        startTimer();
    }

    if (!config.isPaused) {
        removeAllPaths();
        const params = getAlgorithmParams(selectedAlgorithm);

        socket.emit("start_algorithm", {
            algorithm: selectedAlgorithm,
            points: config.numPoints,
            ...params,
        });

        if (selectedAlgorithm === 'random' && !averageCheck.checked){
            toggleControls(false, true, true);
        }
        else
        {
            toggleControls(true, false, false);
        }
    } else {
        // Resume the algorithm when paused
        socket.emit('resume_algorithm', {});
        startTimer();
        toggleControls(true, false, false);
        config.isPaused = false;
    }
}

export function pauseAlgorithm(){
    // Pause the algorithm
    socket.emit('pause_algorithm', {});
    toggleControls(false, true, false);
    config.isPaused = true;
    togglePlayButtonText(config.isPaused);
}

export function stopAlgorithm(){
    // Stop the algorithm
    config.isPaused = false;
    stopTimer(config.intervalId);
    socket.emit('stop_algorithm', {});
    removeAllPaths();
    togglePlayButtonText(config.isPaused);
    [pointRange, manual, algorithmSelect].forEach(el => toggleButtonState(el, false));
    toggleControls(false, true, true);
    resetAllText();
}