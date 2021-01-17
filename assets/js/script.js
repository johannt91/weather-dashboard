var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");

var currentDate = document.querySelector("#currentDay");
var forecastHeader = document.querySelector("#forecast-title")
var dailyForecast = document.querySelector("#daily");
var cardDeck = document.querySelector("#card-deck");

var fiveDayForecast = document.querySelector("#forecast-container");

//------------------ WEATHER DETAILS ----------------------
var city = document.querySelector("#city-name");
var weatherIcon = document.querySelector("#weather-icon");
var temperature = document.querySelector("#temp");
var humidity = document.querySelector("#humidity");
var windSpeed = document.querySelector("#wind-speed");
var UVI = document.querySelector("#uv-index");

//------------------ SEARCH HISTORY ----------------------
var searchHistory = document.querySelector("#search-history");

//------------------ SEARCH CITY AND STORE SEARCH ----------------------
var searchCity = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    if (cityName) {
        getCityWeather(cityName);
        cityInputEl.value = "";
        var searchedCity = JSON.parse(localStorage.getItem("CityList")) || [];

        var storedCities = {City: cityName};
        searchedCity.push(storedCities);

        localStorage.setItem("CityList", JSON.stringify(searchedCity));
        //call function to append city list
    } else {
        alert("Enter a city name");
    }
}
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
                'https://api.openweathermap.org/data/2.5/onecall?lat=' + latitude + '&lon=' + longitude + '&units=imperial&exclude=minutely,hourly,alerts&appid=f7e68c78a6c0589ffc5c75fdd1fe6b01')
                .then(function (response) {
                    response.json()
                        .then(function (data) {
                            displayWeather(data);
                        })
                });
        })
    });
};

//------------------ DISPLAY WEATHER ----------------------
var displayWeather = function(data) {

    //------------------ CURRENT WEATHER ----------------------
    // console.log("display weather retrieving data from get city weather", data);
    currentDate.textContent = new Date(data.current.dt * 1000).toLocaleDateString("en-US");
    weatherIcon.src = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png';
    temperature.textContent = "Temperature: " + Math.floor((data.current.temp - 32) * 5 / 9) + "°C";
    humidity.textContent = "Humidity: " + data.current.humidity + "%";
    windSpeed.textContent= "Wind Speed: " + data.current.wind_speed + " MPH";
    UVI.textContent = "UV Index: " + data.current.uvi;


    //------------------ 5 DAY FORECAST ----------------------
    forecastHeader.textContent = "5-Day Forecast:";
    
    //---CLEAR OLD CONTENT ---
    cardDeck.textContent= "";
    
    //---- LOOP THROUGH FIVE DAYS OF FORECASTS ----
    for (i=0; i < 5; i++) {
        
        // console.log("5 day forecast:", data.daily[i]);
        var card = document.createElement("div")
        card.classList = "card bg-primary";
        var cardBody = document.createElement("div");
        cardBody.classList = "card-body";
        
        var date = document.createElement("p");
        date.classList = "daily-date";
        date.textContent = new Date(data.daily[i].dt * 1000).toLocaleDateString("en-US");

        var dailyIcon = document.createElement("img");
        dailyIcon.src = 'http://openweathermap.org/img/wn/' + data.daily[i].weather[0].icon + '.png';

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



cityFormEl.addEventListener("submit", searchCity);