import { config } from "./config.js";
import { elapsedTime } from "./dom.js";

export function startTimer() {   
    if (config.intervalId === null) {
        config.intervalId = setInterval(() => {
            if (!config.isPaused) { // Update only if not paused
                config.elapsedTimeInSeconds++;
                elapsedTime.textContent = `Elapsed: ${config.elapsedTimeInSeconds}`;
            }
        }, 1000);
    }
}

export function stopTimer() {
    config.elapsedTimeInSeconds = 0;
    clearInterval(config.intervalId);
    config.intervalId = null;
}