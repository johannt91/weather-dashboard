var cityFormEl = document.querySelector("#city-form");
var cityInputEl = document.querySelector("#city");

var formSubmitHandler = function(event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    if (cityName) {
        getCityWeather(cityName);
        cityInputEl.value ="";
    } else {
        alert("Enter a city name");
    }
}

cityFormEl.addEventListener("submit", formSubmitHandler);

var getCityWeather = function(cityName) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=f7e68c78a6c0589ffc5c75fdd1fe6b01';

    fetch(apiUrl).then(function(response){
        response.json().then(function(data){
            console.log(data);
        });
    });
  };
