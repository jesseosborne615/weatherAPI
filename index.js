const APIKEY = "0b8dbd76a184ddb1a8fbb03db5c745be";
$(document).ready(function () {
  $(".save-list").empty();
  if (localStorage.getItem("cities") !== null) {
    displaySaved();
  }
});
function displaySaved() {
  $(".save-list").empty();
  const citiesArr = JSON.parse(localStorage.getItem("cities"));
  citiesArr.forEach((city) => {
    const listEl = $("<li>");
    const linkEl = $(`<button>`).attr("data-city", city);
    linkEl.attr("class", "searched");
    linkEl.text(city);
    listEl.append(linkEl);
    $(".save-list").append(listEl);
  });
}
$("#clear").on("click", function () {
  localStorage.clear();
  $(".save-list").empty();
});
$(document).on("click", ".searched", function () {
  const searched = $(this).attr("data-city");
  $(".content-2").empty();
  $(".curr-forecast").empty();
  apiCall(searched);
});
function searchCity(event) {
  $(".content-2").empty();
  $(".curr-forecast").empty();
  event.preventDefault();
  const city = $("#city").val().trim().toLowerCase();
  if (city === "") {
    return false;
  }
  let citiesArr = JSON.parse(localStorage.getItem("cities")) || [];
  citiesArr.push(city);
  localStorage.setItem("cities", JSON.stringify(citiesArr));
  apiCall(city);
  displaySaved();
}
function apiCall(city) {
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=imperial`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const lat = data.coord.lat;
      const lon = data.coord.lon;
      fiveDayForecast(lat, lon);
      createCard(data);
    });
}
function fiveDayForecast(lat, lon) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKEY}&units=imperial`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (let i = 0; i < data.list.length; i++) {
        if (data.list[i].dt_txt.split(" ")[1] === "12:00:00") {
          const boxEl = $("<div>").addClass("box");
          const cardBody = $("<div>").addClass("card-body");
          const nameEl = $(`<h2>${data.city.name}</h2>`);
          const dateEl = $(`<h3> ${data.list[i].dt_txt.split(" ")[0]}</h3>`);
          const imgEl = $(`<img>`).attr(
            "src",
            `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`
          );
          const tempEl = $(`<p>Temp: ${data.list[i].main.temp}&#8457;</p>`);
          const humidEl = $(`<p>Humidity: ${data.list[i].main.humidity}%</p> `);
          cardBody.append(nameEl, dateEl, imgEl, tempEl, humidEl);
          boxEl.append(cardBody);
          $(".content-2").append(boxEl);
        }
      }
    });
}
function createCard(info) {
  const boxEl = $("<div>").addClass("box");
  const cardBody = $("<div>").addClass("card-body");
  const nameEl = $(`<h3>${info.name}<h3>`);
  const imgEl = $(`<img>`).attr(
    "src",
    `http://openweathermap.org/img/wn/${info.weather[0].icon}.png`
  );
  const tempEl = $(`<p>Temp: ${info.main.temp}&#8457;</p>`);
  const humidEl = $(`<p>Humidity: ${info.main.humidity}%</P>`);
  cardBody.append(nameEl, imgEl, tempEl, humidEl);
  boxEl.append(cardBody);
  $(".curr-forecast").append(boxEl);
}
$("#search").on("click", searchCity);