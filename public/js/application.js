$(document).ready(function() {
  bindEvents();
  chart();
});

function bindEvents() {
  $('#add-food-button').on('submit', Server.addItem)
  $('.delete').on('click', Server.removeItem)
}

var Server = (function(){
  function addItem(event){
   event.preventDefault();
   $.ajax({
    url: '/add_food',
    type: 'POST',
    data: $('#add-food-button').serialize()
  }).done(View.addViewData).fail(function(){alert("Item Not Found!")});
 };

 function removeItem(evt){
   evt.preventDefault();
   var id = $(this).closest('li').data('foodId');
   $.ajax({
    url: '/add_food/' + id, 
    type: 'DELETE'
  }).done(View.removeViewData).fail(function(){alert("Item Not Found!")});
 };

 return {
  addItem: addItem,
  removeItem: removeItem
}
})();

var View = (function(){

  String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  }    

  function addViewData(res){
    var link = $('<a>').addClass('delete').text('Delete').on('click', Server.removeItem)
    var newLi = $('<li>')
    .data('foodId', res.food_id)
    .text(res.food_name.capitalize() + ' Calories: ' + res.calories + '  ')
    .append(link); 
    $("#" + res.day).append(newLi);

    var parseCalTotal = $("#" + "container-" + res.day).find("p").text();
    var num = parseCalTotal.replace( /^\D+/g, '');
    var number = parseInt(num) + parseInt(res.calories)
    $("#" + "container-" + res.day).find("p").text("Total Calories: " + number);
    chart();
  }

  function removeViewData(res){
    var id = JSON.parse(res).id;
    var day = JSON.parse(res).day;
    var calories =  JSON.parse(res).calories;
    var itemToRemove = $('li').filter(function(i,e) {
      return $(e).data('foodId') == id;
    });
    itemToRemove.remove();
    var parseCalTotal = $("#container-" + day + " p").text();
    var num = parseCalTotal.replace( /^\D+/g, '');
    var number = parseInt(num) - parseInt(calories)
    $("#" + "container-" + day).find("p").text("Total Calories: " + number);
    chart();
  }
  return {
    addViewData: addViewData,
    removeViewData: removeViewData
  }
})();


function chart(){
  var chartjsData = [];
  var parseSunday = parseInt($("#container-Sunday p").text().replace( /^\D+/g, ''));
  var parseMonday =  parseInt($("#container-Monday p").text().replace( /^\D+/g, ''));
  var parseTuesday = parseInt($("#container-Tuesday p").text().replace( /^\D+/g, ''));
  var parseWednesday = parseInt($("#container-Wednesday p").text().replace( /^\D+/g, ''));
  var parseThursday = parseInt($("#container-Thursday p").text().replace( /^\D+/g, ''));
  var parseFriday = parseInt($("#container-Friday p").text().replace( /^\D+/g, ''));
  var parseSaturday = parseInt($("#container-Saturday p").text().replace( /^\D+/g, ''));
  chartjsData.push(parseSunday, parseMonday, parseTuesday, parseWednesday, parseThursday, parseFriday, parseSaturday)

  var barChartData = {
    labels :["Sunday","Monday","Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],datasets : [
    {
      fillColor : "rgba(172,194,132,0.4)",
      strokeColor : "rgba(220,220,220,1)",
      data : chartjsData
    }
    ]
  };

  var myLine = new Chart(document.getElementById("canvas").getContext("2d")).Bar(barChartData);
}
