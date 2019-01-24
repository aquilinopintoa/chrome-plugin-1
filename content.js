// THIS FILE IS EXEC INTO ACTIVE PAGE
var CRMbaseUrl = 'https://crm.atedev.co.uk';
var injected = false;
var token = null;

chrome.runtime.sendMessage({
    cmd: 'getToken'
}, function (responseToken) {
    token = responseToken
})

// COMUNICATION WITH BACKGROUND 
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.cmd === 'toggleSidebar') {
        if (injected) {
            toggleSidebar();
        } else {
            init(true);
        }
    }
});

// INSERT HTML IN ACTIVE PAGE
function init(open) {
    // Insert HTML into page
    chrome.runtime.sendMessage({
        cmd: 'getHTML'
    }, function(response) {
        var div = document.createElement('div');
        div.id = 'crm-tool';
        div.innerHTML = response;
        document.body.appendChild(div);

        // ADD IMAGES TO HTML
        document.querySelector('.crm-logo')
            .style.backgroundImage = 'url(' + chrome.extension.getURL('logo.png') + ')';

        // ADD LISTENERS TO EVENTS
        document.querySelector('#arrow-toggle')
            .addEventListener('click', closeSidebar);
        document.querySelector('#submit-form-data')
            .addEventListener('click', submitFormData);
        document.querySelector('#submit-form-login')
            .addEventListener('click', login);

        if (!token) {
            showFormLogin();
        }

        if (open) {
            setTimeout(toggleSidebar);
        }

        injected = true;
    });
}

// CRM SIDEBAR CONTROL
var activated = false;

function toggleSidebar() {
    if (!activated) {
        activated = true;
    }
    document.getElementById('crm-tool')
        .classList.add('active');
}

function closeSidebar() {
    document.getElementById('crm-tool')
        .classList.remove('active');
}

// CRM FORM DATA CONTROL
function submitFormData () {
    event.preventDefault();

    var xhr = new XMLHttpRequest();
    const query = "&website=" + document.location.origin
    xhr.open("GET", CRMbaseUrl + "/api/suppliers?page=1&perPage=1" + query);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("authorization-app", token);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200:
                    const response = JSON.parse(xhr.response)
                    console.log(response)
                    break;
                case 400:
                    // showError(
                    //    'That doesn\'t seem right',
                    //    'Please check your username/ password combination.'
                    // );
                    alert('error');
                    break;
                case 500:
                default:
                    alert('error');
                    // showError(
                    //    'Whoops, something went wrong!',
                    //    'Please try again in a minute.'
                    // );
                    break;
            }
        }
    };
    xhr.send();
}

// CRM FORM LOGIN CONTROL
function showFormLogin () {
    document.getElementById('body')
        .classList.add('show-login');
}

function hideFormLogin () {
    document.getElementById('body')
        .classList.remove('show-login');
}

function login () {
    event.preventDefault();
    const email = document.getElementById('crm-user-email-field').value
    const password = document.getElementById('crm-user-password-field').value

    if (!email || !password) {
        alert('Email and password fields are required!')
        return;
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", CRMbaseUrl + "/auth/login");
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            switch (xhr.status) {
                case 200:
                    const response = JSON.parse(xhr.response)
                    chrome.runtime.sendMessage({
                        cmd: 'setToken',
                        token: response.token
                    }, function () {
                        hideFormLogin()
                    })
                    break;
                case 400:
                    // showError(
                    //    'That doesn\'t seem right',
                    //    'Please check your username/ password combination.'
                    // );
                    alert('error');
                    break;
                case 500:
                default:
                    alert('error');
                    // showError(
                    //    'Whoops, something went wrong!',
                    //    'Please try again in a minute.'
                    // );
                    break;
            }
        }
    };
    xhr.send(JSON.stringify({email: email, password: password}));
}
