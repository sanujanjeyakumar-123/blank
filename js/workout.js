// Workout page functionality

let workoutData = {};
let currentWorkout = [];
let currentExerciseIndex = 0;
let workoutTimer;
let workoutTimeLeft = 0;
let isWorkoutRunning = false;
let workoutAudio = null;
let currentTrackIndex = 0;
const musicTracks = [
    'sounds/track1.mp3',
    'sounds/track2.mp3',
    'sounds/track3.mp3',
    'sounds/track4.mp3',
    'sounds/track5.mp3',
    'sounds/track6.mp3'
];

// Load workout data
async function loadWorkoutData() {
    try {
        const response = await fetch('data/workouts.json');
        workoutData = await response.json();
    } catch (error) {
        console.error('Error loading workout data:', error);
        // Fallback to inline data
        initializeWithFallbackWorkoutData();
    }
}

// Fallback workout data
function initializeWithFallbackWorkoutData() {
    workoutData = {
        'full-body': {
            'none': [
                { name: 'Push-ups', duration: 45, rest: 15 },
                { name: 'Squats', duration: 45, rest: 15 },
                { name: 'Plank', duration: 30, rest: 15 },
                { name: 'Jumping Jacks', duration: 45, rest: 15 },
                { name: 'Burpees', duration: 30, rest: 15 },
                { name: 'Mountain Climbers', duration: 45, rest: 15 }
            ],
            'dumbbells': [
                { name: 'Dumbbell Squats', duration: 45, rest: 15 },
                { name: 'Dumbbell Press', duration: 45, rest: 15 },
                { name: 'Dumbbell Rows', duration: 45, rest: 15 },
                { name: 'Dumbbell Lunges', duration: 45, rest: 15 },
                { name: 'Dumbbell Deadlifts', duration: 45, rest: 15 },
                { name: 'Dumbbell Thrusters', duration: 45, rest: 15 }
            ]
        },
        'upper-body': {
            'none': [
                { name: 'Push-ups', duration: 45, rest: 15 },
                { name: 'Pike Push-ups', duration: 30, rest: 15 },
                { name: 'Tricep Dips', duration: 45, rest: 15 },
                { name: 'Plank to T', duration: 45, rest: 15 },
                { name: 'Diamond Push-ups', duration: 30, rest: 15 }
            ],
            'dumbbells': [
                { name: 'Dumbbell Press', duration: 45, rest: 15 },
                { name: 'Dumbbell Rows', duration: 45, rest: 15 },
                { name: 'Dumbbell Flyes', duration: 45, rest: 15 },
                { name: 'Bicep Curls', duration: 45, rest: 15 },
                { name: 'Overhead Press', duration: 45, rest: 15 }
            ]
        },
        'lower-body': {
            'none': [
                { name: 'Squats', duration: 45, rest: 15 },
                { name: 'Lunges', duration: 45, rest: 15 },
                { name: 'Glute Bridges', duration: 45, rest: 15 },
                { name: 'Calf Raises', duration: 45, rest: 15 },
                { name: 'Wall Sit', duration: 30, rest: 15 }
            ],
            'dumbbells': [
                { name: 'Dumbbell Squats', duration: 45, rest: 15 },
                { name: 'Dumbbell Lunges', duration: 45, rest: 15 },
                { name: 'Dumbbell Deadlifts', duration: 45, rest: 15 },
                { name: 'Dumbbell Step-ups', duration: 45, rest: 15 },
                { name: 'Dumbbell Calf Raises', duration: 45, rest: 15 }
            ]
        },
        'core': {
            'none': [
                { name: 'Plank', duration: 30, rest: 15 },
                { name: 'Crunches', duration: 45, rest: 15 },
                { name: 'Russian Twists', duration: 45, rest: 15 },
                { name: 'Leg Raises', duration: 45, rest: 15 },
                { name: 'Bicycle Crunches', duration: 45, rest: 15 }
            ]
        },
        'cardio': {
            'none': [
                { name: 'Jumping Jacks', duration: 45, rest: 15 },
                { name: 'High Knees', duration: 45, rest: 15 },
                { name: 'Burpees', duration: 30, rest: 15 },
                { name: 'Mountain Climbers', duration: 45, rest: 15 },
                { name: 'Jump Squats', duration: 45, rest: 15 }
            ]
        }
    };
}

function initializeWorkoutPage() {
    const generateBtn = document.getElementById('generate-workout');
    const workoutPlan = document.getElementById('workout-plan');
    const workoutExercises = document.getElementById('workout-exercises');

    if (!generateBtn) return;

    // Load workout data
    loadWorkoutData();

    generateBtn.addEventListener('click', () => {
        const bodyPart = document.getElementById('body-part').value;
        const equipment = document.getElementById('equipment').value;

        // Get workout exercises
        const exercises = workoutData[bodyPart] && workoutData[bodyPart][equipment] 
            ? workoutData[bodyPart][equipment] 
            : workoutData[bodyPart]['none'] || workoutData['full-body']['none'];

        currentWorkout = [...exercises];
        currentExerciseIndex = 0;

        // Display workout
        workoutExercises.innerHTML = currentWorkout.map((exercise, index) => `
            <div class="exercise-item">
                <div>
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-details">${exercise.duration}s work, ${exercise.rest}s rest</div>
                </div>
                <button class="btn btn-primary start-exercise-btn" data-exercise-index="${index}">Start</button>
            </div>
        `).join('');

        // Add event listeners to start buttons
        workoutExercises.querySelectorAll('.start-exercise-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseIndex = parseInt(e.target.dataset.exerciseIndex);
                startExerciseTimer(exerciseIndex);
            });
        });

        workoutPlan.style.display = 'block';
    });
}

function startExerciseTimer(exerciseIndex) {
    if (isWorkoutRunning) return;

    currentExerciseIndex = exerciseIndex;
    const exercise = currentWorkout[currentExerciseIndex];
    const simpleTimer = document.getElementById('simple-timer');
    const currentExercise = document.getElementById('current-exercise');
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    const timerPause = document.getElementById('timer-pause');
    const timerStop = document.getElementById('timer-stop');
    const timerNext = document.getElementById('timer-next');
    
    // Show and setup timer
    simpleTimer.style.display = 'block';
    currentExercise.textContent = exercise.name;

    let isResting = false;
    workoutTimeLeft = exercise.duration;
    isWorkoutRunning = true;
    
    // Start music
    playWorkoutMusic();

    function updateTimer() {
        const minutes = Math.floor(workoutTimeLeft / 60);
        const seconds = workoutTimeLeft % 60;
        timerMinutes.textContent = minutes.toString().padStart(2, '0');
        timerSeconds.textContent = seconds.toString().padStart(2, '0');
        
        if (workoutTimeLeft <= 0) {
            if (!isResting) {
                // Switch to rest period
                isResting = true;
                workoutTimeLeft = exercise.rest;
                currentExercise.textContent = 'Rest';
            } else {
                // Exercise complete
                stopWorkoutTimer();
                stopWorkoutMusic();
                simpleTimer.style.display = 'none';
                return;
            }
        } else {
            workoutTimeLeft--;
        }
    }

    workoutTimer = setInterval(updateTimer, 1000);
    updateTimer();

    // Remove any existing event listeners to prevent duplicates
    const newTimerPause = timerPause.cloneNode(true);
    const newTimerStop = timerStop.cloneNode(true);
    const newTimerNext = timerNext.cloneNode(true);
    
    timerPause.parentNode.replaceChild(newTimerPause, timerPause);
    timerStop.parentNode.replaceChild(newTimerStop, timerStop);
    timerNext.parentNode.replaceChild(newTimerNext, timerNext);
    // Timer event listeners
    newTimerPause.addEventListener('click', () => {
        if (isWorkoutRunning) {
            clearInterval(workoutTimer);
            isWorkoutRunning = false;
            newTimerPause.textContent = 'Resume';
            pauseWorkoutMusic();
        } else {
            workoutTimer = setInterval(updateTimer, 1000);
            isWorkoutRunning = true;
            newTimerPause.textContent = 'Pause';
            resumeWorkoutMusic();
        }
    });

    newTimerStop.addEventListener('click', () => {
        stopWorkoutTimer();
        stopWorkoutMusic();
        simpleTimer.style.display = 'none';
        newTimerPause.textContent = 'Pause';
    });

    newTimerNext.addEventListener('click', () => {
        stopWorkoutTimer();
        stopWorkoutMusic();
        simpleTimer.style.display = 'none';
        newTimerPause.textContent = 'Pause';
        if (currentExerciseIndex < currentWorkout.length - 1) {
            startExerciseTimer(currentExerciseIndex + 1);
        }
    });
}

function stopWorkoutTimer() {
    if (workoutTimer) {
        clearInterval(workoutTimer);
        workoutTimer = null;
    }
    isWorkoutRunning = false;
    workoutTimeLeft = 0;
}

function playWorkoutMusic() {
    stopWorkoutMusic(); // Stop any existing music
    
    // Select random track
    currentTrackIndex = Math.floor(Math.random() * musicTracks.length);
    
    workoutAudio = new Audio(musicTracks[currentTrackIndex]);
    workoutAudio.loop = true;
    workoutAudio.volume = 0.3; // Set moderate volume
    
    workoutAudio.play().catch(error => {
        console.error('Error playing workout music:', error);
    });
}

function pauseWorkoutMusic() {
    if (workoutAudio && !workoutAudio.paused) {
        workoutAudio.pause();
    }
}

function resumeWorkoutMusic() {
    if (workoutAudio && workoutAudio.paused) {
        workoutAudio.play().catch(error => {
            console.error('Error resuming workout music:', error);
        });
    }
}

function stopWorkoutMusic() {
    if (workoutAudio) {
        workoutAudio.pause();
        workoutAudio.currentTime = 0; // Reset to beginning
        workoutAudio = null;
    }
}

// Initialize workout page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeWorkoutPage);

// Cleanup intervals when page unloads
window.addEventListener('beforeunload', () => {
    if (workoutTimer) clearInterval(workoutTimer);
    if (workoutAudio) {
        workoutAudio.pause();
        workoutAudio = null;
    }
});