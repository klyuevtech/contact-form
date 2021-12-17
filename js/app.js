import Form from './form.js'

class App {
    constructor() {
        const formSelector = '#contact_form';
        const onSubmitHandler = this.onSubmitHandler.bind(this);

        const formOptions = {
            formSelector,
            onSubmitHandler
        }

        this.form = new Form(formOptions);

        return this;
    }

    onSubmitHandler(event) {
        event.preventDefault();

        if (this.form.isValid()) {
            const formData = this.form.getData();
            this.form.shade();
            this.postData('mailer.php', formData)
                .then(data => {
                    if (data.result) {
                        this.topMessage('Your question has been sent!');
                    } else {
                        this.topMessage(`Sorry, we couldn't send your message.`);
                    }
                }).catch(error=>console.error(`Couldn't send the form. Error: ${error}`))
                .finally(() => this.form.unShade());

        } else {
            this.form.markInvalidFields();
            this.topMessage('Please check the input data.');
            return false;
        }
    }

    async postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        
        return response.json(); // parses JSON response into native JavaScript objects
    }

    topMessage(messageText) {
        const messageContainer = document.getElementById('top_message');
        messageContainer.innerHTML = messageText;
        messageContainer.style.opacity = 1;

        (new Promise((resolve, reject) => {
            setTimeout(() => {
                messageContainer.style.opacity = 0;
                resolve();
            }, 5000);
        })).then((value) => {
            setTimeout(() => {
                messageContainer.innerHTML = '';
            }, 1000);
        });
    }
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
      return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

document.addEventListener('DOMContentLoaded', function() {
    window && (window.contactFormApp = new App());
})
