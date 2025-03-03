import { setUpEventListeners } from "./events.js";
import { setUpSocketEvents } from "./socket.js";
import { resetToInitialState } from "./utils.js";

// Clear everything on page load
window.onload = function() {
    resetToInitialState();
    setUpEventListeners();
    setUpSocketEvents();
};