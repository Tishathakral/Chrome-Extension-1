// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "toggleMic") {
        toggleMicState(sendResponse);
        return true; // Keep the message channel open for async response
    }
});

// Function to check if the mic is muted
function isMicMuted() {
    const micButton = document.querySelector("[aria-label*='microphone']");
    return micButton ? micButton.getAttribute("data-is-muted") === "true" : null;
}

// Function to toggle mic state
function toggleMicState(sendResponse) {
    const micButton = document.querySelector("[aria-label*='microphone']");
    
    if (micButton) {
        micButton.click();
        
        setTimeout(() => {
            const micStatus = isMicMuted() ? "muted" : "unmuted";
            sendResponse({ status: micStatus });
        }, 500);
    } else {
        sendResponse({ status: "unknown" });
    }
}
