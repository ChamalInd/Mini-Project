// Focus Mode Standalone Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on the focus mode page
    if (!document.getElementById('minutes')) return;

    // --- Timer Logic ---
    let timer;
    let totalTime = 25 * 60;
    let timeLeft  = 25 * 60;
    let isRunning = false;

    const minutesDisplay  = document.getElementById('minutes');
    const secondsDisplay  = document.getElementById('seconds');
    const playBtn         = document.getElementById('startTimer');
    const resetBtn        = document.getElementById('resetTimer');
    const playIcon        = document.getElementById('playIcon');
    const pauseIcon       = document.getElementById('pauseIcon');
    const stateLabel      = document.getElementById('timerStateLabel');
    const ringProgress    = document.getElementById('ringProgress');
    const modeBtns        = document.querySelectorAll('.mode-btn');

    // SVG ring circumference: 2π × r96 ≈ 603.2
    const CIRCUM = 2 * Math.PI * 96;

    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        minutesDisplay.textContent = mins.toString().padStart(2, '0');
        secondsDisplay.textContent = secs.toString().padStart(2, '0');
        // ring: offset = circum × (1 - progress)
        const progress = totalTime > 0 ? timeLeft / totalTime : 1;
        ringProgress.style.strokeDashoffset = (CIRCUM * (1 - progress)).toFixed(2);
    }

    function setPlayState(running) {
        isRunning = running;
        playIcon.style.display  = running ? 'none'  : 'block';
        pauseIcon.style.display = running ? 'block' : 'none';
        stateLabel.textContent  = running ? 'Focusing' : (timeLeft === totalTime ? 'Ready' : 'Paused');
    }

    function startTimer() {
        if (isRunning) return;
        setPlayState(true);
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                setPlayState(false);
                stateLabel.textContent = 'Done!';
                // subtle notification instead of blocking alert
                if ('Notification' in window && Notification.permission === 'granted') {
                    new Notification('Time is up! Take a break.');
                } else {
                    playBtn.style.animation = 'pulse-btn 0.4s ease 3';
                    setTimeout(() => playBtn.style.animation = '', 1500);
                }
            }
        }, 1000);
    }

    function pauseTimer() {
        if (!isRunning) return;
        clearInterval(timer);
        setPlayState(false);
    }

    function resetTimer() {
        clearInterval(timer);
        setPlayState(false);
        const activeMode = document.querySelector('.mode-btn.active');
        totalTime = parseInt(activeMode.dataset.time) * 60;
        timeLeft  = totalTime;
        stateLabel.textContent = 'Ready';
        updateTimerDisplay();
    }

    // Single play/pause button
    playBtn.addEventListener('click', () => {
        isRunning ? pauseTimer() : startTimer();
    });
    resetBtn.addEventListener('click', resetTimer);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            totalTime = parseInt(btn.dataset.time) * 60;
            timeLeft  = totalTime;
            clearInterval(timer);
            setPlayState(false);
            stateLabel.textContent = 'Ready';
            updateTimerDisplay();
        });
    });

    // Initialize
    updateTimerDisplay();
    setPlayState(false);

    // --- Music Player Logic ---
    const focusAudio = document.getElementById('focusAudio');
    const playPauseTrack = document.getElementById('playPauseTrack');
    const volumeSlider = document.getElementById('volumeSlider');
    const seekBar = document.getElementById('seekBar');
    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const noiseBtns = document.querySelectorAll('.noise-btn');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const currentCover = document.getElementById('currentCover');
    const musicUpload = document.getElementById('musicUpload');
    const uploadBtn = document.getElementById('uploadBtn');

    function formatTime(s) {
        if(isNaN(s)) return '0:00';
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return m + ':' + String(sec).padStart(2, '0');
    }

    function updateSeekBar() {
        if(!focusAudio.duration) return;
        const pct = (focusAudio.currentTime / focusAudio.duration) * 100;
        seekBar.value = pct;
        // filled track colour
        seekBar.style.background =
            `linear-gradient(to right, #6366f1 ${pct}%, rgba(255,255,255,0.12) ${pct}%)`;
        currentTimeEl.textContent = formatTime(focusAudio.currentTime);
    }

    if (focusAudio) {
        // Set initial source
        focusAudio.src = noiseBtns[0].dataset.sound;
        focusAudio.volume = volumeSlider.value;

        playPauseTrack.addEventListener('click', () => {
            if (focusAudio.paused) {
                focusAudio.play();
                playPauseTrack.textContent = '⏸';
            } else {
                focusAudio.pause();
                playPauseTrack.textContent = '▶';
            }
        });

        volumeSlider.addEventListener('input', () => {
            focusAudio.volume = volumeSlider.value;
        });

        // Seek bar — update as audio plays
        focusAudio.addEventListener('timeupdate', updateSeekBar);

        // When metadata loads, set total duration
        focusAudio.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(focusAudio.duration);
            seekBar.style.background = 'rgba(255,255,255,0.12)';
            seekBar.value = 0;
            currentTimeEl.textContent = '0:00';
        });

        // For looping ambient sounds with no duration, hide seek bar gracefully
        focusAudio.addEventListener('durationchange', () => {
            const hasDuration = isFinite(focusAudio.duration) && focusAudio.duration > 0;
            seekBar.style.opacity = hasDuration ? '1' : '0.3';
            seekBar.style.pointerEvents = hasDuration ? 'auto' : 'none';
            totalTimeEl.textContent = hasDuration ? formatTime(focusAudio.duration) : '∞';
        });

        // Scrubbing
        let isScrubbing = false;
        seekBar.addEventListener('mousedown', () => { isScrubbing = true; });
        seekBar.addEventListener('input', () => {
            if(!focusAudio.duration) return;
            const t = (seekBar.value / 100) * focusAudio.duration;
            currentTimeEl.textContent = formatTime(t);
            // live preview fill while scrubbing
            seekBar.style.background =
                `linear-gradient(to right, #6366f1 ${seekBar.value}%, rgba(255,255,255,0.12) ${seekBar.value}%)`;
        });
        seekBar.addEventListener('change', () => {
            if(!focusAudio.duration) return;
            focusAudio.currentTime = (seekBar.value / 100) * focusAudio.duration;
            isScrubbing = false;
        });

        noiseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                noiseBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                focusAudio.src = btn.dataset.sound;
                trackTitle.textContent = btn.dataset.title;
                trackArtist.textContent = 'Ambient Sounds';
                currentCover.src = btn.dataset.cover;
                seekBar.value = 0;
                currentTimeEl.textContent = '0:00';
                totalTimeEl.textContent = '0:00';
                
                if (!focusAudio.paused || playPauseTrack.textContent === '⏸') {
                    focusAudio.play();
                }
            });
        });

        // Custom Music Upload
        uploadBtn.addEventListener('click', () => {
            musicUpload.click();
        });

        musicUpload.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const url = URL.createObjectURL(file);
                focusAudio.src = url;
                trackTitle.textContent = file.name;
                trackArtist.textContent = 'Local File';
                currentCover.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop';
                seekBar.value = 0;
                currentTimeEl.textContent = '0:00';
                totalTimeEl.textContent = '0:00';
                
                focusAudio.play();
                playPauseTrack.textContent = '⏸';
                
                noiseBtns.forEach(b => b.classList.remove('active'));
            }
        });

        // Prev/Next (Cycle through noise options)
        const prevBtn = document.getElementById('prevTrack');
        const nextBtn = document.getElementById('nextTrack');

        function cycleTrack(direction) {
            let currentIndex = Array.from(noiseBtns).findIndex(btn => btn.classList.contains('active'));
            if (currentIndex === -1) currentIndex = 0;

            let nextIndex = (currentIndex + direction + noiseBtns.length) % noiseBtns.length;
            noiseBtns[nextIndex].click();
        }

        prevBtn.addEventListener('click', () => cycleTrack(-1));
        nextBtn.addEventListener('click', () => cycleTrack(1));
    }
});
