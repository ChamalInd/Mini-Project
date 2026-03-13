// Focus Mode Standalone Logic
document.addEventListener('DOMContentLoaded', function() {
    // Check if we are on the focus mode page
    if (!document.getElementById('minutes')) return;

    // --- Timer Logic ---
    let timer;
    let timeLeft = 25 * 60;
    let isPaused = true;

    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const startTimerBtn = document.getElementById('startTimer');
    const pauseTimerBtn = document.getElementById('pauseTimer');
    const resetTimerBtn = document.getElementById('resetTimer');
    const modeBtns = document.querySelectorAll('.mode-btn');

    function updateTimerDisplay() {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        minutesDisplay.textContent = mins.toString().padStart(2, '0');
        secondsDisplay.textContent = secs.toString().padStart(2, '0');
    }

    function startTimer() {
        if (!isPaused) return;
        isPaused = false;
        timer = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('Time is up!');
                resetTimer();
            }
        }, 1000);
    }

    function pauseTimer() {
        isPaused = true;
        clearInterval(timer);
    }

    function resetTimer() {
        pauseTimer();
        const activeMode = document.querySelector('.mode-btn.active');
        timeLeft = parseInt(activeMode.dataset.time) * 60;
        updateTimerDisplay();
    }

    startTimerBtn.addEventListener('click', startTimer);
    pauseTimerBtn.addEventListener('click', pauseTimer);
    resetTimerBtn.addEventListener('click', resetTimer);

    modeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            timeLeft = parseInt(btn.dataset.time) * 60;
            updateTimerDisplay();
            pauseTimer();
        });
    });

    // Initialize display
    updateTimerDisplay();

    // --- Music Player Logic ---
    const focusAudio = document.getElementById('focusAudio');
    const playPauseTrack = document.getElementById('playPauseTrack');
    const volumeSlider = document.getElementById('volumeSlider');
    const noiseBtns = document.querySelectorAll('.noise-btn');
    const trackTitle = document.getElementById('trackTitle');
    const trackArtist = document.getElementById('trackArtist');
    const currentCover = document.getElementById('currentCover');
    const musicUpload = document.getElementById('musicUpload');
    const uploadBtn = document.getElementById('uploadBtn');

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

        noiseBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                noiseBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                focusAudio.src = btn.dataset.sound;
                trackTitle.textContent = btn.dataset.title;
                trackArtist.textContent = 'Ambient Sounds';
                currentCover.src = btn.dataset.cover;
                
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
