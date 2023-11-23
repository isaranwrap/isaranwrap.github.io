import pyautogui
import time

# Define the interval and duration
interval = 10  # seconds
duration = 4 * 60 * 60  # 4 hours in seconds
repetitions = duration // interval  # Number of times to press the spacebar

# Loop for the required number of repetitions
for __ in range(repetitions):
    pyautogui.press('space')
    time.sleep(interval)
    print("{} seconds elapsed".format(__*interval))

print("Finished pressing the spacebar.")