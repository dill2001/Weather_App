


document.getElementById("search-btn").addEventListener("click", async () => {
    try {
        const location = document.getElementById("search-loc").value;

        let reop = {
            method: 'POST'
        };
        fetch(`https://api.weatherapi.com/v1/forecast.json?key=aa96a0cce6e54cdc9b534437241003 &q=${location}&days=1&aqi=no&alerts=yes`, reop)

            .then(response => response.json())
            .then(data => {
                //.........weather_card...............
                document.getElementById("location").innerHTML = data["location"]["name"];
                document.getElementById("temperature").innerHTML = data["current"]["temp_c"] + " °C";
                document.getElementById("description").innerHTML = data["current"]["condition"]["text"];
                document.getElementById("weatherIcon").src = data["current"]["condition"]["icon"];
                document.getElementById("local-time").innerHTML = data["location"]["localtime"];
                //..........TABLE......................

                document.getElementById("loca").innerHTML = data["location"]["name"];
                document.getElementById("temp_c").innerHTML = data["current"]["temp_c"] + " °C";
                document.getElementById("status").innerHTML = data["current"]["condition"]["text"];
                document.getElementById("humidity").innerHTML = data["current"]["humidity"];
                document.getElementById("wind").innerHTML = data["current"]["wind_kph"] + " kph";
                document.getElementById("region").innerHTML = data["location"]["region"];
                document.getElementById("lat").innerHTML = data["location"]["lat"];
                document.getElementById("lon").innerHTML = data["location"]["lon"];
                document.getElementById("coun").innerHTML = data["location"]["country"];


                futureSevnDays(location);
                updatePastThreeDays(location);

            }


            );
    }
    catch (error) {
        console.error('Error during fetch:', error);
    }

});


async function updatePastThreeDays(location) {
    const startDate = new Date();
    let currentDay1 = new Date(startDate);

    for (let i = 7; i > 0; i--) {

        currentDay1.setDate(currentDay1.getDate() - 1);
        //hethuw blann toISOString, split
        let formattedDate = currentDay1.toISOString().split('T')[0];

        fetch(`https://api.weatherapi.com/v1/history.json?key=aa96a0cce6e54cdc9b534437241003&q=${location}&dt=${formattedDate}&days=7`)
            .then(response => response.json())
            .then(data => {
                var dateString = new Date(`${data.forecast.forecastday[0].date}`);
                var date = new Date(dateString);
                var day = date.getDate();
                var weekdayNumber = date.getDay();
                var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var weekdayName = weekdays[weekdayNumber];
                document.getElementById(`date1${i}`).innerHTML = weekdayName + "(" + day + ")";
                document.getElementById(`img1${i}`).src = `${data.forecast.forecastday[0].day.condition.icon}`;
                 document.getElementById(`title1${i}`).innerHTML = `${data.forecast.forecastday[0].day.condition.text}`;
               

            })
            .catch(error => {
                console.error("Error:", error);
            });

    }
}
function futureSevnDays(location) {
    const startDate = new Date();
    let currentDay = new Date(startDate);
    for (let i = 0; i < 7; i++) {
        //hethuw blann toISOString, split
        currentDay.setDate(currentDay.getDate() + 1);
        const formattedDate = currentDay.toISOString().split('T')[0];

        fetch(`https://api.weatherapi.com/v1/forecast.json?key=aa96a0cce6e54cdc9b534437241003&q=${location}&days=7&aqi=yes&alerts=yes&dt=${formattedDate}`)
            .then(response => response.json())
            .then(data => {
                // Define the date using the api
                var dateString = new Date(`${data.forecast.forecastday[0].date}`);
                var date = new Date(dateString);
                var day = date.getDate();
                var weekdayNumber = date.getDay();
                var weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                var weekdayName = weekdays[weekdayNumber];
                document.getElementById(`date${i + 1}`).innerHTML = weekdayName + "(" + day + ")";
                document.getElementById(`img${i + 1}`).src = `${data.forecast.forecastday[0].day.condition.icon}`;
                document.getElementById(`title${i + 1}`).innerHTML = `${data.forecast.forecastday[0].day.condition.text}`;
                

                


            })
            .catch(error => {
                console.error("Error:", error);
            });
    }
}

let map; // Declare a variable to hold the map instance

function initializeMap(latitude, longitude, pin) {
    if (!map) {
        map = L.map('map').setView([latitude, longitude], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    } else {
        map.setView([latitude, longitude], 13);
    }

    // Add a marker to the map
    L.marker([latitude, longitude]).addTo(map)
        .bindPopup(`Location: ${pin}`)
        .openPopup();
}

// Event listener for search button
document.getElementById("search-btn").addEventListener("click", async () => {
    try {
        const searchVal = document.getElementById("search-loc").value;
        const { latitude, longitude } = await fetchLocationData(searchVal);
        initializeMap(latitude, longitude, searchVal);
    } catch (error) {
        console.error('Error during fetch:', error);
        // Handle errors
    }
});

async function currentMap(currentLocation) {
    try {
        const { latitude, longitude } = await fetchLocationData(currentLocation);
        initializeMap(latitude, longitude, currentLocation);
    } catch (error) {
        console.error('Error during fetch:', error);
        // Handle errors
    }
}

async function fetchLocationData(location) {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=f1850d9ec02649c4b0a84749240403&q=${location}&days=7`);
        const data = await response.json();
        return { latitude: data.location.lat, longitude: data.location.lon };
    } catch (error) {
        console.error('Error fetching location data:', error);
        throw error; // Rethrow the error to handle it elsewhere if needed
    }
}

function toggleTheme() {
    const theme = document.getElementById('darkmode-toggle').checked ? 'light' : 'dark';
    document.body.setAttribute("data-bs-theme", theme);
}
document.getElementById('theme').addEventListener('click', toggleTheme);