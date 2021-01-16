var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");

var forecastHeader = document.querySelector("#forecast")

//------------------ WEATHER DETAILS ----------------------
var city = document.querySelector("#city-name");
var weatherIcon = document.querySelector("#weather-icon");
var temperature = document.querySelector("#temp");
var humidity = document.querySelector("#humidity");
var windSpeed = document.querySelector("#wind-speed");
var UVI = document.querySelector("#uv-index");


var searchCity = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    if (cityName) {
        getCityWeather(cityName);
        cityInputEl.value = "";
    } else {
        alert("Enter a city name");
    }
}
//------------------ GET CITY AND WEATHER ----------------------
var getCityWeather = function (cityName) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=f7e68c78a6c0589ffc5c75fdd1fe6b01';

    fetch(apiUrl).then(function (response) {
        response.json().then(function (data) {

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
    console.log("display weather retrieving data from get city weather", data);
    weatherIcon.src = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '.png';
    temperature.textContent = "Temperature: " + Math.floor((data.current.temp - 32) * 5 / 9) + "°C";
    humidity.textContent = "Humidity: " + data.current.humidity + "%";
    windSpeed.textContent= "Wind Speed: " + data.current.wind_speed + " MPH";
    UVI.textContent = "UV Index: " + data.current.uvi;





cityFormEl.addEventListener("submit", searchCity);