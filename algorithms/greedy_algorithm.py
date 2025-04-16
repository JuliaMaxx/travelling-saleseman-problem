import time
import config
from algorithms.algorithms import fitness, StopAlgorithmException, distance_between, interruptible_sleep

# Greedy algorithm to find a solution starting from a specific point
def greedy_solution(starting_point, socketio, additional, session):
    remaining_indexes = list(range(len(session['points'])))
    solution = [starting_point]
    
    while len(remaining_indexes) > 1:
        remaining_indexes.remove(starting_point)
        shortest_distance = float('inf')
        next_city = -1
        
        # Pause / Resume / Stop
        if session['stop_event'].is_set():
            if additional:
                raise StopAlgorithmException()
            return
        session['pause_event'].wait()
            
        
        for i in remaining_indexes:
            
            # Pause / Resume / Stop
            if session['stop_event'].is_set():
                if additional:
                    raise StopAlgorithmException()
                return
            session['pause_event'].wait()
            
            distance = distance_between(
                session['points'][i]['x'], session['points'][starting_point]['x'],
                session['points'][i]['y'], session['points'][starting_point]['y']
            )
            if distance < shortest_distance:
                shortest_distance = distance
                next_city = i
            if not session['stop_event'].is_set():
                socketio.emit('update_distance', {'distance': round(distance * 10, 3)}, to=session['sid'])    
        
        solution.append(next_city)
        starting_point = next_city
        
        interruptible_sleep(session['visualization_delay'], session)
        
        # Pause / Resume / Stop
        if session['stop_event'].is_set():
            if additional:
                    raise StopAlgorithmException()
            return
        session['pause_event'].wait()
        
        if not session['stop_event'].is_set():
            # Emit the current state of the solution to the frontend
            socketio.emit('update_lines', {'solution': solution, 'points': session['points']}, to=session['sid'])
        # Sleep for a short amount of time to visualize the progress
        interruptible_sleep(session['visualization_delay'], session)  
        
    solution.append(solution[0])
    if not session['stop_event'].is_set():
        socketio.emit('update_lines', {'solution': solution, 'points': session['points'], 'type': 'best'}, to=session['sid'])
        distance = fitness(solution, session)
        socketio.emit('update_distance', {'distance': round(distance * 10, 3)}, to=session['sid'])    
    if not additional:
        socketio.emit('algorithm_finished', {}, to=session['sid'])   
    return solution

