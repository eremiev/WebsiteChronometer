var console = chrome.extension.getBackgroundPage().console;

var app = {

  init: function() {
    var website = document.getElementById("text");
    var button = document.getElementById("submit");
    var timer = document.getElementById("time");
    var buttonTime = document.getElementById("btn-time");
    document.getElementById("time").style.display = 'none';
    document.getElementById("btn-time").style.display = 'none';


   // chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

		// if(request.hide){
		// console.log(request.hide);
		// }
	// });


  chrome.runtime.sendMessage({
    fn: "getWebsite"
  }, function(response) {

    if (response) {
  var timeElapsed = 0;

  if(response != "" ){
      website.style.display = 'none';
       button.style.display = 'none';
  }
      document.getElementById("chosen").innerHTML = response;
      document.getElementById("time").style.display = 'block';
      document.getElementById("btn-time").style.display = 'block';

    }
  });
    // chrome.runtime.sendMessage({
    //   fn: "Disable"
    // },


	var elapsed = document.getElementById("elapsed").innerHTML;
	//check if is empty elapsed div to get from localstorage counter
	if(elapsed == 0){

		chrome.runtime.sendMessage({
		fn: "getCounter"
		}, function(response) {

			if (response) {
				document.getElementById("elapsed").innerHTML = response;
			}
      if(response != "" ){
          buttonTime.style.display = 'none';
           timer.style.display = 'none';
      }
      });
	}

	 chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	  if(request.timee){
		  document.getElementById("elapsed").innerHTML = request.timee;
	  }

      //console.log('listen for messages ',this.websites);
    });

    //when click button for add url
    button.addEventListener("click", function() {
      //console.log("button clicked", website.value);
      document.getElementById("submit").style.display='none';
      document.getElementById("text").style.display='none';
      document.getElementById("time").style.display = 'none';
      document.getElementById("btn-time").style.display = 'none';

      chrome.runtime.sendMessage({
        fn: "setWebsite",
        website: website.value
      });

	  chrome.runtime.sendMessage({
        fn: "setCounter",
        time: 0
      });

      chrome.runtime.sendMessage({
        fn: "getWebsite"
      }, function(response) {
        document.getElementById("chosen").innerHTML = response;

        if (response) {
          document.getElementById("time").style.display = 'block';
          document.getElementById("btn-time").style.display = 'block';

        }
      });
    });

    buttonTime.addEventListener("click", function() {
      var time = parseInt(document.getElementById("time").value);
      document.getElementById("time").style.display='none';
      document.getElementById("btn-time").style.display='none';
      chrome.runtime.sendMessage({
        fn: "setTime",
        time: time
      });

      // var timer = document.getElementById("timer");
      //
      // chrome.runtime.sendMessage({
      //   fn: "startTimer",
      //   duration: 60*5,
      //   display:timer
      // });
    });


  }

};


//app start
document.addEventListener("DOMContentLoaded", function() {
  app.init();
});
