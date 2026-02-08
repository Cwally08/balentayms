if (!sessionStorage.getItem('isLoggedIn')) {
    window.location.href = 'index.html';
}

const noBtn = document.getElementById('noBtn');
const heartsContainer = document.getElementById("floatingHearts");
const mainGif = document.getElementById('mainGif');

let gifTimeout = null;
setInterval(() => {
    const heart = document.createElement("span");
    heart.textContent = ["💖","💕","❤️","💘"][Math.floor(Math.random()*4)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 4 + Math.random() * 3 + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 7000);
}, 500);

function breakNoButton() {

    // change cat gif to angry cat for 3 seconds
    if (mainGif) {
        mainGif.src = "../images/catfu.gif";

        clearTimeout(gifTimeout);
        gifTimeout = setTimeout(() => {
            mainGif.src = "../images/cat.gif";
        }, 3000);
    }

    const rect = noBtn.getBoundingClientRect();
    const numPieces = 6; // how many pieces it will break into

    // Create pieces
    for (let i = 0; i < numPieces; i++) {
        const piece = document.createElement('div');
        piece.textContent = noBtn.textContent;
        piece.style.position = 'absolute';
        piece.style.left = rect.left + 'px';
        piece.style.top = rect.top + 'px';
        piece.style.width = rect.width / 2 + 'px';
        piece.style.height = rect.height / 2 + 'px';
        piece.style.background = '#f44336';
        piece.style.color = 'white';
        piece.style.border = '2px solid #333';
        piece.style.borderRadius = '6px';
        piece.style.display = 'flex';
        piece.style.alignItems = 'center';
        piece.style.justifyContent = 'center';
        piece.style.fontWeight = 'bold';
        piece.style.fontFamily = "'Arial Black', sans-serif";
        piece.style.zIndex = 999;
        piece.style.pointerEvents = 'none';
        document.body.appendChild(piece);

        // Animate piece flying in random direction
        const xMove = (Math.random() - 0.5) * 200; // horizontal
        const yMove = (Math.random() - 0.5) * 200; // vertical
        const rotate = (Math.random() - 0.5) * 720; // rotation

        piece.animate([
            { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
            { transform: `translate(${xMove}px, ${yMove}px) rotate(${rotate}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 500,
            easing: 'ease-out',
            fill: 'forwards'
        });

        // Remove piece after animation
        setTimeout(() => piece.remove(), 1500);
    }

    // Remove the original button
    noBtn.remove();
}

// Click / touch events
noBtn.addEventListener('click', breakNoButton);
noBtn.addEventListener('touchstart', function(e){
    e.preventDefault();
    breakNoButton();
});

function handleYes() {
    // Show success overlay
    const overlay = document.getElementById('successOverlay');
    overlay.style.display = 'flex';
    
    // Add celebration effect
    createHearts();
    
    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = '../game/game.html';
    }, 2000);
}

// Create floating hearts animation
function createHearts() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.textContent = '❤️';
            heart.style.position = 'fixed';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '100%';
            heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
            heart.style.zIndex = '9999';
            heart.style.pointerEvents = 'none';
            heart.style.animation = `floatUp ${Math.random() * 2 + 3}s ease-in forwards`;
            document.body.appendChild(heart);
            
            setTimeout(() => heart.remove(), 5000);
        }, i * 100);
    }
}