import random
from algorithms.algorithms import fitness, interruptible_sleep
import eventlet

# Random solution
def random_solution(socketio, session):
    solution = list(range(len(session['points'])))
    random.shuffle(solution)
    # Wait if paused
    while not session['pause_event'].is_set():
        eventlet.sleep(0.1)
    # Ensure the solution returns to the starting city
    solution.append(solution[0])
        
    interruptible_sleep(session['visualization_delay'], session)
    if not session['stop_event'].is_set():
        socketio.emit('update_lines', {'solution': solution, 'points': session['points']}, to=session['sid'])
        distance = fitness(solution, session)
        socketio.emit('update_distance', {'distance': round(distance * 10, 3)}, to=session['sid'])  
    return solution

# Average of random solutions
def average_of_random(amount, socketio, session):
    total = 0
    for _ in range(amount):
        # Pause / Resume / Stop
        if session['stop_event'].is_set():
            return
        while not session['pause_event'].is_set():
            eventlet.sleep(0.1)
        
        interruptible_sleep(session['visualization_delay'], session)
        solution = random_solution(socketio, session)   
        total += fitness(solution, session)         
    socketio.emit('algorithm_finished', {}, to=session['sid'])
    average = round(total / amount, 3)
    socketio.emit('update_average_distance', {'distance': round(average * 10, 3)}, to=session['sid'])     
    return average