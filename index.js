var apiKey = "0b8dbd76a184ddb1a8fbb03db5c745be"
var searchBtn = document.getElementById('searchButton')
var city = document.getElementById('city')
var cityName = document.getElementById('city-name')

var lat
var lon
var temp = document.getElementById('temp')
var humidity
var windSpeed
var icon

function getGeolocation() {
    var search = city.value.trim()
    console.log(search)
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${search}&limit=1&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)
            lat = data[0].lat
            lon = data[0].lon
            getWeather()
        })
        .catch(err => console.error(err))
}

function getWeather() {
    fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`)
        .then(res => res.json())
        
        .then(data => {
            console.log(data);
            temp = data.list[0].main.temp
            humidity = data.list[0].main.humidity
            windSpeed = data.list[0].wind.speed
            icon = data.list[0].weather[0].icon

            renderWeather(data)
        })

        
        .catch(err => console.error(err))
}
  

function renderWeather(data) {
    // populates dom element
    cityName.textContent = data.city.name;
    var tempParagraph = document.getElementById('temp');
    console.log(tempParagraph)
    tempParagraph.textContent = "Temperature: " + data.list[0].main.temp;
    var humidity = document.getElementById('humidity');
    humidity.textContent = "Humidity: " + data.list[0].main.humidity;
    console.log(data.list)
    console.log(data.list[0].main.temp);
    console.log(data.list[0].main.humidity)
    
}



searchBtn.addEventListener('click', getGeolocation)