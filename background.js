chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getMeetTabs") {
        chrome.tabs.query({ url: "*://meet.google.com/*" }, (tabs) => {
            sendResponse({ tabs });
        });
        return true;
    }
});
