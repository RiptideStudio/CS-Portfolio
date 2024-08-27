document.getElementById('okButton').addEventListener('click', function() 
{
    // disable the overlay and our button
    var overlay = document.getElementById("overlay");
    var okButton = document.getElementById("okButton");
    var overlayText = document.getElementById("overlayText");

    overlay.classList.remove('active');
    okButton.classList.remove('active');
    overlayText.classList.remove('active');
});

document.getElementById('sendButton').addEventListener('click', function() {
    var email = document.getElementById('emailText').value;
    var message = document.getElementById('messageText').value;
    var name = document.getElementById('nameText').value;
    var subject = document.getElementById('subjectText').value;

    // trigger our overlay
    var overlay = document.getElementById("overlay");
    var okButton = document.getElementById("okButton");
    var overlayText = document.getElementById("overlayText");
    overlay.classList.add('active');
    okButton.classList.add('active');
    overlayText.classList.add('active');

    // Rate limiter using localStorage
    const maxRequests = 5; // Maximum allowed requests
    const windowMs = 15 * 60 * 1000; // 15 minutes in milliseconds
    const now = Date.now();

    // Retrieve the submission history from localStorage
    let submissionHistory = JSON.parse(localStorage.getItem('submissionHistory')) || [];

    // Filter out submissions that are older than the window
    submissionHistory = submissionHistory.filter(timestamp => now - timestamp < windowMs);

    if (submissionHistory.length >= maxRequests) {
        overlayText.textContent = "Too many requests. Try again later!";
        return;
    }

    // Regular expression to validate email format
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!message) {
        // set the overlay text for bad message or email
        overlayText.textContent = "Please enter a valid message.";
        return;
    }

    if (!emailRegex.test(email) || !email) {
        // you entered an invalid email
        overlayText.textContent = "Please enter a valid email address.";
        return;
    }

    var templateParams = {
        email: email,
        message: message,
        reply_to: email,
        subject: subject,
        from_name: name
    };
    
    overlayText.textContent = "Waiting...";

    emailjs.send('service_zutcgda', 'template_nylct2n', templateParams)
    .then(function(response) {
        // message was sent succesfully
        submissionHistory.push(now);
        localStorage.setItem('submissionHistory', JSON.stringify(submissionHistory));
        overlayText.textContent = "Message delivered!";
    }, function(error) {
        alert('Failed to send message: ' + error.text);
        overlayText.textContent = "Failed to send message. Bad connection?";
    });
});


