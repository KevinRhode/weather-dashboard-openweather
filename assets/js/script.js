const owmApiKey = '860cd0e67781ab3ddf5d8196167f8981';
const today = dayjs();
const searchForm = document.querySelector('.search');
const belowForm = document.querySelector('#cities');
const currentForcastEl = document.querySelector('.city-forcast');
const fiveDayForcastEl = document.querySelector('.city-5day-forcast');
let arrayOfCities = ['Detroit','Las Vegas','New York','Orlando','Denver','San Francisco','Austin','Seattle'];



function init(){
    document.querySelector('.search').addEventListener('submit',handlesearch);
    
    //check for search history
    let searchHistory;

    try {
      searchHistory = JSON.parse(localStorage.getItem('openWeatherHistory'));
    } catch (error) {
      
    }

    if (searchHistory !== null) {
      for (let i = 0; i < searchHistory.cities.length; i++) {
        const element = searchHistory.cities[i];
        let btnToAdd = document.createElement('button');
        btnToAdd.addEventListener('click',handleCordTranslate);
        //btnToAdd.classList('cityBtn');
        btnToAdd.textContent = element;
        belowForm.appendChild(btnToAdd);    
      }  
    }
    

    //add extra buttons
    for (let index = 0; index < arrayOfCities.length; index++) {
        if (belowForm.children.length >= 8) {
          return;
        }
        const element = arrayOfCities[index];
        let btnToAdd = document.createElement('button');
        btnToAdd.addEventListener('click',handleCordTranslate);
        //btnToAdd.classList('cityBtn');
        btnToAdd.textContent = element;
        belowForm.appendChild(btnToAdd);        
        
    }


}

function handlesearch(event){
    event.preventDefault();
    handleCordTranslate();
}

function handleCordTranslate(event){
    let inputText;
    if (event === undefined) {
        inputText = document.querySelector('#txtLocation').value;   
        
    } else if (event.target.localName == 'button'){

        inputText = event.target.innerText;

    }
    
   if (inputText === "") {
    let txtbox = document.querySelector('#txtLocation');
    
    txtbox.placeholder = "Enter Real City"
    return
   }
  
    

    let requestUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${inputText}&limit=1&appid=${owmApiKey}`;
    fetch(requestUrl)
      .then(function(response){
        return response.json();
      })
      .then(function(data){
        if (data.length === 0) {
            let grabTextBox = document.querySelector('#txtLocation');
            grabTextBox.value = "";
            grabTextBox.placeholder = "Enter Real City"
        } else {
            saveHistory(inputText);
            displayHistory(inputText);
            handleCurrentWeather(data);
        }
        
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
        // currentForcastEl.appendChild(locationName);

        let weatherIcon = document.createElement('img');
        weatherIcon.alt="Weather Icon";
        weatherIcon.src=`http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
        // currentForcastEl.append(weatherIcon);
                
        let divContainerHeader = document.createElement('div');
        divContainerHeader.classList.add('city-forcast-header')
        divContainerHeader.append(locationName);
        divContainerHeader.append(weatherIcon);
        currentForcastEl.append(divContainerHeader);

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

function displayHistory(searchWord){
  let oldHistory = [];

  for (let i = 0; i < belowForm.children.length; i++) {
    const element = belowForm.children[i];
    oldHistory.push(element.textContent);
    
  }
  
  belowForm.children[0].textContent = searchWord;

  for (let index = 0; index < (oldHistory.length -1 ); index++) {
    const element = oldHistory[index];
    belowForm.children[(index+1)].textContent = element;

    
  }
}

function saveHistory(searchWord){

  let cities = [searchWord];
  let objC = {cities}
  let searchHistory;
  try {
    searchHistory = JSON.parse(localStorage.getItem('openWeatherHistory'));

    if (searchHistory['cities'].length === 8) {
      searchHistory['cities'].shift();
    }

    searchHistory['cities'].push(searchWord);


    localStorage.setItem('openWeatherHistory',JSON.stringify(searchHistory));

  } catch (error) {
    localStorage.setItem('openWeatherHistory',JSON.stringify(objC));
  }
  



}

init();

// openweathermap api key 860cd0e67781ab3ddf5d8196167f8981