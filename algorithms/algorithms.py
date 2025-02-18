import math
import config

class StopAlgorithmException(Exception):
    pass

# Calculate distance between two points
def distance_between(x1, x2, y1, y2):
    return round(math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), 3)

# Calculate fitness of a given solution
def fitness(solution):
    total_distance = 0
    if len(solution) > 1:
        for i in range(len(solution) - 1):
            # Pause / Resume / Stop
            if config.stop_event.is_set():
                raise StopAlgorithmException()
            config.pause_event.wait()
            
            # Calculate INDEXES
            current_index = solution[i]
            next_index = solution[i + 1]
            
            # Calculate Distance
            distance = distance_between(
                config.POINTS[current_index]['x'], config.POINTS[next_index]['x'],
                config.POINTS[current_index]['y'], config.POINTS[next_index]['y']
            )
            total_distance += distance
    return round(total_distance, 3)