import eventlet
eventlet.monkey_patch()

import random
import config
import threading
from flask import Flask, render_template, request
from flask_socketio import SocketIO, emit
from algorithms.greedy_algorithm import greedy_solution
from algorithms.random_algorithm import random_solution, average_of_random
from algorithms.genetic_algorithm import genetic_solution

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="https://travelling-saleseman-problem.onrender.com", async_mode="eventlet")

user_sessions = {}

@socketio.on('connect')
def handle_connect():
    sid = request.sid
    user_sessions[sid] = {
        'points': [],
        'pause_event': threading.Event(),
        'stop_event': threading.Event(),
        'visualization_delay': 0.01
    }
    user_sessions[sid]['pause_event'].set()
    print(f'Client connected: {sid}')

@socketio.on('disconnect')
def handle_disconnect():
    sid = request.sid
    user_sessions.pop(sid, None)
    print(f'Client disconnected: {sid}')


@app.route('/')
def home():
    return render_template('index.html')


# Event to send points from backend to frontend
@socketio.on('get_points')
def handle_points(data):
    sid = request.sid
    session = user_sessions[sid]
    
    manual = data['manual']
    num_points = data['numPoints']
    x_min = data['xMin']
    x_max = data['xMax']
    y_max = data['yMax']
    y_min = data['yMin']
    
    if not manual:
        session['points'] = [{'x': random.randint(x_min, x_max), 'y': random.randint(y_min, y_max)} for _ in range(num_points)]
        emit('receive_points', {'points': session['points']})
    else:
        session['points']= num_points
        
    
# Event to start the selected algorithm
@socketio.on('start_algorithm')
def start_algorithm(data):
    sid = request.sid
    session = user_sessions[sid]
    # Reset control flags
    session['stop_event'].clear()
    session['pause_event'].set()
    algorithm = data['algorithm']
    # Greedy
    if algorithm == 'greedy':
        greedy_solution(0, socketio, False, session)
    # Random
    elif algorithm == 'random':
        average_num = data['averageNum']
        if average_num == 1:
            random_solution(socketio, session)
        else:
            threading.Thread(target=average_of_random, args=(average_num, socketio, session), daemon=True).start()
    # Genetic        
    elif algorithm == "genetic":
        genetic_solution(
            data['populationSize'],
            data['greedyRatio'],
            data['crossover'],
            data['epochNum'],
            data['mutation'],
            data['mutationProbability'],
            data['selection'],
            data['tournamentSize'],
            data['elite'],
            data['eliteSize'], socketio, session)    

# Event to pause the algorithm 
@socketio.on('pause_algorithm')
def pause_algorithm(data):
    sid = request.sid
    session = user_sessions[sid]
    session['pause_event'].clear()
   
# Event to resume the algorithm 
@socketio.on('resume_algorithm')
def resume_algorithm(data):
    sid = request.sid
    session = user_sessions[sid]
    session['pause_event'].set()   

# Event to stop the algorithm 
@socketio.on('stop_algorithm')
def stop_algorithm(data):
    sid = request.sid
    session = user_sessions[sid]
    session['pause_event'].set()   
    session['stop_event'].set()     
        
# Event to update delay
@socketio.on('update_delay')
def update_delay(data):
    sid = request.sid
    session = user_sessions[sid]
    session['visualization_delay'] = float(data['delay']) + 0.001

if __name__ == '__main__':
    app.run()