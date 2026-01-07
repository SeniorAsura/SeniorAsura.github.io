
const input = document.querySelector('input');
const button = document.querySelector('button');
const locEl = document.querySelector('.location');
const dateEl = document.querySelector('.date');
const iconEl = document.querySelector('.icon');
const tempEl = document.querySelector('.temp');
const details = document.querySelectorAll('.details div');
const dailyEls = document.querySelectorAll('.daily-forecast .day');
const hourlyEl = document.querySelector('.hours');


function getIcon(code){
  if(code===0) return '☀️';
  if(code<=2) return '🌤️';
  if(code===3) return '☁️';
  if(code>=51&&code<=55) return '🌦️';
  if(code>=61&&code<=65) return '🌧️';
  return '❓';
}

// 3. Click button to search
button.onclick = function(){
  const city = input.value;
  if(city===''){ alert('Type a city!'); return; }

  // 4. Get city coordinates
  fetch('https://geocoding-api.open-meteo.com/v1/search?name='+city)
    .then(res => res.json())
    .then(data => {
      if(!data.results){ alert('City not found!'); return; }
      const loc = data.results[0];

      // 5. Get weather using coordinates
      fetch('https://api.open-meteo.com/v1/forecast?latitude='+loc.latitude+'&longitude='+loc.longitude+'&current_weather=true&daily=temperature_2m_max,weathercode&hourly=temperature_2m&timezone=auto')
        .then(res => res.json())
        .then(weather => {

          // 6. Update current weather
          locEl.textContent = loc.name+', '+loc.country;
          dateEl.textContent = new Date().toDateString();
          iconEl.textContent = getIcon(weather.current_weather.weathercode);
          tempEl.textContent = Math.round(weather.current_weather.temperature)+'°';
          details[0].textContent = 'Feels Like: '+Math.round(weather.current_weather.temperature)+'°';
          details[1].textContent = 'Humidity: 50%';
          details[2].textContent = 'Wind: '+Math.round(weather.current_weather.windspeed)+' km/h';
          details[3].textContent = 'Precipitation: 0 mm';

          // 7. Update daily forecast
          weather.daily.temperature_2m_max.forEach((t,i)=>{
            if(!dailyEls[i]) return;
            const day = new Date(weather.daily.time[i]).toDateString().split(' ')[0];
            dailyEls[i].children[0].textContent = day;
            dailyEls[i].children[1].textContent = getIcon(weather.daily.weathercode[i]);
            dailyEls[i].children[2].textContent = Math.round(t)+'°';
          });

          // 8. Update hourly forecast
          hourlyEl.innerHTML='';
          weather.hourly.temperature_2m.slice(0,12).forEach((t,i)=>{
            const h = new Date(weather.hourly.time[i]).getHours();
            const label = h>12?(h-12)+' PM':h+' AM';
            hourlyEl.innerHTML+='<div class="hour"><div>'+label+'</div><div>'+Math.round(t)+'°</div></div>';
          });

        });
    });
};
