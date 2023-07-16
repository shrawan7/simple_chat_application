$(function () {
	var socket = io.connect();
  
	var messageInput = $("#message");
	var fileInput = $("#file");
	var usernameInput = $("#username");
	var sendButton = $("#send_button");
	var sendUsername = $("#send_username")
	var chatroom = $("#chatroom");
	var feedback = $("#feedback");
  
	function sendMessage() {
		var message = messageInput.val();
		if (message !== "") {
			socket.emit("new_message", { type: "text", content: message });
			messageInput.val("");
		}
	}
  
	function sendFile(file) {
		if (file) {
			var reader = new FileReader();
			reader.onload = function (event) {
				var fileData = event.target.result;
				var fileInfo = {
					type: file.type,
					name: file.name,
					size: file.size,
					data: fileData.split(",")[1], // Extracting the base64 data
				};
				socket.emit("new_message", { type: "file", content: fileInfo });
			};
			reader.readAsDataURL(file);
			fileInput.val("");
		}
	}
  
	function formatFileSize(bytes) {
		if (bytes === 0) return "0 Bytes";
		var k = 1024;
		var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		var i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	}
  
	sendButton.on("click", function () {
		sendMessage();
	});
  
	messageInput.on("keypress", function (event) {
		if (event.which === 13) {
			sendMessage();
		}
	});
  
	socket.on("typing", function (data) {
	  	feedback.html("<p><i>" + socket.username + " is typing a message..." + "</i></p>");
	});

	sendUsername.click(() => {
		socket.emit('change_username', {username : usernameInput.val()});
	})

	messageInput.bind("keypress", () => {
		socket.emit('typing')
	})

	socket.on('typing', (data) => {
		feedback.html("<p><i>" + data.username + " is typing a message..." + "</i></p>")
	})
  
	fileInput.on("change", function () {
		var file = fileInput[0].files[0];
		sendFile(file);
	});
  
	socket.on("new_message", function (data) {
		feedback.html("");
		var messageContent = "";
		var backgroundColor = chatroom.children().length % 2 === 0 ? "#E5E4E2" : "#D3D3D3";

		if (data.type === "text") {
			messageContent = data.username + ": " + data.content;
		} else if (data.type === "file") {
			var fileInfo = data.content;
			if (fileInfo.type.startsWith("image/")) {
				messageContent =
				data.username +
				" sent a photo: <br>" +
				"<img src='data:" +
				fileInfo.type +
				";base64," +
				fileInfo.data +
				"' alt='" +
				fileInfo.name +
				"' style='max-width: 100%; max-height: auto;' />";
			} else {
				messageContent =
				data.username +
				": " +
				"<a href='data:" +
				fileInfo.type +
				";base64," +
				fileInfo.data +
				"' download='" +
				fileInfo.name +
				"'>" +
				fileInfo.name +
				"</a><br>" +
				"Size: " +
				formatFileSize(fileInfo.size);
			}
		}
  
	  	chatroom.append(
			"<p class='message' style='background-color: " +
			backgroundColor +
			"; padding: 10px; border-radius: 10px;'>" +
			messageContent +
			"</p>"
	  	);
	}); 
});
