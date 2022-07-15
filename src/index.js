/* eslint-disable linebreak-style */
import './styles.css';
import Cloudy from './weather-icons/animated/cloudy.svg';
import Rainy from './weather-icons/animated/rainy-5.svg';
import Sunny from './weather-icons/animated/day.svg';
import Night from './weather-icons/animated/night.svg';
import Snowy from './weather-icons/animated/snowy-6.svg';
import Thunder from './weather-icons/animated/thunder.svg';

const currentWeatherName = document.querySelector('.current-title');
const currentIconContainer = document.querySelector('.current-icon-container');
const currentWeatherTemp = document.querySelector('.current-temp');
const windValue = document.querySelector('.wind-value');
const humidityValue = document.querySelector('.humidity-value');
const pressureValue = document.querySelector('.pressure-value');
const feelsLikeValue = document.querySelector('.feels-like-value');
const tenDayContainer = document.querySelector('.ten-day-container');
const searchBtn = document.querySelector('.search-city-button');
const searchValue = document.querySelector('.search-city');
const errorcontainer = document.querySelector('.errors');

function getDay(timestamp) {
  const date = new Date(timestamp * 1000);
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

async function getWeatherData(city = 'New York') {
  const API = 'bf1b862b454a53f068a32a77640da62e';
  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API}`;
  const currentWeatherResponse = await fetch(currentWeatherUrl);
  const currentWeatherJson = await currentWeatherResponse.json();
  const currentWeatherLon = currentWeatherJson.coord.lon;
  const currentWeatherLat = currentWeatherJson.coord.lat;
  const futureWeatherUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${currentWeatherLat}&lon=${currentWeatherLon}&appid=${API}&units=imperial`;
  const futureWeatherResponse = await fetch(futureWeatherUrl);
  const futureWeatherJson = await futureWeatherResponse.json();
  return {
    currentWeatherJson,
    futureWeatherJson,
  };
}

// function convertToFahrenheit(temp) {
//   return Math.round((temp * 9) / 5 - 459.67);
// }

function clearForcast() {
  tenDayContainer.innerHTML = '';
}

function tenDayForcast(futureWeatherData) {
  clearForcast();
  const data = futureWeatherData.daily;
  for (let i = 0; i < data.length; i += 1) {
    const day = getDay(data[i].dt);
    const temp = Math.round(data[i].temp.day);
    const { description } = data[i].weather[0];
    tenDayContainer.innerHTML += `
    <div class="ten-day-item">
      <p class="ten-day-title">${day}</p>
      <div class="ten-day-icon-container">
        <p class="ten-day-icon" alt="weather icon">${description}</p>
      </div>
      <p class="ten-day-temp">${temp}°F</p>
    </div>
    `;
  }
  return tenDayContainer;
}

function setWeatherIcon(currentWeather) {
  const img = document.createElement('img');
  img.classList = 'img-icon';

  switch (currentWeather) {
    case 'Clouds':
      img.src = Cloudy;
      break;
    case 'Rain':
      img.src = Rainy;
      break;
    case 'Clear':
      img.src = Sunny;
      break;
    case 'Snow':
      img.src = Snowy;
      break;
    case 'Thunderstorm':
      img.src = Thunder;
      break;
    default:
      return null;
  }
  return img;
}

function renderWeather(data) {
  const currentWeather = data.currentWeatherJson;
  const futureWeather = data.futureWeatherJson;
  currentWeatherName.innerHTML = currentWeather.name;
  currentIconContainer.innerHTML = '';
  currentIconContainer.appendChild(setWeatherIcon(currentWeather.weather[0].main));
  currentWeatherTemp.innerHTML = `${Math.round(currentWeather.main.temp)}°F`;
  windValue.innerHTML = `${Math.round(currentWeather.wind.speed)} mph`;
  humidityValue.innerHTML = `${currentWeather.main.humidity}%`;
  pressureValue.innerHTML = `${Math.round(currentWeather.main.pressure)} mb`;
  feelsLikeValue.innerHTML = `${Math.round(currentWeather.main.feels_like)}°F`;
  tenDayForcast(futureWeather);
}

window.addEventListener('load', () => {
  getWeatherData('New York').then((data) => {
    renderWeather(data);
  });
});

searchBtn.addEventListener('click', () => {
  const city = searchValue.value;
  if (city === '' || city <= 0) {
    errorcontainer.classList.remove('hidden');
    errorcontainer.innerHTML = 'Please enter a valid city';
    return;
  }
  errorcontainer.classList.add('hidden');
  getWeatherData(city).then((data) => {
    renderWeather(data);
  });
});
