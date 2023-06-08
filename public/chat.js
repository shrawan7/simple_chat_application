$(function(){
	var socket = io.connect()

	var message = $("#message")
	var username = $("#username")
	var send_message = $("#send_message")
	var send_username = $("#send_username")
	var chatroom = $("#chatroom")
	var feedback = $("#feedback")

	send_message.click(function(){
		socket.emit('new_message', {message : message.val()})
	})

	let counter = 0;

	socket.on("new_message", (data) => {
		feedback.html('');
		message.val('');

		const backgroundColor = counter % 2 === 0 ? '#E5E4E2' : '#D3D3D3';
		counter++;
		chatroom.append("<p class='message' style='background-color: " + backgroundColor + "; padding: 10px; border-radius: 10px;'><span style='color: red;'>" + data.username + "</span>: " + data.message + "</p>");

		//chatroom.append("<p class='message' style='background-color: " + backgroundColor + ";'><span style='color: red;'>" + data.username + "</span>: " + data.message + "</p>");
	});

	  

	send_username.click(() => {
		socket.emit('change_username', {username : username.val()})
	})

	message.bind("keypress", () => {
		socket.emit('typing')
	})

	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
});


