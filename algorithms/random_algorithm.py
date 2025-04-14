import time
import random
import config
from algorithms.algorithms import fitness, interruptible_sleep

# Random solution
def random_solution(socketio):
    solution = list(range(len(config.POINTS)))
    random.shuffle(solution)
    # Wait if paused
    config.pause_event.wait()
    # Ensure the solution returns to the starting city
    solution.append(solution[0])
        
    interruptible_sleep(config.VISUALIZATION_DELAY)
    if not config.stop_event.is_set():
        socketio.emit('update_lines', {'solution': solution, 'points': config.POINTS})
        distance = fitness(solution)
        socketio.emit('update_distance', {'distance': round(distance * 10, 3)})  
    return solution

# Average of random solutions
def average_of_random(amount, socketio):
    total = 0
    for _ in range(amount):
        # Pause / Resume / Stop
        if config.stop_event.is_set():
            return
        config.pause_event.wait()
        
        interruptible_sleep(config.VISUALIZATION_DELAY)
        solution = random_solution(socketio)   
        total += fitness(solution)         
    socketio.emit('algorithm_finished', {})
    average = round(total / amount, 3)
    socketio.emit('update_average_distance', {'distance': round(average * 10, 3)})     
    return average