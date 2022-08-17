const cityField = document.querySelector('input[type="search"]');
const searchBtn = document.querySelector('button[role="search"]');
const weather = document.getElementById("resultarea");
const forecastRow = document.querySelector(".forecast > .row");

console.log("row", forecastRow);

//weather icons
const icons = {
  "01d": "wi-day-sunny",
  "02d": "wi-day-cloudy",
  "03d": "wi-cloud",
  "04d": "wi-cloudy",
  "09d": "wi-showers",
  "10d": "wi-rain",
  "11d": "wi-thunderstorm",
  "13d": "wi-snow",
  "50d": "wi-fog",
  "01n": "wi-night-clear",
  "02n": "wi-night-alt-cloudy",
  "03n": "wi-cloud",
  "04n": "wi-night-cloudy",
  "09n": "wi-night-showers",
  "10n": "wi-night-rain",
  "11n": "wi-night-thunderstorm",
  "13n": "wi-night-alt-snow",
  "50n": "wi-night-fog",
};

//for remove child element in the DOM
function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

// trigger search event
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getWeatherByCity(cityField.value);
  getForecastByCity(cityField.value);
});

// fetch the city data from https://api.openweathermap.org/
function getCityWeather(url) {
  fetch(url)
    .then((response) => response.text())
    .then((str) => new window.DOMParser().parseFromString(str, "text/xml"))
    .then((data) => {
      let x = data.getElementsByTagName("current");

      for (let i = 0; i < x.length; i++) {
        const markup = `<h1 class="location">${x[i]
          .getElementsByTagName("city")[0]
          .getAttribute("name")}, ${
          x[i].getElementsByTagName("country")[0].childNodes[0].nodeValue
        }</h1>
 <div class="weather__summary">
    <p><i class="wi ${
      icons[x[i].getElementsByTagName("weather")[0].getAttribute("icon")]
    } weather-icon"></i> <span class="weather__celsius-value">${Math.floor(
          //  data.main.temp
          x[i].getElementsByTagName("temperature")[0].getAttribute("value")
        )}°C</span></p>
    <p>${x[i].getElementsByTagName("weather")[0].getAttribute("value")}</p>
    <ul class="weather__miscellaneous">
    <li><i class="wi wi-humidity"></i> Humidity  <span>${x[i]
      .getElementsByTagName("humidity")[0]
      .getAttribute("value")}%</span></li>
    <li><i class="wi wi-small-craft-advisory"></i> Wind Speed <span>${x[i]
      .getElementsByTagName("speed")[0]
      .getAttribute("value")} m/s</span></li>
    </ul>
 </div>
 `;
        removeChildren(weather);
        weather.insertAdjacentHTML("beforeend", markup);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

//fetch forecast data
function getForecast(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const forecastData = data.list.filter((obj) =>
        obj.dt_txt.endsWith("06:00:00")
      );
      renderForecast(forecastData);
    });
}

//render forecast data in the DOM
function renderForecast(forecast) {
  console.log("render");
  removeChildren(forecastRow);
  console.log(forecastRow);
  forecast.forEach((weatherData) => {
    console.log(weatherData);
    const markup = `<div class="forecast__day">
     <h3 class="forecast__date">${getWeekDay(
       new Date(weatherData.dt * 1000)
     )}</h3>
     <i class='wi ${icons[weatherData.weather[0].icon]} forecast__icon'></i>
     <p class="forecast__temp">${Math.floor(weatherData.main.temp)}°C</p>
     <p class="forecast__desc">${weatherData.weather[0].main}</p>
   </div>`;
    forecastRow.insertAdjacentHTML("beforeend", markup);
  });
}

//util function for weekdays
function getWeekDay(date) {
  const options = { weekday: "long" };
  return date.toLocaleString("en-us", options);
}

function getWeatherByCity(city) {
  getCityWeather(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=35b1f1d45a7b4378cf2430ae601816be&units=metric&mode=xml`
  );
}
function getForecastByCity(city) {
  getForecast(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=35b1f1d45a7b4378cf2430ae601816be&units=metric`
  );
}
