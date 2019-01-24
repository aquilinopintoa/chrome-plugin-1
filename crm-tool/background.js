// REGISTER EVENTS TO COMUNICATION WITH CONTENT-SCRIPT AND BROWSER
var token = null
console.log('una vez')
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            cmd: 'toggleSidebar'
        });
    });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.tabs.sendMessage(tabId, {
        cmd: 'urlChange',
        change: changeInfo
    });
});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    switch (msg.cmd) {
        case 'getHTML':
            sendResponse(document.getElementById('crm-tool')
                .innerHTML.trim());
            break;
        case 'getToken':
            sendResponse(token);
            break;
        case 'setToken':
            token = msg.token;
            break;
        default:
            console.log('CRM ATE :: ORDER NOT FOUND')
    }
});
