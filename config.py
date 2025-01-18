import threading 

VISUALIZATION_DELAY = 0.01
POINTS = []
pause_event = threading.Event()
stop_event = threading.Event()