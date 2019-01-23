// REGISTER EVENTS TO COMUNICATION WITH CONTENT-SCRIPT AND BROWSER

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
    if (msg.cmd === 'getHTML') {
        sendResponse(document.getElementById('crm-tool')
            .innerHTML.trim());
    }
});