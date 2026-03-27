const BASE_URL = 'https://wttr.in';

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

    showLoading();

    try {
        const response = await fetch(`${BASE_URL}/${city}?format=j1`);
        
        if (!response.ok) {
            throw new Error('Shahar topilmadi. Iltimos, to\'g\'ri shahar nomini kiriting.');
        }

        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    }
}

function displayWeather(data) {
    const current = data.current_condition[0];
    
    cityName.textContent = data.nearest_area[0].areaName[0].value + ', ' + data.nearest_area[0].country[0].value;
    temp.textContent = Math.round(parseFloat(current.temp_C));
    weatherDesc.textContent = current.weatherDesc[0].value;
    humidity.textContent = current.humidity + '%';
    wind.textContent = current.windspeedKmph + ' km/h';

    const weatherDescLower = current.weatherDesc[0].value.toLowerCase();
    let weatherId;
    if (weatherDescLower.includes('rain') || weatherDescLower.includes('drizzle')) weatherId = 500;
    else if (weatherDescLower.includes('snow')) weatherId = 600;
    else if (weatherDescLower.includes('cloud') || weatherDescLower.includes('overcast')) weatherId = 801;
    else if (weatherDescLower.includes('sun') || weatherDescLower.includes('clear')) weatherId = 800;
    else weatherId = 800;

    weatherIcon.src = `https://wttr.in/${cityInput.value}_2.png`;
    weatherIcon.alt = current.weatherDesc[0].value;

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