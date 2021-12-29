var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");

var currentDate = document.querySelector("#currentDay");
var forecastHeader = document.querySelector("#forecast-title");
var forecastSection = document.querySelector("#forecast");
var dailyForecast = document.querySelector("#daily");
var cardDeck = document.querySelector("#card-deck");
var currentWeatherDisplay = document.querySelector("#currentWeather-container");

var fiveDayForecast = document.querySelector("#forecast-container");

currentWeatherDisplay.style.display = "none";
forecastHeader.style.display = "none";

//------------------ WEATHER DETAILS ----------------------
var city = document.querySelector("#city-name");
var weatherIcon = document.querySelector("#weather-icon");
var temperature = document.querySelector("#temp");
var humidity = document.querySelector("#humidity");
var windSpeed = document.querySelector("#wind-speed");
var UVI = document.querySelector("#uv-index");


//------------------ SEARCH HISTORY SECTION ----------------------
var searchHistory = document.querySelector("#search-history");
var clearSearchHistory = document.querySelector("#clear-history");


//------------------ SEARCH CITY AND STORE SEARCH ----------------------
var searchCity = function (event) {
    event.preventDefault();
    currentWeatherDisplay.style.display = "flex";
    var cityName = cityInputEl.value.trim();
    if (cityName) {
        getCityWeather(cityName);
        cityInputEl.value = "";
        var searchedCity = JSON.parse(localStorage.getItem("CityList")) || [cityName];
        var storedCities = {city: cityName};
        searchedCity.push(storedCities);

        localStorage.setItem("CityList", JSON.stringify(searchedCity));
    } else {
        alert("Enter a city name");
    }
    createCityList(searchedCity);
};

//------------------ GET CITY AND WEATHER ----------------------
var getCityWeather = function (cityName) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=f7e68c78a6c0589ffc5c75fdd1fe6b01';

    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {
            console.log("Coord api:", data);
            var latitude = data.city.coord.lat;
            var longitude = data.city.coord.lon;
            
            city.textContent = data.city.name;

            fetch(
                `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&exclude=minutely,hourly,alerts&appid=f7e68c78a6c0589ffc5c75fdd1fe6b01`
                )
                .then(function (response) {
                    response.json()
                        .then(function (data) {
                            displayWeather(data);
                        })
                });
        })
    });
};

//------------------ DISPLAY WEATHER ----------------------//
var displayWeather = function(data) {

    //------------------ CURRENT WEATHER ----------------------//
    forecastHeader.style.display = "block";
    currentDate.textContent = new Date(data.current.dt * 1000).toLocaleDateString("en-US");
    weatherIcon.src = 'https://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png';
    temperature.textContent = "Temperature: " + Math.floor((data.current.temp - 32) * 5 / 9) + "°C";
    humidity.textContent = "Humidity: " + data.current.humidity + "%";
    windSpeed.textContent= "Wind Speed: " + data.current.wind_speed + " MPH";
    var currentUVI = data.current.uvi;
    UVI.textContent = "UV Index: " + currentUVI;

    
    
    if (currentUVI >=0 && currentUVI <= 2) {UVI.classList = "bg-success text-white"}
    else if (currentUVI >=3  && currentUVI <= 5) {UVI.classList = "bg-warning"}
    else if (currentUVI >=6 && currentUVI <= 7) {UVI.classList = "bg-warning"}
    else if (currentUVI >=8) {UVI.classList = "bg-danger text-white"};

    //------------------ 5 DAY FORECAST ----------------------//
    
    //---CLEAR OLD CONTENT ---//
    cardDeck.textContent= "";
    
    //---- LOOP THROUGH FIVE DAYS OF FORECASTS ----//
    for (i=0; i < 5; i++) {
        
        var card = document.createElement("div");
        card.classList = "card bg-primary";
        var cardBody = document.createElement("div");
        cardBody.classList = "card-body";
        
        var date = document.createElement("p");
        date.classList = "daily-date";
        date.textContent = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");

        var dailyIcon = document.createElement("img");
        dailyIcon.src = 'https://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png';

        var tempEl = document.createElement("p");
        tempEl.classList = "card-text daily-weather-text";
        tempEl.textContent = "Temp: " + Math.floor((data.daily[i].temp.max - 32) * 5 / 9) + "°C";
        
        var humidityEl = document.createElement("p");
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
    searchHistory.innerHTML="";
     for (i = 1; i<searchedCities.length; i++){
        var buttonEl = document.createElement("li");
        buttonEl.classList = "list-group-item list-group-item-action";
        buttonEl.setAttribute(`data-id`, i);
        buttonEl.textContent = searchedCities[i].city;
        searchHistory.appendChild(buttonEl);
    }
};

//------------------------- Render Search History -------------------------//
var renderSearchHistory = function (event) {
    var searchedCities = JSON.parse(localStorage.getItem("CityList")) || [];
    currentWeatherDisplay.style.display = "flex";
    var cityId = event.target.getAttribute("data-id");
    var cityIndex = searchedCities[cityId].city;
    console.log(cityIndex);
    getCityWeather(cityIndex);
};


//clear scearch history
clearSearchHistory.addEventListener("click", function(event){
    localStorage.clear(event);
    searchHistory.textContent = "";
    cardDeck.textContent= "";
    currentWeatherDisplay.style.display = "none";
    forecastHeader.style.display = "none";
});

createCityList();

//------------------------- Click handlers -------------------------//
cityFormEl.addEventListener("submit", searchCity);
searchHistory.addEventListener("click", renderSearchHistory);