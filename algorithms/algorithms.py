import math
import eventlet

class StopAlgorithmException(Exception):
    pass

# Calculate distance between two points
def distance_between(x1, x2, y1, y2):
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 3)

# Calculate fitness of a given solution
def fitness(solution, session):
    total_distance = 0
    if len(solution) > 1:
        for i in range(len(solution) - 1):
            # Pause / Resume / Stop
            if session['stop_event'].is_set():
                raise StopAlgorithmException()
            while not session['pause_event'].is_set():
                eventlet.sleep(0.1)
            
            # Calculate INDEXES
            current_index = solution[i]
            next_index = solution[i + 1]
            
            # Calculate Distance
            distance = distance_between(
                session['points'][current_index]['x'], session['points'][next_index]['x'],
                session['points'][current_index]['y'], session['points'][next_index]['y']
            )
            total_distance += distance
    return round(total_distance, 3)

# Custom sleep function that can be interupted
def interruptible_sleep(seconds, session):
    interval = 0.01  # Check every 10ms
    waited = 0.0
    while waited < seconds:
        if session['stop_event'].is_set():
            return
        while not session['pause_event'].is_set():
            eventlet.sleep(0.1)
        eventlet.sleep(interval)
        waited += interval
