document.getElementById('sendButton').addEventListener('click', function() {
    var email = document.getElementById('emailText').value;
    var message = document.getElementById('messageText').value;
    var name = document.getElementById('nameText').value;
    var subject = document.getElementById('subjectText').value;

    // Rate limiter using localStorage
    const maxRequests = 5; // Maximum allowed requests
    const windowMs = 15 * 60 * 1000; // 15 minutes in milliseconds
    const now = Date.now();

    // Retrieve the submission history from localStorage
    let submissionHistory = JSON.parse(localStorage.getItem('submissionHistory')) || [];

    // Filter out submissions that are older than the window
    submissionHistory = submissionHistory.filter(timestamp => now - timestamp < windowMs);

    if (submissionHistory.length >= maxRequests) {
        alert("Too many requests, please try again later.");
        return;
    }

    // Add the current timestamp to the submission history
    submissionHistory.push(now);
    localStorage.setItem('submissionHistory', JSON.stringify(submissionHistory));

    // Regular expression to validate email format
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !message) {
        alert('Please enter a valid email and message.');
        return;
    }

    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    var templateParams = {
        email: email,
        message: message,
        reply_to: email,
        subject: subject,
        from_name: name
    };

    emailjs.send('service_zutcgda', 'template_nylct2n', templateParams)
    .then(function(response) {
        alert('Message sent!');
    }, function(error) {
        alert('Failed to send message: ' + error.text);
    });
});


