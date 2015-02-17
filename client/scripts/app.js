// YOUR CODE HERE:

var app = {}
app.init = function(){}
app.send = function(message){
  $.ajax({
    type: "POST",
    url: "https://api.parse.com/1/classes/chatterbox",
    datatype: "json",
    data: JSON.stringify(message) ,
    success: function(){
      console.log("success");
    }
  });
}
app.fetch = function(url){
  $.ajax({
    type: "GET",
    url: url + '?order=-createdAt',
    datatype: "json",
    success: function(data){
      compareMessages(data.results);
      _.each(app.messages, app.addMessage);
    }
  });
}
app.clearMessages = function(){
  $('#chats').children().remove()
}

app.rooms = {'4chan' : '4chan'};

app.messages = [{}];

// (app.message[i].text === )
var compareMessages = function(messages){
  //debugger;
  for(var i = 0; i < messages.length; i++) {
    var hasDuplicate = false;
    for(var j = 0; j < app.messages.length; j++){
      var itext = messages[i].text;
      var jtext = app.messages[j].text;
      if (itext === jtext) {
        hasDuplicate = true;
      }
    }
    if(!hasDuplicate){
      app.messages.push(messages[i]);
    }
  }
}

app.addMessage = function(message){
  var container = $('<p class="chat"></p>');
  var chatTime = $('<span class="date"></span>').text("[" + message.createdAt + "] ");
  var userName = $('<span class="username"></span>').text(message.username + ": ");
  var chatText = $('<span class="messageText"></span>').text(message.text);
  container.append(chatTime);
  container.append(userName);
  container.append(chatText);
  $('#chats').prepend(container);
}

app.addRoom = function(room){
  $("#roomSelect").append('<span id="' + room + '">' + room + '</span>')
}

app.addFriend = function(){

}

setInterval(function(){
  app.fetch("https://api.parse.com/1/classes/chatterbox")
},3000)

$('document').ready(function(){
  var getName = function(){
    return window.location.search.substring(10)
  }
  var handleSubmit = function(){
    app.send({
      'username': getName(),
      'text': $('.input').val(),
      'roomname':'4chan'
    })
    $('.input').val("")
  }

  $('.addRoom').on('click', function(){
    app.addRoom($('.chatRoom').val())

  })

  $('.send').on('click', handleSubmit);
})
