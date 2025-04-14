import time
import config
from algorithms.algorithms import fitness, StopAlgorithmException, distance_between, interruptible_sleep

# Greedy algorithm to find a solution starting from a specific point
def greedy_solution(starting_point, socketio, additional):
    remaining_indexes = list(range(len(config.POINTS)))
    solution = [starting_point]
    
    while len(remaining_indexes) > 1:
        remaining_indexes.remove(starting_point)
        shortest_distance = float('inf')
        next_city = -1
        
        # Pause / Resume / Stop
        if config.stop_event.is_set():
            if additional:
                raise StopAlgorithmException()
            return
        config.pause_event.wait()
            
        
        for i in remaining_indexes:
            
            # Pause / Resume / Stop
            if config.stop_event.is_set():
                if additional:
                    raise StopAlgorithmException()
                return
            config.pause_event.wait()
            
            distance = distance_between(
                config.POINTS[i]['x'], config.POINTS[starting_point]['x'],
                config.POINTS[i]['y'], config.POINTS[starting_point]['y']
            )
            if distance < shortest_distance:
                shortest_distance = distance
                next_city = i
            if not config.stop_event.is_set():
                socketio.emit('update_distance', {'distance': round(distance * 10, 3)})    
        
        solution.append(next_city)
        starting_point = next_city
        
        interruptible_sleep(config.VISUALIZATION_DELAY)
        
        # Pause / Resume / Stop
        if config.stop_event.is_set():
            if additional:
                    raise StopAlgorithmException()
            return
        config.pause_event.wait()
        
        if not config.stop_event.is_set():
            # Emit the current state of the solution to the frontend
            socketio.emit('update_lines', {'solution': solution, 'points': config.POINTS})
        # Sleep for a short amount of time to visualize the progress
        interruptible_sleep(config.VISUALIZATION_DELAY)  
        
    solution.append(solution[0])
    if not config.stop_event.is_set():
        socketio.emit('update_lines', {'solution': solution, 'points': config.POINTS, 'type': 'best'})
        distance = fitness(solution)
        socketio.emit('update_distance', {'distance': round(distance * 10, 3)})    
    if not additional:
        socketio.emit('algorithm_finished', {})   
    return solution

