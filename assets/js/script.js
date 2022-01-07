const cityFormEl = document.querySelector("#city-form");
const cityInputEl = document.querySelector("#city");

const currentDate = document.querySelector("#currentDay");
const forecastHeader = document.querySelector("#forecast-title");
const forecastSection = document.querySelector("#forecast");
const dailyForecast = document.querySelector("#daily");
const cardDeck = document.querySelector("#card-deck");
const currentWeatherContainer = document.querySelector("#currentWeather-container");
const currentWeatherDisplay = document.querySelector("#current-weather");

const fiveDayForecast = document.querySelector("#forecast-container");

currentWeatherContainer.style.display = "none";
forecastHeader.style.display = "none";


//------------------ SPEECH VARIABLES ----------------------
const speechOutput = document.querySelector("#speech");
const talk = document.querySelector("#talk");
const background = document.querySelector("body");


//------------------ WEATHER DETAILS ----------------------
const city = document.querySelector("#city-name");
const weatherIcon = document.querySelector("#weather-icon");
const temperature = document.querySelector("#temp");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");
const UVI = document.querySelector("#uv-index");


//------------------ SEARCH HISTORY SECTION ----------------------
const searchHistory = document.querySelector("#search-history");
const clearSearchHistory = document.querySelector("#clear-history");


//------------------ SEARCH CITY AND STORE SEARCH ----------------------
const searchCity = (event) => {
    event.preventDefault();
    currentWeatherContainer.style.display = "flex";
    var cityName = cityInputEl.value.trim();
    if (cityName) {
        getCityWeather(cityName);
        cityInputEl.value = "";
        var searchedCity = JSON.parse(localStorage.getItem("CityList")) || [cityName];
        var storedCities = {
            city: cityName
        };
        searchedCity.push(storedCities);

        localStorage.setItem("CityList", JSON.stringify(searchedCity));
    } else {
        alert("Enter a city name");
    }
    createCityList(searchedCity);
};

//------------------ SEARCH CITY VIA WEB SPEECH ----------------------
if ("webkitSpeechRecognition" in window) {
    const speechRecognition = new webkitSpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = "en-US";

    speechRecognition.onstart = function () {
        console.log("Speech recognition active");
    };

    speechRecognition.onresult = function (event) {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript.toLowerCase().replace(
            /[.,\/#!$%\^&\*;:{}=\-_`~()]/g,
            ""
        );
        cityInputEl.value = transcript;
        setTimeout(() => {
            searchCity(event);
        }, 1000);
    };

    speechRecognition.onerror = function (event) {
        console.log(event.error);
    };

    talk.addEventListener("click", () => speechRecognition.start());
} else {
    alert(`Speech recognition unavailable :(`);
}



//------------------ GET CITY AND WEATHER ----------------------
const getCityWeather = (cityName) => {
    let apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=f7e68c78a6c0589ffc5c75fdd1fe6b01';

    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            console.log("Coord api:", data);
            let latitude = data.city.coord.lat;
            let longitude = data.city.coord.lon;

            city.textContent = data.city.name;

            fetch(
                    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly,alerts&appid=f7e68c78a6c0589ffc5c75fdd1fe6b01`
                )
                .then(function (response) {
                    response.json()
                        .then(function (data) {
                            displayWeather(data);
                        });
                });
        });
    });
};

//------------------ DISPLAY WEATHER ----------------------//
const displayWeather = (data) => {

    let options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    //------------------ CURRENT WEATHER ----------------------//
    forecastHeader.style.display = "block";
    currentWeatherDisplay.style.display = "block";
    currentDate.textContent = new Date(data.current.dt * 1000).toLocaleDateString("en-US", options);
    weatherIcon.src = 'https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png';
    temperature.textContent = "Temperature: " + Math.floor((data.current.temp - 32) * 5 / 9) + "°C";
    humidity.textContent = "Humidity: " + data.current.humidity + "%";
    windSpeed.textContent = "Wind Speed: " + data.current.wind_speed + " MPH";
    let currentUVI = data.current.uvi;
    UVI.textContent = "UV Index: " + currentUVI;



    if (currentUVI >= 0 && currentUVI <= 2) {
        UVI.classList = "bg-success text-white";
    } else if (currentUVI >= 3 && currentUVI <= 5) {
        UVI.classList = "bg-warning";
    } else if (currentUVI >= 6 && currentUVI <= 7) {
        UVI.classList = "bg-warning";
    } else if (currentUVI >= 8) {
        UVI.classList = "bg-danger text-white";
    };

    //------------------ 5 DAY FORECAST ----------------------//
    //---CLEAR OLD CONTENT ---//
    cardDeck.textContent = "";


    //---- LOOP THROUGH FIVE DAYS OF FORECASTS ----//
    for (i = 1; i < 6; i++) {

        let card = document.createElement("div");
        card.classList = "card";
        let cardBody = document.createElement("div");
        cardBody.classList = "card-body";

        let date = document.createElement("span");
        date.classList = "daily-date";
        date.textContent = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");

        let dailyIcon = document.createElement("img");
        dailyIcon.src = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png';

        let tempEl = document.createElement("p");
        tempEl.classList = "card-text daily-weather-text";
        tempEl.textContent = "Temp: " + Math.floor((data.daily[i].temp.max - 32) * 5 / 9) + "°C";

        let humidityEl = document.createElement("p");
        humidityEl.classList = "card-text daily-weather-text";
        humidityEl.textContent = "Humidity: " + data.daily[i].humidity + "%";

        cardDeck.append(card);
        card.append(cardBody);
        cardBody.appendChild(date);
        cardBody.appendChild(dailyIcon);
        cardBody.appendChild(tempEl);
        cardBody.appendChild(humidityEl);
    }

};

//Create search history list
function createCityList() {
    var searchedCities = JSON.parse(localStorage.getItem("CityList")) || [];
    searchHistory.innerHTML = "";
    for (i = 1; i < searchedCities.length; i++) {
        var buttonEl = document.createElement("li");
        buttonEl.classList = "list-group-item list-group-item-action";
        buttonEl.setAttribute(`data-id`, i);
        buttonEl.textContent = searchedCities[i].city;
        searchHistory.appendChild(buttonEl);
    }
};

//------------------------- Render Search History -------------------------//
const renderSearchHistory = (event) => {
    let searchedCities = JSON.parse(localStorage.getItem("CityList")) || [];
    currentWeatherContainer.style.display = "flex";
    let cityId = event.target.getAttribute("data-id");
    let cityIndex = searchedCities[cityId].city;
    console.log(cityIndex);
    getCityWeather(cityIndex);
};


//clear scearch history
clearSearchHistory.addEventListener("click", function (event) {
    localStorage.clear(event);
    searchHistory.textContent = "";
    cardDeck.textContent = "";
    currentWeatherContainer.style.display = "none";
    currentWeatherDisplay.style.display ="none";
    forecastHeader.style.display = "none";
});

createCityList();

//------------------------- Click handlers -------------------------//
cityFormEl.addEventListener("submit", searchCity);
searchHistory.addEventListener("click", renderSearchHistory);