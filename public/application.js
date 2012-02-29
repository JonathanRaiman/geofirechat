var Message = Backbone.Model.extend({});

var MessageStore = Backbone.Collection.extend({
 model: Message,
   url: 'http://geofirechat.heroku.com/messages'
});
var messages = new MessageStore;

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
    var data = messages.map(function(message) { return message.get('content') + '\n(' + message.get('cityname')+ ')\n' });
    var result = data.reduce(function(memo,str) { return memo + str }, '');
    $("#chatHistory").text(result);
    $("#chatterbox").attr("src"="http://maps.googleapis.com/maps/api/staticmap?path=color:0x0000ff%7Cweight:5%7C40.737102,-73.990318%7C40.749825,-73.987963%7C40.752946,-73.987384%7C40.755823,-73.986397&size=512x512&sensor=false");
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