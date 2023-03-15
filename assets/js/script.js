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

        let weatherIcon = document.createElement('img');
        weatherIcon.alt="Weather Icon";
        weatherIcon.src=`http://openweathermap.org/img/w/${data.weather[0].icon}.png`;

        // currentForcastEl.append(weatherIcon);
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

        // sets border around content on screen
        currentForcastEl.setAttribute('style','border:3px solid #3E000C');


      });
    handleFiveDayForcast(info)
}
function handleFiveDayForcast(info){


    fiveDayForcastEl.innerHTML='';

    // try {
    //     let forecast = document.querySelector('.city-5day-forcast-card-container');
    //     forecast.innerHTML='';
    // } catch (error) {
    //     //did not contain an existing dom
    // }

    let requestUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${info[0].lat}&lon=${info[0].lon}&units=imperial&appid=${owmApiKey}`;
    fetch(requestUrl)
      .then(function (response){
        return response.json()
      })
      .then(function (data){

        let fiveHeader = document.createElement('h3');
        fiveHeader.textContent = "5-Day Forecast: "
        fiveDayForcastEl.appendChild(fiveHeader);

        let fiveContainer = document.createElement('div');
        fiveContainer.classList.add("city-5day-forcast-card-container");
        fiveDayForcastEl.appendChild(fiveContainer);


        for (let index = 0; index < data.list.length; index++) {
            
            //continue
            let checkDateTime = dayjs(data.list[index].dt_txt);
            // console.log("checkDateTime: ",checkDateTime);
            if (checkDateTime.$H === 12) {
                //get forcast for the next day at noon
                let forcastCard = document.createElement('div');
                forcastCard.classList.add("city-5day-forcast-card");

                // Date
                let locationDate = document.createElement('h3');
                locationDate.textContent = checkDateTime.format('M/D/YYYY');
                forcastCard.appendChild(locationDate);

                //icon
                
                let weatherIcon = document.createElement('img');
                weatherIcon.alt="Weather Icon";
                weatherIcon.src=`http://openweathermap.org/img/w/${data.list[index].weather[0].icon}.png`;
                forcastCard.appendChild(weatherIcon);
                        
                // data.main.temp
                let locationMainTemp = document.createElement('p');
                locationMainTemp.textContent = "Temp: " + data.list[index].main.temp + " \u00B0F";
                forcastCard.appendChild(locationMainTemp);
                
                // data.wind.speed
                let locationWindSpeed = document.createElement('p');
                locationWindSpeed.textContent = "Wind: " +data.list[index].wind.speed + " MPH";
                forcastCard.appendChild(locationWindSpeed);
                
                // data.main.humidity
                let locationMainHumidity = document.createElement('p');
                locationMainHumidity.textContent = "Humidity: " + data.list[index].main.humidity + " %";
                forcastCard.appendChild(locationMainHumidity);

                fiveContainer.appendChild(forcastCard);
            }                   
        }

      });


}

init();

// openweathermap api key 860cd0e67781ab3ddf5d8196167f8981