window.onload = function () {
  const socket = io();

  socket.on("received message", function (msg) {
    $("#board").append($("<p>").addClass("message").text(msg));
  });

  $("#send").on("click", function () {
    const msg = $("#msg").val();
    socket.emit("send message", msg);
    $("#board").append($("<p>").addClass("message sent").text(msg));
    $("#msg").val("");
  });
};