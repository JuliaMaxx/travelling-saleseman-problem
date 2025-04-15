import time
import random
import config
from algorithms.algorithms import fitness, interruptible_sleep

# Random solution
def random_solution(socketio, session):
    solution = list(range(len(session['points'])))
    random.shuffle(solution)
    # Wait if paused
    session['pause_event'].wait()
    # Ensure the solution returns to the starting city
    solution.append(solution[0])
        
    interruptible_sleep(session['visualization_delay'], session)
    if not session['stop_event'].is_set():
        socketio.emit('update_lines', {'solution': solution, 'points': session['points']})
        distance = fitness(solution, session)
        socketio.emit('update_distance', {'distance': round(distance * 10, 3)})  
    return solution

# Average of random solutions
def average_of_random(amount, socketio, session):
    total = 0
    for _ in range(amount):
        # Pause / Resume / Stop
        if session['stop_event'].is_set():
            return
        session['pause_event'].wait()
        
        interruptible_sleep(session['visualization_delay'], session)
        solution = random_solution(socketio)   
        total += fitness(solution, session)         
    socketio.emit('algorithm_finished', {})
    average = round(total / amount, 3)
    socketio.emit('update_average_distance', {'distance': round(average * 10, 3)})     
    return average