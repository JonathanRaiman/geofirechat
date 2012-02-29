var Message = Backbone.Model.extend({});

var MessageStore = Backbone.Collection.extend({
 model: Message,
   url: 'http://geofirechat.heroku.com/messages'
});
var messages = new MessageStore;

var userlocations = [];

function pad2(number) {
   
     return (number < 10 ? '0' : '') + number
   
}

var MessageView = Backbone.View.extend({

   events: { "submit #chatForm" : "handleNewMessage" }

  , handleNewMessage: function(data) {
    var inputField =$('input[name=newMessageString]').val();
    $('input[name=newMessageString]').val('');
    $("#chatHistory").animate({ scrollTop: $("#chatHistory").attr("scrollHeight") }, 250);
    messages.create({content: inputField});
  }

  , render: function() {
  	var rerenderusers = false;
  	var i=0;
    var data = messages.map(function(message) {
    	//$("#chatterbox").attr('src','http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=200x200&center='+message.get('latitude')+','+message.get('longitude')+'&zoom=12&style=feature:road.local%7Celement:geometry%7Chue:0x00ff00%7Csaturation:100&style=feature:landscape%7Celement:geometry%7Clightness:-100');
    	var uniquelocation = true;
    	for (var l=0; l< userlocations.length; l++)
    		{
    		if (userlocations[l] == (message.get('latitude')+","+message.get('longitude')))
    			{
    			uniquelocation = false;
    			}
    		}
    	if (uniquelocation == true)
    		{
    		userlocations[i] = message.get('latitude')+","+message.get('longitude');
    		i++;
    		}
    	return '<span class="timeicon">'+message.get('receptiontime')+'</span>' + message.get('content') + '</br><img class="pin" src="location_pin.png"/><a>' + message.get('cityname')+ '</a></br>' 
    	});
    var result = data.reduce(function(memo,str) { return memo + str }, '');
    var usersbox = "";
    	for (var h=0; h<userlocations.length; h++)
    		{
    		usersbox= usersbox+"<img src='http://maps.googleapis.com/maps/api/staticmap?center="+userlocations[h]+"&zoom=2&format=png&sensor=false&size=300x100&maptype=roadmap&style=feature:road%7Csaturation:-99%7Clightness:-49&style=feature:water%7Csaturation:-27%7Clightness:-56&style=feature:transit.station%7Cvisibility:off&style=element:labels%7Cvisibility:off%7Cinvert_lightness:true%7Cgamma=0.32&style=element:feature:landscape.man_made%7Csaturation:-85%7Chue:0x00ffa2%7Clightness:56%7Cvisibility:off&style=feature:landscape%7Chue:0xf6ff00%7Csaturation:-99%7Cgamma:9.99&style=feature:poi.park%7Csaturation:45%7Clightness:-19%7Cgamma:0.99%7Chue:0x88ff00&style=feature:road.local%7Cgamma:0.99%7Chue:0x3bff00%7Csaturation:-55%7Clightness:-23' />";
    		}
    if ($("#usersbox").html() != usersbox)
    	{
    	$("#usersbox").html(usersbox);
    	}
    if ($("#usersbox").html() != result)
    	{
        $("#chatHistory").html(result);
        }
    return this;
  }

});

messages.bind('add', function(message) {
  messages.fetch({success: function(){view.render();}});
});

var view = new MessageView({el: $('#chatArea')});

setInterval(function(){
messages.fetch({success: function(){view.render();}});
},1000)

$(function () {
$('input[name=newMessageString]').focus();
});