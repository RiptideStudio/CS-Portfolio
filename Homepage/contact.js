document.getElementById('sendButton').addEventListener('click', function() {

    var email = document.getElementById('emailText').value;
    var message = document.getElementById('messageText').value;

    if (!email || !message) {
        alert('Please enter a valid name and email.');
        return;
    }

    var data = {
        email: email,
        message: message
    };

    fetch('/send-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Message sent successfully!');
        } else {
            alert('Error sending message: ' + data.error);
        }
    })
    .catch(error => {
        alert('Error sending message: ' + error.message);
    });
});