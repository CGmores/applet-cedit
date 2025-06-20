document.addEventListener('DOMContentLoaded', () => {
    const appletContainer = document.getElementById('applet-container');

    /**
     * Fetches applet data from the JSON file and renders it.
     */
    async function loadAppletHistory() {
        try {
            const response = await fetch('applet_access_history.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            // Clear any existing content (like a loading message)
            appletContainer.innerHTML = ''; 

            if (data.applets && data.applets.length > 0) {
                data.applets.forEach(applet => {
                    const card = createAppletCard(applet);
                    appletContainer.appendChild(card);
                });
            } else {
                appletContainer.innerHTML = '<p>No applet history found.</p>';
            }

        } catch (error) {
            console.error("Failed to load applet history:", error);
            appletContainer.innerHTML = '<p>Could not load applet history. Please try again later.</p>';
        }
    }

    /**
     * Creates an HTML element for a single applet card.
     * @param {object} applet - The applet data object.
     * @returns {HTMLElement} The created card element.
     */
    function createAppletCard(applet) {
        const card = document.createElement('article');
        card.className = 'applet-card';

        // Applet Name
        const name = document.createElement('h2');
        name.className = 'applet-name';
        name.textContent = applet.name || 'Unnamed Applet';

        // Applet Description
        const description = document.createElement('p');
        description.className = 'applet-description';
        description.textContent = applet.description || 'No description available.';
        
        // Meta data container for timestamps
        const meta = document.createElement('div');
        meta.className = 'applet-meta';

        // First and Last Access Times
        const firstAccess = document.createElement('p');
        firstAccess.innerHTML = `<strong>First Accessed:</strong> ${formatDateTime(applet.firstAccessTime)}`;
        
        const lastAccess = document.createElement('p');
        lastAccess.innerHTML = `<strong>Last Accessed:</strong> ${formatDateTime(applet.lastAccessTime)}`;

        // Assemble the card
        meta.appendChild(firstAccess);
        meta.appendChild(lastAccess);
        
        card.appendChild(name);
        card.appendChild(description);
        card.appendChild(meta);

        return card;
    }

    /**
     * Formats an ISO 8601 date string into a readable format.
     * e.g., "June 20, 2025, 6:25 AM"
     * @param {string} isoString - The date string to format.
     * @returns {string} The formatted date string, or "Invalid Date" if input is bad.
     */
    function formatDateTime(isoString) {
        if (!isoString) return 'N/A';
        
        const date = new Date(isoString);
        if (isNaN(date)) {
            return 'Invalid Date';
        }

        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        
        return new Intl.DateTimeFormat('en-US', options).format(date);
    }

    // Initial load
    loadAppletHistory();
});
