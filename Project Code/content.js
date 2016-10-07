chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {


		if (request.message === "alert") {
			console.log('content');
			window.location = "http://google.com";
		}
  }
);
// chrome.tabs.getCurrent(function(tab){
//
//     }
// );

chrome.extension.sendRequest({ activeWebsite: window.location.href });



	window.setInterval(function(){

		var midnight = "0:0:0";
		var d = new Date();
		var h = d.getHours();
		var m = d.getMinutes();
		var s = d.getSeconds();
		var now = h + ":" + m +":" + s;

		if (now == midnight) {
			 chrome.runtime.sendMessage({
				fn: "setCounter",
				time: 0,
        // console.log(da),
        // alert("You can set your time in order to have access to the blocked website again!")
			});

			chrome.runtime.sendMessage({
				fn: "resetWebsite",
				website: "",
			});
      chrome.runtime.sendMessage({
        fn: "resetCounter",
        time: 0,
      });

			 // localStorage.setItem('countDown', 0);
		}
}, 1000);
