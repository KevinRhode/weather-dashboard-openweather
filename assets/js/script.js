const owmApiKey = '860cd0e67781ab3ddf5d8196167f8981';
const today = dayjs();
const currentForcastEl = document.querySelector('.city-forcast');
const fiveDayForcastEl = document.querySelector('.city-5day-forcast');



function init(){
    document.querySelector('.search').addEventListener('submit',handlesearch);
}

function handlesearch(event){
    event.preventDefault();
    handleCordTranslate();
}

function handleCordTranslate(){
    let inputText = document.querySelector('#txtLocation').value;
    let requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${inputText}&limit=1&appid=${owmApiKey}`;
    fetch(requestUrl)
      .then(function(response){
        return response.json();
      })
      .then(function(data){
        handleCurrentWeather(data);
      });
}

function handleCurrentWeather(info){
    //clear forcast of previous request
    currentForcastEl.innerHTML='';
    currentForcastEl.setAttribute('style','')

    let requestUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${info[0].lat}&lon=${info[0].lon}&units=imperial&appid=${owmApiKey}`
    fetch(requestUrl)
      .then(function(response){
        return response.json();
      })
      .then(function(data){
        //current weather

        // data.name for location name
        let locationName = document.createElement('h3');
        locationName.textContent = data.name + " " + today.format('(M/D/YYYY)');
        currentForcastEl.appendChild(locationName);
                
        // data.main.temp
        let locationMainTemp = document.createElement('p');
        locationMainTemp.textContent = "Temp: " + data.main.temp + " \u00B0F";
        currentForcastEl.appendChild(locationMainTemp);
        
        // data.wind.speed
        let locationWindSpeed = document.createElement('p');
        locationWindSpeed.textContent = "Wind: " +data.wind.speed + " MPH";
        currentForcastEl.appendChild(locationWindSpeed);
        
        // data.main.humidity
        let locationMainHumidity = document.createElement('p');
        locationMainHumidity.textContent = "Humidity: " + data.main.humidity + " %";
        currentForcastEl.appendChild(locationMainHumidity);

        currentForcastEl.setAttribute('style','border:3px solid #3E000C');


      });
    handleFiveDayForcast(info)
}
function handleFiveDayForcast(info){

    let requestUrl = `api.openweathermap.org/data/2.5/forecast?lat=${info[0].lat}&lon=${info[0].lon}&appid=${owmApiKey}`;
    fetch(requestUrl)
      .then(function (response){
        return response.json()
      })
      .then(function (data){

        for (let index = 0; index < data.length; index++) {
            
            
        }

      });


}

init();

// openweathermap api key 860cd0e67781ab3ddf5d8196167f8981