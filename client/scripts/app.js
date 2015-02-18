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
      _.each(app.messages[app.currentRoom], app.addMessage);
    }
  });
}
app.clearMessages = function(){
  $('#chats').children().remove()
}

app.rooms = {'4chan' : '4chan'};

app.currentRoom = '4chan';

app.messages = {length: 1,
                '4chan': [],
                };

var compareMessages = function(messages){
  for(var i = 0; i < messages.length; i++){
    var name = messages[i].roomname;
    var hasDuplicate = false;
    if(app.messages[name] === undefined){
      app.messages[name] = [];
      console.log(name);
      app.addRoom(name);
    }
    for(var j = 0; j < app.messages[messages[i].roomname].length; j++){
      var itext = messages[i].text;
      var jtext = app.messages[messages[i].roomname][j].text;
      if(itext === jtext){
        hasDuplicate = true;
      }
    }
    if(!hasDuplicate){
      app.messages[messages[i].roomname].push({message: messages[i], alreadyShown: false});
    }
  }
}

// var compareMessages = function(messages){
//   //debugger;
//   for(var i = 0; i < messages.length; i++) {
//     var hasDuplicate = false;
//     for(var j = 0; j < app.messages.length; j++){
//       var itext = messages[i].text;
//       var jtext = app.messages[j].text;
//       if (itext === jtext) {
//         hasDuplicate = true;
//       }
//     }
//     if(!hasDuplicate){
//       app.messages.push(messages[i]);
//     }
//   }
// }

app.addMessage = function(message){
  if (!message.alreadyShown){
    var messageData = message.message;
    var container = $('<p class="chat"></p>');
    var chatTime = $('<span class="date"></span>').text("[" + messageData.createdAt + "] ");
    var userName = $('<span class="username"></span>').text(messageData.username + ": ");
    var chatText = $('<span class="messageText"></span>').text(messageData.text);
    container.append(chatTime);
    container.append(userName);
    container.append(chatText);
    $('#chats').prepend(container);
    $('.username').on('click', function(){
      console.log(this);
      app.addFriend($(this).text().substring(0, $(this).text().length - 2)); //.attr('class')
    })
  }
}

app.addRoom = function(room){
  var newRoom = $('<button class="roomname">').attr('id', room).text(room);
  $("#roomSelect").append(newRoom);
  $("#" + room).on('click', function(){
    app.currentRoom = $(this).attr('id');
    app.clearMessages();
  })
}

app.addFriend = function(friendName){
  $('#friendlist').append($('<div>').attr('class', 'friend').text(friendName));
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
      'roomname': app.currentRoom,
    })
    $('.input').val("")
  }

  $('.addRoom').on('click', function(){
    app.addRoom($('.chatRoom').val())
  })

  $('.roomname').on('click', function(){
    app.currentRoom = $(this).attr('id')
    app.clearMessages()
  })

  $('.send').on('click', handleSubmit);

})










