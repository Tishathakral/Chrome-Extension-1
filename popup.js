document.addEventListener("DOMContentLoaded", () => {
    const meetingsList = document.getElementById("meetingsList");

    // Notify user to reload the meeting if the extension is refreshed
    chrome.storage.local.get("notified", (data) => {
        if (!data.notified) {
            alert("Please reload your Google Meet tab to apply the changes.");
            chrome.storage.local.set({ notified: true });
        }
    });

    // Fetch all active Google Meet tabs
    chrome.runtime.sendMessage({ action: "getMeetTabs" }, (response) => {
        meetingsList.innerHTML = "";
        if (response.tabs.length === 0) {
            meetingsList.innerHTML = "<p>No active Google Meet found.</p>";
            return;
        }

        response.tabs.forEach((tab) => {
            const meetingItem = document.createElement("div");
            meetingItem.classList.add("meeting-item");

            const title = document.createElement("p");
            title.textContent = tab.title;

            const toggleButton = document.createElement("button");
            toggleButton.classList.add("toggle-button");

            // Check mic status on load
            chrome.tabs.sendMessage(tab.id, { action: "checkMicStatus" }, (response) => {
                toggleButton.innerHTML = response?.status === "muted" 
                    ? '<i class="fas fa-microphone-slash"></i> Unmute' 
                    : '<i class="fas fa-microphone"></i> Mute';
                toggleButton.classList.toggle("muted", response?.status === "muted");
            });

            toggleButton.onclick = () => {
                chrome.tabs.sendMessage(tab.id, { action: "toggleMic" }, (response) => {
                    if (response?.status) {
                        toggleButton.innerHTML = response.status === "muted" 
                            ? '<i class="fas fa-microphone-slash"></i> Unmute' 
                            : '<i class="fas fa-microphone"></i> Mute';
                        toggleButton.classList.toggle("muted", response.status === "muted");
                    }
                });
            };

            meetingItem.appendChild(title);
            meetingItem.appendChild(toggleButton);
            meetingsList.appendChild(meetingItem);
        });
    });
});
