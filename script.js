//navbar
$("nav ul a").on("click", function() {
    var position = $(this).parent().position();
    var width = $(this).width();
    $("nav ul .slide1").css({opacity: 1, left: +position.left, width: width});

});
$("nav ul a").on("mouseover", function() {
    var position = $(this).parent().position();
    var width = $(this).parent().width();
    $("nav ul .slide2").css({opacity: 1, left: +position.left, width: width}).addClass("squeeze");

});

$("nav ul a").on("mouseout", function() {
    $("nav ul .slide2").css({opacity: 0}).removeClass("squeeze");
});

var currentWidth = $("nav ul li:nth-of-type(3) a").parent().width();
var current = $("li:nth-of-type(3) a").position();
$("nav ul .slide1").css({left: +current.left, width: currentWidth});

//background
const background = document.querySelector(".background");
document.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (scrollY !== 0) {
        background.style.backgroundPosition = `calc(50% + ${scrollY}px) center`; // Use backticks here
    } else {
        background.style.backgroundPosition = '';
    }
}); 

//blogs
var swiper = new Swiper('.blog-slider', {
    spaceBetween: 30,
    effect: 'fade',
    loop: true,
    mousewheel: {
        invert: false,
    },
    pagination: {
        el: '.blog-slider_pagination',
        clickable: true,
    },
});

// Highlight items animation
const highlightItems = document.querySelectorAll('.highlight-item');

const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

highlightItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(item);
});

document.querySelectorAll(".box").forEach((box) => {
    box.addEventListener("mousemove", (e) => {
        let x = e.pagex - box.offsetleft;
        let y = e.pageY - box.offsetTop;
        
        document.querySelectorAll("span").forEach((ele) => {
            ele.style.left = x + 'px';
            ele.style.top = y + 'px';
        })
    })
});
//login
document.addEventListener("DOMContentLoaded", () => {
    const loginModal = document.getElementById("loginModal");
    const loginForm = document.getElementById("loginForm");
    const registerModal = document.getElementById("registerModal");
    const registerForm = document.getElementById("registerForm");
    const showRegister = document.getElementById("showRegister");
    const forgotPassword = document.getElementById("forgotPassword");
    const logoutButton = document.getElementById("logoutButton");

    const isLoggedIn = localStorage.getItem("loggedIn");

    // Show login modal if not logged in
    if (!isLoggedIn) {
        loginModal.style.display = "block";
        document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
        logoutButton.style.display = "block"; // Show logout button if logged in
    }

    // Login functionality
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");

        if (username === storedUsername && password === storedPassword) {
            localStorage.setItem("loggedIn", "true");
            alert("Login successful!");
            loginModal.style.display = "none";
            document.body.style.overflow = ""; // Enable scrolling
            logoutButton.style.display = "block"; // Show logout button after login
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });

    // Show register modal
    showRegister.addEventListener("click", () => {
        loginModal.style.display = "none";
        registerModal.style.display = "block";
    });

    // Register functionality
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const newUsername = document.getElementById("newUsername").value;
        const newPassword = document.getElementById("newPassword").value;

        localStorage.setItem("username", newUsername);
        localStorage.setItem("password", newPassword);

        alert("Account created successfully! You can now log in.");
        registerModal.style.display = "none";
        loginModal.style.display = "block";
    });

    // Forgot Password functionality
    forgotPassword.addEventListener("click", () => {
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");

        if (storedUsername && storedPassword) {
            alert(`Your username is "${storedUsername}". Hint: Your password starts with "${storedPassword.charAt(0)}".`);
        } else {
            alert("No account found. Please create one first.");
        }
    });

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("loggedIn");
            alert("You have been logged out.");
            location.reload(); // Reload the page to reflect logout
        });
    }
});

//blog comments
// Get elements
const commentInput = document.getElementById("comment-input");
const submitCommentBtn = document.getElementById("submit-comment");
const commentList = document.getElementById("comment-list");

// Define a unique key for this page
const pageKey = `comments_${window.location.pathname}`;

// Load existing comments for this page from localStorage
const comments = JSON.parse(localStorage.getItem(pageKey)) || [];
comments.forEach((comment, index) => {
    displayComment(comment.text, comment.timestamp, index);
});

// Add a new comment
submitCommentBtn.addEventListener("click", () => {
    const comment = commentInput.value.trim();
    if (comment) {
        const timestamp = formatDate(new Date()); // Get the formatted timestamp
        const newComment = { text: comment, timestamp: timestamp };

        comments.push(newComment); // Add the new comment with timestamp
        localStorage.setItem(pageKey, JSON.stringify(comments)); // Save comments to localStorage with pageKey
        displayComment(comment, timestamp, comments.length - 1); // Display the new comment
        commentInput.value = ""; // Clear the input field
    }
});

// Function to display a comment
function displayComment(commentText, timestamp, index) {
    const li = document.createElement("li");
    li.setAttribute("data-index", index);

    li.innerHTML = `
        <strong>${commentText}</strong> 
        <span class="timestamp">(${timestamp})</span>
        <button class="delete-btn">Delete</button>
    `;

    // Attach delete functionality to the delete button
    li.querySelector(".delete-btn").addEventListener("click", () => {
        deleteComment(index);
    });

    commentList.appendChild(li);
}

// Function to delete a comment
function deleteComment(index) {
    comments.splice(index, 1); // Remove the comment from the array
    localStorage.setItem(pageKey, JSON.stringify(comments)); // Update localStorage
    renderComments(); // Re-render the comments
}

// Function to re-render comments after a deletion
function renderComments() {
    commentList.innerHTML = ""; // Clear existing comments
    comments.forEach((comment, index) => {
        displayComment(comment.text, comment.timestamp, index);
    });
}

// Function to format the date as dd/mm/yyyy
function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-indexed, so add 1) and pad
    const year = date.getFullYear(); // Get year
    const time = date.toLocaleTimeString(); // Get localized time
    return `${day}/${month}/${year} ${time}`; // Combine in dd/mm/yyyy hh:mm:ss format
}

//contact me
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Simulate sending email
        formStatus.textContent = 'Sending email...';
        formStatus.className = 'sending';
        formStatus.style.display = 'block';

        // Simulate a delay
        setTimeout(function() {
            // Simulate successful sending
            formStatus.textContent = 'Email sent successfully!';
            formStatus.className = 'success';

            // Reset form
            contactForm.reset();

            // Hide the status message after 3 seconds
            setTimeout(function() {
                formStatus.style.display = 'none';
            }, 3000);
        }, 2000);
    });
});
document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Display a pop-up message
    alert('Email sent successfully!');

    // Clear the form fields
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('message').value = '';
});
