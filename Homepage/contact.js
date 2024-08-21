document.getElementById('sendButton').addEventListener('click', function() {
    var email = document.getElementById('emailText').value;
    var message = document.getElementById('messageText').value;
    var deployment = 'https://script.google.com/macros/s/AKfycbwOs1Uwwacd7cgXICnnCflACI1UDx-e4o8Ib_wPhTsFucUSAZ430E2J9JUxnSCuJl9G/exec';

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

    var data = {
        email: email,
        message: message
    };

    fetch(deployment, { // Replace with your Google Apps Script URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: email,
            message: message
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Message sent successfully!');
        } else {
            alert('Error sending message.');
        }
    })
    .catch(error => {
        alert('Error sending message: ' + error.message);
    });
});
