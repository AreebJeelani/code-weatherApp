let Base_URL =
  "https://api.weatherapi.com/v1/current.json?key=c16ee36e51794dc584091826250511&q=Srinagar&aqi=no";
let search = document.querySelector(".search input");
let not_found = document.querySelector("#not_found");
let start_section = document.querySelector("#start_section");
let main_section = document.querySelector("#main_section");
search.addEventListener("keyup", (evt) => {
  if (evt.key == "Enter") {
    search_city();
  }
});
let search_city = async () => {
  let city = search.value;
  let location_url = `https://api.weatherapi.com/v1/current.json?key=c16ee36e51794dc584091826250511&q=${city}&aqi=no`;
  let forecast_url = `https://api.weatherapi.com/v1/forecast.json?key=c16ee36e51794dc584091826250511&q=${city}&days=3&aqi=no`;
  try {
    let response = await fetch(location_url);
    let result = await response.json();
    let forecast_response = await fetch(forecast_url);
    let forecast_result = await forecast_response.json();
    console.log(result);
    console.log(forecast_result);

    if (result.error) {
      toShow(not_found);
    } else {
      toShow(main_section); // determines which section to be shown
      let temp = document.querySelector(".temp h2");
      temp.textContent = result.current.temp_c + "℃";
      let locate = document.querySelector(".city h4");
      locate.textContent = result.location.name;
      let humidity = (document.querySelector(".humidity h4").textContent =
        result.current.humidity);
      let windSpeed = (document.querySelector(".wind h4").textContent =
        result.current.wind_kph);
      // weather conditions for the present day.
      let iconValue = result.current.condition.icon;
      let icon = (document.querySelector(
        ".icon"
      ).style.backgroundImage = `url(${iconValue})`);
      // local time or date of the place searched.
      let localtime_epochInSecs = result.location.localtime_epoch * 1000; // *1000 done bcoz we need in milliseconds and returned is in secs.
      let lctnDate = new Date(localtime_epochInSecs).toDateString();
      // there are a lot of to.String methods based on your choices.
      let date = (document.querySelector("#date").textContent = lctnDate);

      // condition of the weather.
      let condition = (document.querySelector(".temp h3").textContent =
        result.current.condition.text);
      //writing for the temperatures of the forecast section.
      const next = document.querySelectorAll(".next h5");
      for (let j = 0; j <= 2; j++) {
        next[j].textContent =
          forecast_result.forecast.forecastday[j].day.avgtemp_c + "℃";
      }
      //writing the date of the forecast section.
      const futureDates = document.querySelectorAll(".next h6");
      for (let i = 0; i <= 2; i++) {
        const followEpoch =
          forecast_result.forecast.forecastday[i].date_epoch * 1000;
        const followDate = new Date(followEpoch).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
        futureDates[i].textContent = followDate;
      }
      //getting the icons of the future condition.
      let futureIcon = document.querySelectorAll(".next div");
      for (let k = 0; k <= 2; k++) {
        let futureIconLink =
          forecast_result.forecast.forecastday[k].day.condition.icon;
        futureIcon[k].style.backgroundImage = `url(${futureIconLink})`; // if it wasnt written in backticks , it would be = plain text.
      }
    }
  } catch (err) {
    console.log(err);
  }
};
function toShow(show) {
  //hide all , this piece of code is literally goted.
  not_found.classList.add("hidden");
  main_section.classList.add("hidden");
  start_section.classList.add("hidden");
  // which section to show
  show.classList.remove("hidden");
}
