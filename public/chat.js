const socket = io()

// initialize:
// Code in document ready or DOMContentLoaded will only run once (DOM) is ready for JavaScript code to execute. 
// Code in window load will run once the entire page (images or iframes), not just the DOM, is ready.

window.addEventListener('load', () => {
  console.log('Entering window.load')

  // access important elements in code............
  const formElement = $("#chatform")[0];  // jQuery CSS selectors return an array - use the first
  const messageElement = $("#m")[0];      // jQuery CSS selectors return an array - use the first

  // configure event listeners (use action - NOT ON action)......
  formElement.addEventListener('submit', submitfunction);   // onsubmit = "return submitfunction();"
  messageElement.addEventListener('keyup', notifyTyping);   // onkeyup = "notifyTyping();"
  /*formElement.addEventListener('submit', function(){
    insertImage();
  });*/

  // additional initialization.........
  const name = makeid();
  $('#user').val(name);
  // emit a chatMessage event from the System along with a message
  socket.emit('chatMessage', 'System', '<b>' + name + '</b> has joined the discussion');

  console.log('Exiting window.load')
})

// utility function to create a new random user name....
function makeid() {
  let text = ''
  text = prompt("What is your name?");
  /*const possible = 'abcdeghijklmnoprstuwxy'
  for (let i = 0; i < 5; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }*/
  return text
}


// emit a new chatMessage event from the client......
function submitfunction() {
  let from = $('#user').val()
  let message = $('#m').val()
  if (message !== '') {
    if (message.indexOf("/image") == 0) {
      message = message.substring(6,message.length);
      message = '<img src="' + message + '" height=50% width=50%>';
      socket.emit('chatMessage', from, message);
    }
    else if (message.indexOf("/link") == 0) {
      message = message.substring(5,message.length);
      message = '<a href="' + message + '">' + message + '</a>';
      socket.emit('chatMessage', from, message); 
    }
    else if (message.indexOf("/bold") == 0) {
      message = message.substring(5,message.length);
      message = '<b>' + message + '</b>';
      socket.emit('chatMessage', from, message); 
    }
    else if (message.indexOf("/big") == 0) {
      message = message.substring(4,message.length);
      message = '<h1>' + message + '</h1>';
      socket.emit('chatMessage', from, message);
    }
    else {
      socket.emit('chatMessage', from, message);
    }
  }
    
  // what language and selector is used below?
  // set the value to an empty string and
  // focus on the message box again
  $('#m').val('').focus()
  return false; // don't refresh
}

// emit a new notifyUser event from the client.........
function notifyTyping() {
  let user = $('#user').val()
  socket.emit('notifyUser', user)
}

//Insert Image
/*function insertImage() {
  if ($("input:first").val() === "Hello") {
    alert("Hello");
  }
}*/

// how to react to a chatMessage event.................
socket.on('chatMessage', function (from, msg) {
  const me = $('#user').val()
  const color = (from === me) ? 'green' : '#009afd'
  from = (from === me) ? 'Me' : from
  $('#messages').append('<li><b style="color:' + color + '">' + from + '</b>: ' + msg + '</li>')
})

// how to react to a notifyUser event.................
socket.on('notifyUser', function (user) {
  const me = $('#user').val()
  if (user !== me) {
    $('#notifyUser').text(user + ' is typing ...')
  }
  // 10 seconds after typing stops, set the notify text to an empty string
  setTimeout(function () { $('#notifyUser').text('') }, 10000)
})



