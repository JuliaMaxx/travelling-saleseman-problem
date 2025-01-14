from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import random

app = Flask(__name__)
socketio = SocketIO(app)

@app.route('/')
def home():
    return render_template('index.html')

# Event to send points from backend to frontend
@socketio.on('get_points')
def handle_points(data):
    num_points = data['numPoints']
    points = [{'x': random.randint(50, 1150), 'y': random.randint(50, 650)} for _ in range(num_points)]
    emit('receive_points', {'points': points})

if __name__ == '__main__':
    app.run(debug=True)