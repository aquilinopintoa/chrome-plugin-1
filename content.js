// THIS FILE IS EXEC INTO ACTIVE PAGE
var CRMbaseUrl = 'https://crm.atedev.co.uk';
var injected = false;

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
    alert('data sended')
}
