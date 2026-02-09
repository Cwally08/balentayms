const heartsContainer = document.getElementById("floatingHearts");

setInterval(() => {
    const heart = document.createElement("span");
    heart.textContent = ["💖","💕","❤️","💘"][Math.floor(Math.random()*4)];
    heart.style.left = Math.random() * 100 + "vw";
    heart.style.animationDuration = 4 + Math.random() * 3 + "s";

    heartsContainer.appendChild(heart);

    setTimeout(() => heart.remove(), 7000);
}, 500);

document.addEventListener("DOMContentLoaded", function() {
    const correctUsername = "blackpinakbet"; 
    const correctPassword = "red05012024";    

    const form = document.querySelector(".login form");

    const modal = document.getElementById("wrongModal");
    const closeBtn = modal.querySelector(".close");

    form.addEventListener("submit", function(e) {
        e.preventDefault(); // stop page reload

        const username = document.getElementById("username").value;
        const password = document.querySelector('input[name="password"]').value;

        if(username === correctUsername && password === correctPassword){
            sessionStorage.setItem('isLoggedIn', 'true');
            
            window.location.href = "question/";
        } else {
            modal.style.display = "block";
        }
    });

    // Close modal on clicking X
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Close modal when clicking outside modal content
    window.addEventListener("click", function(e) {
        if(e.target === modal){
            modal.style.display = "none";
        }
    });
});