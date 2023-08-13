
function fetchEvents() {
    const inputDate = document.getElementById("event-date").value;
    const [year, month, day] = inputDate.split("-");
    const eventType = document.getElementById("event-type").value;
    const lang = document.getElementById("language").value;
    // Construct the API URL with the selected date
    const apiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/${lang}/onthisday/${eventType}/${month}/${day}`;

    // Fetch data from the API
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayEvents(data);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

const favoritesButton = document.getElementById("fav-but");
favoritesButton.addEventListener("click", displayEventsFromLocalStorage);

function displayEvents(data) {
    const eventsList = document.getElementById("events-list");
    const favorites = getFavoritesFromLocalStorage();

    // Clear any previous events
    eventsList.innerHTML = "";

    // Check if there are any events on the given date
    if (data.events && data.events.length > 0) {
        const events = data.events;
        const eventsHTML = events.map(event => {
            const isFavorite = favorites.includes(event.text);
            return `
                <li>
                    <span>${event.text}</span>
                    <button onclick="toggleFavorite('${event.text}')">
                        ${isFavorite ? "Remove" : "Bookmark"}
                    </button>
                </li>
            `;
        }).join("");
        eventsList.innerHTML = `<ul>${eventsHTML}</ul>`;
    } else {
        eventsList.innerHTML = "<p>No events found for this date.</p>";
    }
}

function toggleFavorite(eventText) {
    const favorites = getFavoritesFromLocalStorage();
    const eventIndex = favorites.indexOf(eventText);
    if (eventIndex !== -1) {
        favorites.splice(eventIndex, 1); // Remove from favorites
    } else {
        favorites.push(eventText); // Add to favorites
    }
    saveFavoritesToLocalStorage(favorites);
    fetchEvents();
}



function removeFromFavorites(eventText) {
    const favorites = getFavoritesFromLocalStorage();
    const eventIndex = favorites.indexOf(eventText);
    if (eventIndex !== -1) {
        favorites.splice(eventIndex, 1); // Remove from favorites
        saveFavoritesToLocalStorage(favorites);
        displayEventsFromLocalStorage();
    }
}

function saveFavoritesToLocalStorage(favorites) {
    localStorage.setItem("favoriteEvents", JSON.stringify(favorites));
}

function getFavoritesFromLocalStorage() {
    const favoritesJSON = localStorage.getItem("favoriteEvents");
    return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}

function displayEventsFromLocalStorage() {
    const favorites = getFavoritesFromLocalStorage();
    const eventsList = document.getElementById("events-list");

    // Clear any previous events
    eventsList.innerHTML = "";

    if (favorites.length > 0) {
        const favoritesHTML = favorites.map(favorite => `
            <li>
                <span>${favorite}</span>
                <button onclick="removeFromFavorites('${favorite}')">
                    Remove
                </button>
            </li>
        `).join("");
        eventsList.innerHTML = `<h3>Your Favorite Events:</h3><ul>${favoritesHTML}</ul>`;
    } else {
        eventsList.innerHTML = "<p>No favorite events yet.</p>";
    }
}

const getEventsBtn = document.getElementById("get-events-btn");
getEventsBtn.addEventListener("click", fetchEvents);

// Display favorite events on page load
displayEventsFromLocalStorage();