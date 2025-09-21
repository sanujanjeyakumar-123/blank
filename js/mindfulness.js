// Mindfulness page functionality

let breathingInterval;
let isBreathing = false;
let meditationTimer;
let meditationTimeLeft = 0;
let isMeditating = false;
let currentSound = null;
let currentAudio = null;
let breathingStartTime = null;

function initializeMindfulnessPage() {
    const breathingStart = document.getElementById('breathing-start');
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');
    
    const meditationStart = document.getElementById('meditation-start');
    const meditationPause = document.getElementById('meditation-pause');
    const meditationReset = document.getElementById('meditation-reset');
    const meditationTime = document.getElementById('meditation-time');
    const presetBtns = document.querySelectorAll('.preset-btn');
    
    const soundPlay = document.getElementById('sound-play');
    const soundStop = document.getElementById('sound-stop');
    const soundBtns = document.querySelectorAll('.sound-btn');

    // Breathing exercise
    if (breathingStart && breathingCircle && breathingText) {
        breathingStart.addEventListener('click', () => {
            if (!isBreathing) {
                startBreathingExercise();
                breathingStart.textContent = 'Stop Breathing';
            } else {
                stopBreathingExercise();
                breathingStart.textContent = 'Start Breathing';
            }
        });
    }

    // Meditation timer
    if (meditationStart && meditationTime) {
        let selectedMinutes = 5;

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectedMinutes = parseInt(btn.dataset.minutes);
                meditationTimeLeft = selectedMinutes * 60;
                meditationTime.textContent = formatTime(meditationTimeLeft);
            });
        });

        // Set default
        meditationTimeLeft = selectedMinutes * 60;
        meditationTime.textContent = formatTime(meditationTimeLeft);

        meditationStart.addEventListener('click', () => {
            if (!isMeditating) {
                startMeditationTimer();
            }
        });

        if (meditationPause) {
            meditationPause.addEventListener('click', () => {
                if (isMeditating) {
                    pauseMeditationTimer();
                } else {
                    resumeMeditationTimer();
                }
            });
        }

        if (meditationReset) {
            meditationReset.addEventListener('click', () => {
                resetMeditationTimer();
            });
        }
    }

    // Ambient sounds
    if (soundBtns.length > 0) {
        soundBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                soundBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentSound = btn.dataset.sound;
            });
        });

        if (soundPlay) {
            soundPlay.addEventListener('click', () => {
                if (currentSound) {
                    playAmbientSound(currentSound);
                }
            });
        }

        if (soundStop) {
            soundStop.addEventListener('click', () => {
                stopAmbientSound();
            });
        }
    }

    // Load and display progress stats
    updateProgressStats();
}

function startBreathingExercise() {
    if (isBreathing) return;
    
    isBreathing = true;
    breathingStartTime = Date.now();
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');
    
    let isInhaling = true;
    
    function breathingCycle() {
        if (!isBreathing) return;
        
        if (isInhaling) {
            breathingCircle.classList.remove('exhale');
            breathingCircle.classList.add('inhale');
            breathingText.textContent = 'Inhale';
        } else {
            breathingCircle.classList.remove('inhale');
            breathingCircle.classList.add('exhale');
            breathingText.textContent = 'Exhale';
        }
        
        isInhaling = !isInhaling;
    }
    
    breathingCycle();
    breathingInterval = setInterval(breathingCycle, 4000);
}

function stopBreathingExercise() {
    isBreathing = false;
    if (breathingInterval) {
        clearInterval(breathingInterval);
        breathingInterval = null;
    }
    
    const breathingCircle = document.getElementById('breathing-circle');
    const breathingText = document.getElementById('breathing-text');
    
    if (breathingCircle && breathingText) {
        breathingCircle.classList.remove('inhale', 'exhale');
        breathingText.textContent = 'Breathe';
    }
    
    // Save breathing session if it ran for at least 30 seconds
    if (breathingStartTime && (Date.now() - breathingStartTime) > 30000) {
        saveBreathingSession();
    }
}

function startMeditationTimer() {
    if (isMeditating) return;
    
    isMeditating = true;
    const meditationStart = document.getElementById('meditation-start');
    const meditationPause = document.getElementById('meditation-pause');
    const meditationTime = document.getElementById('meditation-time');
    
    if (meditationStart) meditationStart.style.display = 'none';
    if (meditationPause) meditationPause.style.display = 'inline-block';
    
    meditationTimer = setInterval(() => {
        if (meditationTimeLeft <= 0) {
            completeMeditationSession();
            return;
        }
        
        meditationTimeLeft--;
        if (meditationTime) {
            meditationTime.textContent = formatTime(meditationTimeLeft);
        }
    }, 1000);
}

function pauseMeditationTimer() {
    if (meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
    }
    
    const meditationPause = document.getElementById('meditation-pause');
    if (meditationPause) {
        meditationPause.textContent = 'Resume';
    }
}

function resumeMeditationTimer() {
    startMeditationTimer();
    const meditationPause = document.getElementById('meditation-pause');
    if (meditationPause) {
        meditationPause.textContent = 'Pause';
    }
}

function resetMeditationTimer() {
    if (meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
    }
    
    isMeditating = false;
    const activePreset = document.querySelector('.preset-btn.active');
    const minutes = activePreset ? parseInt(activePreset.dataset.minutes) : 5;
    meditationTimeLeft = minutes * 60;
    
    const meditationTime = document.getElementById('meditation-time');
    const meditationStart = document.getElementById('meditation-start');
    const meditationPause = document.getElementById('meditation-pause');
    
    if (meditationTime) meditationTime.textContent = formatTime(meditationTimeLeft);
    if (meditationStart) meditationStart.style.display = 'inline-block';
    if (meditationPause) {
        meditationPause.style.display = 'none';
        meditationPause.textContent = 'Pause';
    }
}

function completeMeditationSession() {
    resetMeditationTimer();
    
    // Save session to localStorage
    const sessions = getFromLocalStorage('meditation-sessions', []);
    const activePreset = document.querySelector('.preset-btn.active');
    const minutes = activePreset ? parseInt(activePreset.dataset.minutes) : 5;
    
    sessions.push({
        date: new Date().toISOString(),
        duration: minutes
    });
    
    saveToLocalStorage('meditation-sessions', sessions);
    updateProgressStats();
    
    alert('Meditation session completed! Great job!');
}

function saveBreathingSession() {
    const sessions = getFromLocalStorage('meditation-sessions', []);
    sessions.push({
        date: new Date().toISOString(),
        duration: 2, // 2 minutes for breathing exercise
        type: 'breathing'
    });
    saveToLocalStorage('meditation-sessions', sessions);
    updateProgressStats();
}

function playAmbientSound(soundName) {
    stopAmbientSound();
    
    currentAudio = new Audio(`sounds/${soundName}.mp3`);
    currentAudio.loop = true;
    currentAudio.volume = 0.3; // Set moderate volume like workout music
    
    currentAudio.play().catch(error => {
        console.error('Error playing sound:', error);
    });
}

function stopAmbientSound() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0; // Reset to beginning
        currentAudio = null;
    }
}

function updateProgressStats() {
    const sessions = getFromLocalStorage('meditation-sessions', []);
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    
    // Calculate streak
    let streak = 0;
    if (sessions.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // Group sessions by date
        const sessionsByDate = {};
        sessions.forEach(session => {
            const sessionDate = new Date(session.date);
            sessionDate.setHours(0, 0, 0, 0);
            const dateKey = sessionDate.toDateString();
            sessionsByDate[dateKey] = true;
        });
        
        // Calculate consecutive days
        let currentDate = new Date(today);
        while (sessionsByDate[currentDate.toDateString()]) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        }
    }
    
    const totalSessionsEl = document.getElementById('total-sessions');
    const totalMinutesEl = document.getElementById('total-minutes');
    const streakDaysEl = document.getElementById('streak-days');
    
    if (totalSessionsEl) totalSessionsEl.textContent = totalSessions;
    if (totalMinutesEl) totalMinutesEl.textContent = totalMinutes;
    if (streakDaysEl) streakDaysEl.textContent = streak;
}

// Initialize mindfulness page when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMindfulnessPage);

// Cleanup intervals when page unloads
window.addEventListener('beforeunload', () => {
    if (breathingInterval) clearInterval(breathingInterval);
    if (meditationTimer) clearInterval(meditationTimer);
    if (currentAudio) currentAudio.pause();
});