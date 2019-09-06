var get_json = function(value, evt_name) {
  var round_value = function(evt) {
    // round value
    return (before_round = Math.round(evt));
  };

  var calculate_date = function(evt) {
    // function for calculate human readable date
    var my_date = new Date(evt * 1000);
    return my_date.toGMTString().slice(17, 22); // calculate redable date
  };

  var to_upper_case = function(evt) {
    // up to first letter description
    return evt.charAt(0).toUpperCase() + evt.slice(1);
  };

  var deg_to_compass = function(evt) {
    // calculate deg to cardinal direction
    var val = Math.floor(evt / 45 + 0.6);
    var arr = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    return arr[val % 8];
  };

  var lost_deg = function(evt) {
    // if JSON package lost data (direction of wind), change string.
    if (evt === undefined) {
      return "Prędkość wiatru:";
    } else {
      return "Prędkość wiatru | kierunek:";
    }
  };

  var day_of_the_week = function(evt) {
    var input_date = new Date(evt);
    var output_day = input_date.getDay();
    return {
      day: [
        "Niedziela",
        "Poniedziałek",
        "Wtorek",
        "Środa",
        "Czwartek",
        "Piątek",
        "Sobota"
      ][output_day], //returns readable day of the week
      color: output_day //returns day number
    };
  };

  // scroll
  window.onscroll = function() {
    scrollFunction();
  };

  var scrollFunction = function() {
    if (
      document.body.scrollTop > 3000 ||
      document.documentElement.scrollTop > 3000
    ) {
      document.getElementById("go_top").style.display = "block";
    } else {
      document.getElementById("go_top").style.display = "none";
    }
  };

  if (evt_name === "today") {
    var xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      `https://api.openweathermap.org/data/2.5/weather?q=${value}&lang=pl&units=metric&APPID=27934ae1bf6fc9febb5efe59f95f74f6`
    );
    xhr.send(null);
    xhr.addEventListener("load", function() {
      if (xhr.status === 200) {
        var response_object = JSON.parse(xhr.responseText);

        var newContent = "";
        newContent += "<div>";
        var time = response_object.dt; // time
        newContent +=
          "<h1>" +
          response_object.name +
          " - " +
          response_object.sys.country +
          " | " +
          "godzina:" +
          " " +
          calculate_date(time) +
          "</h1>";
        var val_temperature = response_object.main.temp; // temperature
        newContent +=
          "<p>" +
          "<b>" +
          "Temperatura:" +
          "</b>" +
          " " +
          round_value(val_temperature) +
          "&#8451" +
          "</p>";
        var val_pressure = response_object.main.pressure; // under pressure
        newContent +=
          "<p>" +
          "<b>" +
          "Ciśnienie:" +
          "</b>" +
          " " +
          round_value(val_pressure) +
          " " +
          "hPa" +
          "</p>";
        newContent +=
          "<p>" +
          "<b>" +
          "Wilgotność:" +
          "</b>" +
          " " +
          response_object.main.humidity +
          " " +
          "%" +
          "</p>";
        var val_description = response_object.weather[0].description; // description
        newContent +=
          "<p>" +
          "<b>" +
          "Warunki:" +
          "</b>" +
          " " +
          to_upper_case(val_description) +
          "</p>";
        var wind_speed = response_object.wind.speed; // wind
        var wind_degrees = response_object.wind.deg; // degrees
        newContent +=
          "<p>" +
          "<b>" +
          lost_deg(wind_degrees) +
          "</b>" +
          " " +
          round_value(wind_speed) +
          " m/s" +
          " | " +
          deg_to_compass(wind_degrees) +
          "</p>";
        newContent += "</div>";

        document.getElementById("weather_today").innerHTML = newContent;
      } else {
        var error =
          "<p>" +
          "Jesteś pewny że istnieje takie miasto? Sprawdź jeszcze raz." +
          "</p>";
        document.getElementById("weather_today").innerHTML = error;
      }
    });
  } else if (evt_name === "five_days") {
    var xhr = new XMLHttpRequest();

    xhr.open(
      "GET",
      `https://api.openweathermap.org/data/2.5/forecast?q=${value}&lang=pl&units=metric&APPID=27934ae1bf6fc9febb5efe59f95f74f6`
    );
    xhr.send(null);
    xhr.addEventListener("load", function() {
      if (xhr.status === 200) {
        var response_object = JSON.parse(xhr.responseText);

        var err_search = document.getElementById("weather_five");
        while (err_search.firstChild) {
          err_search.removeChild(err_search.firstChild);
        }

        for (var i = 0; i < response_object.list.length; i++) {
          var create_div = document.createElement("div");
          create_div.id = "session" + [i];
          document.getElementById("weather_five").appendChild(create_div);

          var newContent = "";
          var time = response_object.list[i].dt_txt; // time

          if (i === 0) {
            newContent +=
              "<h1>" +
              response_object.city.name +
              " - " +
              response_object.city.country +
              " | " +
              "godzina:" +
              " " +
              time.slice(11, 16) +
              "</h1>";
          } else {
            var result = day_of_the_week(time); // function day_of_the_week returns object
            create_div.className = "color" + result.color;
            newContent +=
              "<h1>" +
              "<span>" +
              result.day +
              "</span>" +
              " | " +
              "godzina:" +
              " " +
              time.slice(11, 16) +
              "</h1>";
          }
          var val_temperature = response_object.list[i].main.temp; // temperature
          newContent +=
            "<p>" +
            "<b>" +
            "Temperatura:" +
            "</b>" +
            " " +
            round_value(val_temperature) +
            "&#8451" +
            "</p>";
          var val_pressure = response_object.list[i].main.pressure; // pressure
          newContent +=
            "<p>" +
            "<b>" +
            "Ciśnienie:" +
            "</b>" +
            " " +
            round_value(val_pressure) +
            " " +
            "hPa" +
            "</p>";
          newContent +=
            "<p>" +
            "<b>" +
            "Wilgotność:" +
            "</b>" +
            " " +
            response_object.list[i].main.humidity +
            " " +
            "%" +
            "</p>";
          var val_description = response_object.list[i].weather[0].description; // description
          newContent +=
            "<p>" +
            "<b>" +
            "Warunki:" +
            "</b>" +
            " " +
            to_upper_case(val_description) +
            "</p>";
          var wind_speed = response_object.list[i].wind.speed; // wind
          var wind_degrees = response_object.list[i].wind.deg; // degrees

          newContent +=
            "<p>" +
            "<b>" +
            "Prędkość wiatru | kierunek:" +
            "</b>" +
            " " +
            round_value(wind_speed) +
            " m/s" +
            " | " +
            deg_to_compass(wind_degrees) +
            "</p>";

          document.querySelector(
            "#weather_five div:last-child"
          ).innerHTML = newContent;
        }
      } else {
        var error =
          "<p>" +
          "Jesteś pewny że istnieje takie miasto? Sprawdź jeszcze raz." +
          "</p>";
        document.getElementById("weather_five").innerHTML = error;
      }
    });
  } else {
    alert("Próbujesz coś zepsuć?");
  }
};

document.getElementById("btn_today").addEventListener("click", function(evt) {
  var get_today = document.getElementById("city_today").value;
  var evt_name = evt.target.name;
  if (get_today.length <= 1) {
    document.getElementById("prompt_today").style.display = "block";
  } else {
    document.getElementById("prompt_today").style.display = "none";
    get_json(get_today, evt_name);
  }
});

document.getElementById("btn_five").addEventListener("click", function(evt) {
  var get_five = document.getElementById("city_five").value;
  var evt_name = evt.target.name;
  if (get_five.length <= 1) {
    document.getElementById("prompt_five").style.display = "block";
  } else {
    document.getElementById("prompt_five").style.display = "none";
    get_json(get_five, evt_name);
  }
});

document.getElementById("go_top").addEventListener("click", function() {
  document.body.scrollTop = 0; // Safari
  document.documentElement.scrollTop = 0; // Chrome and others
});
