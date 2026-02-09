if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

const heartsContainer = document.getElementById("floatingHearts");

setInterval(() => {
    const heart = document.createElement("span");
    heart.textContent = ["💖","💕","❤️","💘"][Math.floor(Math.random()*4)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 4 + Math.random() * 3 + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 7000);
}, 500);

const puzzles = [
    {
        word: "GORGEOUS",
        letters: ["G","U","N","O","E","T","S","R","A","G","O","K"],
        images: [
            "../images/gorg5.jpeg",
            "../images/gorg2.jpg",
            "../images/gorg3.jpg",
            "../images/gorg4.jpg"
        ],
        quote: "That’s you — not just today, not just sometimes, but every single day. 💗"
    },
    {
        word: "FUTURE",
        letters: ["F","H","T","B","R","E","A","U","C","D","G","U"],
        images: [
            "../images/future1.webp",
            "../images/future3.jpg",
            "../images/future4.jpg",
            "../images/future2.jpg"
        ],
        quote: "Staring at you… makes me catch a glimpse of our future together. 💫"
    },
    {
        word: "RADIANCE",
        letters: ["R","A","A","D","Y","I","N","M","C","T","E","K"],
        images: [
            "../images/radiance1.jpg",
            "../images/radiance2.jpg",
            "../images/radiance3.jpg",
            "../images/radiance4.jpg"
        ],
        quote: "That’s you — making every moment brighter and every day sweeter. 🌟"
    }
];

let currentPuzzleIndex = 0;
let currentAnswer = [];
let usedLetterIndices = [];
let correctWord = "";
let letters = [];
let musicPlaying = false;
let typeTimer = null;

function showQuote(text) {
    const overlay = document.getElementById("quoteOverlay");
    const el = document.getElementById("quoteText");

    overlay.style.display = "flex";

    // reset
    el.textContent = "";
    el.style.visibility = "visible";

    if (typeTimer) {
        clearInterval(typeTimer);
    }

    let i = 0;
    const speed = 35; // ms per character

    typeTimer = setInterval(() => {
        el.textContent += text.charAt(i);
        i++;

        if (i >= text.length) {
            clearInterval(typeTimer);
            typeTimer = null;
        }
    }, speed);
}

function init() {
    loadPuzzle(currentPuzzleIndex);
    // Autoplay music when page loads
    autoplayMusic();
}

// Autoplay music function
function autoplayMusic() {
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const equalizer = document.getElementById('equalizer');

    const startMusic = () => {
        music.play().then(() => {
            musicPlaying = true;
            musicBtn.classList.add('playing');
            equalizer.classList.add('playing');
        }).catch(() => {});
    };

    // try immediately (will fail on most browsers)
    startMusic();

    // guaranteed fallback – first user interaction
    document.addEventListener('pointerdown', startMusic, { once: true });
}


// Music control with equalizer
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const musicBtn = document.getElementById('musicBtn');
    const equalizer = document.getElementById('equalizer');
    
    if (musicPlaying) {
        music.pause();
        musicBtn.classList.remove('playing');
        equalizer.classList.remove('playing');
        musicPlaying = false;
    } else {
        music.play();
        musicBtn.classList.add('playing');
        equalizer.classList.add('playing');
        musicPlaying = true;
    }
}

function loadPuzzle(index) {
    const puzzle = puzzles[index];
    const imagesGrid = document.getElementById('imagesGrid');
    const controls = document.querySelector('.controls');
    
    // Fade out controls
    controls.style.opacity = '0';
    
    // Fade out images
    imagesGrid.style.opacity = '0';
    
    setTimeout(() => {
        correctWord = puzzle.word;
        letters = puzzle.letters;
        currentAnswer = [];
        usedLetterIndices = [];
        
        document.getElementById('puzzleCounter').textContent = `Puzzle ${index + 1} of 3`;
        
        // Load images
        for (let i = 1; i <= 4; i++) {
            document.getElementById(`img${i}`).src = puzzle.images[i - 1];
        }
        
        document.getElementById('message').textContent = '';
        document.getElementById('message').className = 'message';
        
        renderAnswerSlots();
        renderLetterPool();
        
        // Fade in images
        setTimeout(() => {
            imagesGrid.style.opacity = '1';
        }, 50);
        
        // Fade in controls with delay
        setTimeout(() => {
            controls.style.opacity = '1';
            
            // Re-trigger button animations
            const buttons = controls.querySelectorAll('.control-btn');
            buttons.forEach(btn => {
                btn.style.animation = 'none';
                setTimeout(() => {
                    btn.style.animation = '';
                }, 10);
            });
        }, 400);
    }, 300);
}

function shuffleLetters() {
    const container = document.getElementById('letterPool');
    const buttons = Array.from(container.children);

    // Fisher–Yates shuffle
    for (let i = buttons.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    }

    // Re-append in new order
    buttons.forEach(btn => container.appendChild(btn));
}

function renderAnswerSlots() {
    const container = document.getElementById('answerBoxes');
    container.innerHTML = '';
    for (let i = 0; i < correctWord.length; i++) {
        const slot = document.createElement('div');
        slot.className = 'answer-slot';
        slot.id = `slot-${i}`;
        container.appendChild(slot);
    }
}

function renderLetterPool() {
    const container = document.getElementById('letterPool');
    container.innerHTML = '';
    letters.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.className = 'letter-btn';
        btn.textContent = letter;
        btn.id = `letter-${index}`;
        btn.onclick = () => selectLetter(letter, index);
        container.appendChild(btn);
    });
}

function selectLetter(letter, index) {
    if (currentAnswer.length < correctWord.length && !usedLetterIndices.includes(index)) {
        currentAnswer.push(letter);
        usedLetterIndices.push(index);
        
        const slot = document.getElementById(`slot-${currentAnswer.length - 1}`);
        slot.textContent = letter;
        slot.classList.add('filled');
        
        const btn = document.getElementById(`letter-${index}`);
        btn.classList.add('used');
    }
}

function submitAnswer() {
    if (currentAnswer.length !== correctWord.length) {
        const messageDiv = document.getElementById('message');
        messageDiv.textContent = '⚠️ Complete the word first!';
        messageDiv.className = 'message wrong';
        setTimeout(() => {
            messageDiv.textContent = '';
            messageDiv.className = 'message';
        }, 1500);
        return;
    }
    
    checkAnswer();
}

function checkAnswer() {
    const messageDiv = document.getElementById('message');
    if (currentAnswer.join('') === correctWord) {
        messageDiv.textContent = '🎉 Correct!';
        messageDiv.className = 'message correct';
        
        // Show quote modal after 1 second
        setTimeout(() => {
            showQuoteModal();
        }, 1000);
    } else {
        messageDiv.textContent = '❌ Try Again!';
        messageDiv.className = 'message wrong';
        setTimeout(clearAnswer, 1500);
    }
}

function showQuoteModal() {
    showQuote(puzzles[currentPuzzleIndex].quote);
}

function continueToNextPuzzle() {
    const overlay = document.getElementById('quoteOverlay');
    
    // Fade out the quote overlay
    overlay.style.opacity = '0';
    
    setTimeout(() => {
        overlay.style.display = 'none';
        overlay.style.opacity = '1'; // Reset for next time
        
        currentPuzzleIndex++;
        
        if (currentPuzzleIndex < puzzles.length) {
            loadPuzzle(currentPuzzleIndex);
        } else {
            // Game completed! Redirect or show final message
            showFinalMessage();
        }
    }, 300);
}

let finalTypeTimer = null;

function showFinalMessage() {
    const container = document.querySelector('.game-container');
    
    // Fade out current content
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        container.innerHTML = `
            <div style="display:flex; flex-direction:column; align-items:center; justify-content:flex-start; padding:20px; gap:20px; height:100%; opacity:0; transform:translateY(20px); transition:all 0.5s ease;">
                <!-- GIF at the top with border -->
                <img 
                    src="../images/catflower.gif" 
                    alt="ending gif" 
                    style="width:180px; max-width:80%; border-radius:16px; border:5px solid #000; box-shadow:0 8px 16px rgba(0,0,0,0.3); opacity:0; transform:scale(0.8); transition:all 0.5s ease 0.2s;"
                    id="finalGif"
                >

                <!-- White message container -->
                <div id="finalMessageBox" style="
                    width:100%;
                    max-width:420px;
                    background:#fff;
                    border:5px solid #000;
                    border-radius:18px;
                    padding:25px 20px;
                    box-shadow:0 10px 25px rgba(0,0,0,.25);
                    min-height:220px;
                    display:flex;
                    align-items:center;
                    justify-content:center;
                    opacity:0;
                    transform:translateY(20px);
                    transition:all 0.5s ease 0.4s;
                ">
                    <p id="finalMessageText" style="
                        font-size:20px;
                        line-height:1.7;
                        color:#333;
                        text-align:center;
                        margin:0;
                        font-style:italic;
                    "></p>
                </div>

                <!-- Restart button (hidden initially) -->
                <button id="restartButton" onclick="restartGame()" style="
                    display:none;
                    padding:15px 20px;
                    font-size:20px;
                    font-weight:bold;
                    background:linear-gradient(135deg, #ff6b9d 0%, #c44569 100%);
                    color:white;
                    border:4px solid #000;
                    border-radius:12px;
                    cursor:pointer;
                    box-shadow:0 6px 12px rgba(0,0,0,0.2);
                    transition:all 0.3s ease;
                    font-family: 'Arial Black', sans-serif;
                    margin-top:20px;
                    opacity:0;
                    transform:translateY(10px);
                " onmouseover="this.style.transform='scale(1.05) translateY(10px)'" onmouseout="this.style.transform='scale(1) translateY(10px)'">
                    🔄 Play Again
                </button>
            </div>
        `;
        
        // Fade in container
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
            
            // Trigger animations
            const wrapper = container.firstElementChild;
            const gif = document.getElementById('finalGif');
            const messageBox = document.getElementById('finalMessageBox');
            
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0)';
            gif.style.opacity = '1';
            gif.style.transform = 'scale(1)';
            messageBox.style.opacity = '1';
            messageBox.style.transform = 'translateY(0)';
        }, 50);
        
        const message = 
        `I made this little game for you…
        but honestly,
        you're the only one I want to win with in real life.

        Looking at you, I see my future.
        Not just plans, not just dreams,
        but a life I want to build with you.

        Thank you for being my favorite person,
        my safe place,
        and my happiest ending.

        Happy Valentine's Day. I love you. ❤️`;

        const el = document.getElementById("finalMessageText");
        const restartBtn = document.getElementById("restartButton");

        if (finalTypeTimer) clearInterval(finalTypeTimer);

        // Wait for animations to finish before typing
        setTimeout(() => {
            let i = 0;
            el.textContent = "";

            finalTypeTimer = setInterval(() => {
                el.textContent += message.charAt(i);
                i++;

                if (i >= message.length) {
                    clearInterval(finalTypeTimer);
                    finalTypeTimer = null;
                    
                    // Show restart button with animation
                    setTimeout(() => {
                        restartBtn.style.display = "block";
                        setTimeout(() => {
                            restartBtn.style.opacity = "1";
                            restartBtn.style.transform = "translateY(0)";
                        }, 50);
                    }, 500);
                }
            }, 35);
        }, 800); // Wait for fade-in animations
        
    }, 300);
}

function restartGame() {
    const container = document.querySelector('.game-container');
    
    // Fade out before reload
    container.style.opacity = '0';
    container.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        location.reload();
    }, 300);
}


function clearAnswer() {
    currentAnswer = [];
    usedLetterIndices = [];
    
    for (let i = 0; i < correctWord.length; i++) {
        const slot = document.getElementById(`slot-${i}`);
        if (slot) {
            slot.textContent = '';
            slot.classList.remove('filled');
        }
    }
    
    letters.forEach((_, index) => {
        const btn = document.getElementById(`letter-${index}`);
        if (btn) {
            btn.classList.remove('used');
        }
    });
    
    document.getElementById('message').textContent = '';
    document.getElementById('message').className = 'message';
}

function giveHint() {
    if (currentAnswer.length < correctWord.length) {
        const nextIndex = currentAnswer.length;
        const hintLetter = correctWord[nextIndex];
        const availableIndex = letters.findIndex((letter, idx) => 
            letter === hintLetter && !usedLetterIndices.includes(idx)
        );
        
        if (availableIndex !== -1) {
            selectLetter(hintLetter, availableIndex);
        }
    }
}

init();