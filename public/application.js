var Message = Backbone.Model.extend({});

var MessageStore = Backbone.Collection.extend({
 model: Message,
   url: 'http://geofirechat.heroku.com/messages'
});
var messages = new MessageStore;

var userlocations = [];

var MessageView = Backbone.View.extend({

   events: { "submit #chatForm" : "handleNewMessage" }

  , handleNewMessage: function(data) {
  	var currentTime = new Date();
  	var seconds = currentTime.getSeconds();
  	var minutes = currentTime.getMinutes();
  	var hours = currentTime.getHours();
  	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
    var inputField ="At "+hours+":"+minutes+":"+seconds+" : "+$('input[name=newMessageString]').val();
    $('input[name=newMessageString]').val('');
    $("#chatHistory").animate({ scrollTop: $("#chatHistory").attr("scrollHeight") }, 250);
    messages.create({content: inputField});
  }

  , render: function() {
  	var rerenderusers = false;
  	var i=0;
    var data = messages.map(function(message) {
    	//$("#chatterbox").attr('src','http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=200x200&center='+message.get('latitude')+','+message.get('longitude')+'&zoom=12&style=feature:road.local%7Celement:geometry%7Chue:0x00ff00%7Csaturation:100&style=feature:landscape%7Celement:geometry%7Clightness:-100');
    	for (var l=0; l< userlocations.length; l++)
    		{
    		var uniquelocation = true;
    		if (userlocations[l] == (message.get('latitude')+","+message.get('longitude')))
    			{
    			uniquelocation = false;
    			}
    		}
    	if (uniquelocation == true)
    		{
    		rerenderusers = true;
    		userlocations[i] = message.get('latitude')+","+message.get('longitude');
    		i++;
    		}
    	return message.get('content') + '\n(' + message.get('cityname')+ ')\n' 
    	});
    var result = data.reduce(function(memo,str) { return memo + str }, '');
    if (rerenderusers == true)
    	{
    	for (var h=0; h<userlocations.length; h++)
    		{
    		$("#usersbox").append("<img src='http://maps.googleapis.com/maps/api/staticmap?sensor=false&size=200x50&center="+userlocations[h]+"&zoom=12&style=feature:road.local%7Celement:geometry%7Chue:0x00ff00%7Csaturation:100&style=feature:landscape%7Celement:geometry%7Clightness:-100' />");
    		}
    	}
    $("#chatHistory").text(result);
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