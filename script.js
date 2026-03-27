const API_KEY = 'YOUR_API_KEY_HERE';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const weatherInfo = document.getElementById('weatherInfo');

const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const temp = document.getElementById('temp');
const weatherDesc = document.getElementById('weatherDesc');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const currentDate = document.getElementById('currentDate');
const currentTime = document.getElementById('currentTime');

function updateDateTime() {
    const now = new Date();
    
    const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    
    currentDate.textContent = now.toLocaleDateString('uz-UZ', dateOptions);
    currentTime.textContent = now.toLocaleTimeString('uz-UZ', timeOptions);
}

function getWeatherIcon(weatherId) {
    if (weatherId >= 200 && weatherId < 300) return '🌩️';
    if (weatherId >= 300 && weatherId < 400) return '🌧️';
    if (weatherId >= 500 && weatherId < 600) return '🌧️';
    if (weatherId >= 600 && weatherId < 700) return '❄️';
    if (weatherId >= 700 && weatherId < 800) return '🌫️';
    if (weatherId === 800) return '☀️';
    if (weatherId > 800) return '☁️';
    return '☀️';
}

function updateBackground(weatherId) {
    const body = document.body;
    body.className = '';
    
    if (weatherId >= 200 && weatherId < 600) {
        body.classList.add('rainy');
    } else if (weatherId >= 600 && weatherId < 700) {
        body.classList.add('cloudy');
    } else if (weatherId === 800) {
        body.classList.add('sunny');
    } else if (weatherId > 800) {
        body.classList.add('cloudy');
    } else {
        body.classList.add('clear');
    }
}

async function getWeather(city) {
    if (!city.trim()) {
        showError('Iltimos, shahar nomini kiriting!');
        return;
    }

    if (API_KEY === 'YOUR_API_KEY_HERE') {
        showError('API kalit sozlanmagan! script.js fayliga o\'zingizning OpenWeatherMap API kalitini qo\'shing.');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=uz`);
        
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Shahar topilmadi. Iltimos, to\'g\'ri shahar nomini kiriting.');
            } else if (response.status === 401) {
                throw new Error('API kalit noto\'g\'ri. Iltimos, API kalitni tekshiring.');
            } else {
                throw new Error('Xatolik yuz berdi. Qayta urinib ko\'ring.');
            }
        }

        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

function displayWeather(data) {
    cityName.textContent = data.name + ', ' + data.sys.country;
    temp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;
    humidity.textContent = data.main.humidity + '%';
    wind.textContent = data.wind.speed + ' m/s';

    const weatherId = data.weather[0].id;
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;
    weatherIcon.alt = data.weather[0].description;

    updateBackground(weatherId);
    updateDateTime();

    hideLoading();
    hideError();
    showWeatherInfo();
}

function showLoading() {
    loading.classList.remove('hidden');
    weatherInfo.classList.add('hidden');
    error.classList.add('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorMessage.textContent = message;
    error.classList.remove('hidden');
    loading.classList.add('hidden');
    weatherInfo.classList.add('hidden');
}

function hideError() {
    error.classList.add('hidden');
}

function showWeatherInfo() {
    weatherInfo.classList.remove('hidden');
}

searchBtn.addEventListener('click', () => {
    getWeather(cityInput.value);
});

cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        getWeather(cityInput.value);
    }
});

setInterval(updateDateTime, 1000);
updateDateTime();