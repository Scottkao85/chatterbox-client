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
      _.each(data.results, app.addMessage);
    }
  });
}
app.clearMessages = function(){
  $('#chats').children().remove()
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
  $("#roomSelect").append('<div>' + room + '</div>')
}

app.addFriend = function(){

}

setInterval(function(){
  app.fetch("https://api.parse.com/1/classes/chatterbox")
},3000)

$('document').ready(function(){
  $('.send').on('click', function(){
    console.log("clicked")
    app.send({
      'username': getName(),
      'text': $('.input').val(),
      'roomname':'4chan'
    })
    $('.input').val("")
  })

  var getName = function(){
    return window.location.search.substring(10)
  }
})
