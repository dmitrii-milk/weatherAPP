'use strict';
document.addEventListener('DOMContentLoaded', () => {
 
   const searchElement = document.querySelector('.search');
   const wrapper = document.querySelector('.wrapper');

   const key = '304b9c8efaa34b618a7ec269925f94da';
   const searchBox = new google.maps.places.SearchBox(searchElement);
  
   searchBox.addListener('places_changed', () => {
      const place = searchBox.getPlaces()[0];

      if (place == null) {
         return;
      }

      const latitude = place.geometry.location.lat();
      const longitude = place.geometry.location.lng();

      console.log(latitude);
      console.log(longitude);

   
      fetch(`https://api.weatherbit.io/v2.0/current?&lat=${latitude}&lon=${longitude}&key=${key}`)
       .then(response => {
         if(response.status !== 200) {
            return new Promise(resolve => resolve(response.statusText))
         }
         return response.json();
       })
       .then(data => {

         if (typeof data === "string") { 
            weatherCard(null, data);
        }
        else {
            weatherCard(data.data[0]); // api response contains only 1 item in data array
        }
        })
       .catch(err => {
          weatherCard(null, "conect error");
        });
               
   });

   //Card

   const weatherCard = (data, error) => {

      if(error) {
         wrapper.innerHTML =  `
                        <section class="card">
                        <div close class="close">
                        </div>
                        <div class="cloud">
                           <img class="img" src="./style/img/icon.png   " alt="someImg">
                           <p class="subs">${error}</p>
                        </div>
                        </section>
                        `;
      }

      const {city_name, country_code, temp, pres, app_temp, uv, wind_spd, wind_cdir_full,sunrise, sunset, weather} = data;
      const {icon, description} = weather;
      const iconUrl = icon => `https://www.weatherbit.io/static/img/icons/${icon}.png`;

      wrapper.innerHTML = `
                              <section class="card">
                              <div close class="close">
                              </div>
                              <h2 class="city">${city_name}/${country_code}</h2>
                              <div class="sun">
                                 <span class="sunrise">Sunrise: ${sunrise}</span>
                                 <span class="sunset">Sunset: ${sunset}</span>
                              </div>
                              <div class="cloud">
                                 <img class="img" src="${iconUrl(icon)}" alt="someImg">
                                 <p class="subs">${description}</p>
                              </div>
                              <div class="temp">
                                 <p class="temp_def">Temperature: ${temp}&deg</p>
                                 <p class="temp_app">Feels like: ${app_temp}&deg</p>
                              </div>
                           <div>
                              <p class="pres">Pressure: ${pres} mb</p>
                              <p class="uv">UV Index: ${uv}</p>
                           </div>
                              
                              <div class="wind">
                                 <p class="wind_speed"> Wind speed: ${wind_spd} m/s </p>
                                 <p class="wind_direction">Wind direction: ${wind_cdir_full}</p>
                              </div>
      `; 
      close();
   };

   const close = () => {
      wrapper.addEventListener('click', (e) => {
         if(e.target.hasAttribute('close')) {
            wrapper.innerHTML = '';
         }
      });
   };


   
   
});








