document.addEventListener("DOMContentLoaded", () => {
    const meetingsList = document.getElementById("meetingsList");

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
                toggleButton.textContent = response?.status === "muted" ? "Unmute" : "Mute";
                toggleButton.classList.toggle("muted", response?.status === "muted");
            });

            toggleButton.onclick = () => {
                chrome.tabs.sendMessage(tab.id, { action: "toggleMic" }, (response) => {
                    if (response?.status) {
                        toggleButton.textContent = response.status === "muted" ? "Unmute" : "Mute";
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
