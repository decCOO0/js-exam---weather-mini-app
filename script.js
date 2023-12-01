const apiKey = 'dd664a6d934bf9ed283d6a1d1a39f50d';
const rInfo = document.querySelector('.right-info');
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const daysList = document.querySelector('.days-list');
const day = document.querySelector('.day-theme');
const night = document.querySelector('.night-theme');
const savedQueries = JSON.parse(localStorage.getItem('queries')) || [];
const queryList = document.getElementById('queryList');
const MAX_QUERIES = 5;

const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
};

function fetchWeatherData(location) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl).then(response => response.json()).then(data => {
        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}°C`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;

        todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', { weekday: 'long' });
        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' });
        todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
        todayTemp.textContent = todayTemperature;

        const locationElement = document.querySelector('.today-info > div > span');
        locationElement.textContent = `${data.city.name}, ${data.city.country}`;

        const weatherDescriptionElement = document.querySelector('.today-weather > h3');
        weatherDescriptionElement.textContent = todayWeather;

        const todayPrecipitation = `${data.list[0].pop}%`;
        const todayHumidity = `${data.list[0].main.humidity}%`;
        const todayWindSpeed = `${data.list[0].wind.speed} km/h`;

        const dayInfoContainer = document.querySelector('.day-info');
        dayInfoContainer.innerHTML = `

            <div>
                <span class="title">PRECIPITATION</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            <div>
                <span class="title">HUMIDITY</span>
                <span class="value">${todayHumidity}</span>
            </div>
            <div>
                <span class="title">WIND SPEED</span>
                <span class="value">${todayWindSpeed}</span>
            </div>

        `;

        const today = new Date();
        const nextDaysData = data.list.slice(1);

        const uniqueDays = new Set();
        let count = 0;
        daysList.innerHTML = '';
        for (const dayData of nextDaysData) {
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString('en', { weekday: 'short' });
            const dayTemp = `${Math.round(dayData.main.temp)}°C`;
            const iconCode = dayData.weather[0].icon;

            if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
                uniqueDays.add(dayAbbreviation);
                daysList.innerHTML += `
                
                    <li>
                        <i class='bx bx-${weatherIconMap[iconCode]}'></i>
                        <span>${dayAbbreviation}</span>
                        <span class="day-temp">${dayTemp}</span>
                    </li>

                `;
                count++;
            }

            if (count === 4) break;
        }
    }).catch(error => {
        alert(`Error fetching weather data: ${error} (Api Error)`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const defaultLocation = 'Germany';
    fetchWeatherData(defaultLocation);
});

locButton.addEventListener('click', () => {
    const location = prompt('Enter a location :');
    if (!location) return;
    fetchWeatherData(location);

    const newQuery = location;
    if (newQuery === '') {
      alert('Please enter a query.');
      return;
    }
    savedQueries.unshift(newQuery);
    if (savedQueries.length > MAX_QUERIES) {
      savedQueries.pop();
    }
    localStorage.setItem('queries', JSON.stringify(savedQueries));
    updateQueryList();
});

day.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.style.backgroundColor = '#649ebb';
    rInfo.style.backgroundColor = '#fff';
    rInfo.style.color = '#0e0e0e';
    rInfo.style.borderRadius = 25 + 'px';
    rInfo.style.position = 'relative';
    rInfo.style.float = 'right';
});

night.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.style.backgroundColor = '#37474f';
    rInfo.style.backgroundColor = '#232931';
    rInfo.style.color = '#fff';
    rInfo.style.borderRadius = 25 + 'px';
    rInfo.style.position = 'relative';
    rInfo.style.float = 'right';
});

updateQueryList();

function updateQueryList() {
    queryList.innerHTML = '';
    savedQueries.forEach((query, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'queryItem';
    listItem.textContent = query;
    listItem.addEventListener('click', () => restoreQuery(index));
    queryList.appendChild(listItem);
    });
  }

function restoreQuery(index) {
    const selectedQuery = savedQueries[index];
    alert(`Restoring data for query: ${selectedQuery}`);
    fetchWeatherData(selectedQuery);
}

