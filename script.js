$(document).ready(function() {
  $("#search-button").on("click", function() {
    var searchValue = $("#search-value").val().trim();

    // clear input box
    $("#search-value").val("");

    searchWeather(searchValue);
  });

  $(".history").on("click", "li", function() {
    searchWeather($(this).text());
  });

  function makeRow(text) {
    var li = $("<li>").addClass("list-group-item list-group-item-action").text(text);
    $(".history").append(li);
  }

  function searchWeather(searchValue) {
    var apiKey = "bdc52f64afd883566cab72d748eec127";
    $.ajax({
      type: "GET",         
      url: "http://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&appid=" + apiKey + "&units=imperial",
      dataType: "json",
      success: function(data) {
        // create history link for this search
        if (history.indexOf(searchValue) === -1) {
          history.push(searchValue);
          window.localStorage.setItem("history", JSON.stringify(history));
          //console.log(history)

          makeRow(searchValue);
        }
        
        // clear any old content
        $("#today").empty();
        
        var wind = data.wind.speed;
        var humidity = data.main.humidity;
        var tempLow = data.main.temp_min;
        var tempHigh = data.main.temp_max;
        

        // create html content for current weather
        var title = $("<h3 class = card-header>").text(data.name + " (" + new Date().toLocaleDateString() + ")");
        var card = $("<div class =\"card bg-dark text-white\">");
        var wind = $("<p class= card-text>").text("Wind Speed: " + wind + " mph");
        var humid = $("<p class= card-text>").text("Humidity: " + humidity + "%");
        var temp1 = $("<p class = card-text>").text("Current High: " + tempHigh + " °F");
        var temp2 = $("<p class = card-text>").text("Current Low: " + tempLow + " °F");
        var cardBody = $("<div class = card-body>");
        var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

        //add to the page
        title.append(img);
        cardBody.append(title, temp1, temp2, humid, wind);
        card.append(cardBody);
        $("#today").append(card);

        // call follow-up api endpoints
        getForecast(searchValue);
      }
    });
  }
  
//Get Started 
  function getForecast(searchValue){
    var apiKey = "bdc52f64afd883566cab72d748eec127";
    var url = ("http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + apiKey + "&units=imperial");
    $.ajax({
      type: "GET",         
      url: "http://api.openweathermap.org/data/2.5/forecast?q=" + searchValue + "&appid=" + apiKey + "&units=imperial",
      dataType: "json",
      success: function(data) {
        console.log(url);
        //resets forecast
        $("#forecast").html("<h4 class=\"mt-3\">Your 5 Day Forecast for " + searchValue + "</h4>").append("<div class=\"row\">");

        //loops through each day and retreives data from api
        for(var i = 0; i < data.list.length; i++){
          if (data.list[i].dt_txt.indexOf("12:00:00") !== -1){    
                    
            // create html content for future weather
            var col = $("<div class = col-md-2>");
            var card = $("<div class =\"card bg-dark text-white\">")
            var body = $("<div class =\"card-body p-2\">");
            var title = $("<h5 class = card-title>").text(new Date(data.list[i].dt_txt).toLocaleDateString());
            var img = $("<img>").attr("src", "http://openweathermap.org/img/w/" + data.list[i].weather[0].icon + ".png" );
            var p1 = $("<p class = card-text>").text("The High: " + data.list[i].main.temp_min + " °F");
            var p2 = $("<p class = card-text>").text("The Low: " + data.list[i].main.temp_max + " °F");
            var p3 = $("<p class = card-text>").text("Humidity: " + data.list[i].main.humidity + "%");

            //add to the page
            col.append(card);
            card.append(body);
            body.append(title, img, p1, p2, p3);
            $("#forecast .row").append(col);

          }
        };
      }
    });
  };

  //saves our city search history to local storage
  var history = JSON.parse(window.localStorage.getItem("history")) || [];
  if (history.length > 0) {
    searchWeather(history[history.length-1])
  }
  for (var i = 0; i <history.length; i++) {
    makeRow(history[i]);
  }
});
