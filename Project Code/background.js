var background = {

  init: function() {


	var Clock = {
	  totalSeconds: 0,

	  start: function () {
		var self = this;

		this.interval = setInterval(function () {
		  self.totalSeconds += 1;

			//show seconds in developer console
		  //console.log(self.totalSeconds);

			var countDown = parseInt(localStorage.getItem('countDown'));
			var hours = Math.floor(countDown / 3600)%24;
			var min = Math.floor(countDown / 60 % 60)%60;
			var sec = parseInt(countDown % 60)%60;

		if (hours < 10) {hours = "0" + hours; }
      	if (min < 10) {min = "0" + min;}
      	if (sec < 10) {sec = "0" + sec;}
      	if (hours) {hours = "00";}

		  //send counter to popup
		chrome.runtime.sendMessage({"timee": hours + ':' + min + ':' + sec});


		//save time in localstorage
		 localStorage.setItem('countDown', self.totalSeconds);
if (localStorage.getItem('websites') == "")
{
  localStorage.setItem('countDown', self.totalSeconds) = 0
};

			// if countDown is more than time to rest in site. Send message to content to redirect in other link.
		if(  parseInt(localStorage.getItem('countDown')) >=  60*parseInt(localStorage.getItem('time')) ){

				chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
					chrome.tabs.sendMessage(tabs[0].id, {"message": "alert"}, function(response) {});
				});

		}




		}, 1000);
	  },

	  pause: function () {
		clearInterval(this.interval);
		delete this.interval;
	  },

	  resume: function () {
		if (!this.interval) this.start();
	  }
	};

    chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

		if (request.activeWebsite) {

			  var sentUrl = parseURL(request.activeWebsite);

			  console.log(sentUrl);
			// If sent website form content is equal to inputed website form extension
			if (sentUrl['parent_domain'] == localStorage.getItem('websites')) {

				// console.log('true');

				if(localStorage.getItem('countDown') > 0){
					Clock.resume();
				}else{
					Clock.start();
				}


			}else{

				// console.log('false');
				Clock.pause();

			}


			chrome.runtime.sendMessage({"timee":localStorage.getItem('countDown')});
			// console.log("from backgorund ", request.activeWebsite);
		}
    });




 chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      //console.log("Message received", request);
      if (request.fn in background) {
        background[request.fn](request, sender, sendResponse);
      }

      //console.log('listen for messages ',this.websites);
    });
  },

  setWebsite: function(request, sender, sendResponse) {
	var url = request.website;
	var www = url.substring(0, 4);

	if (www != "www." && www != "http") {
      url =  "www." + url
	};
	var lastSumbol = url.substr(url.length - 1);

	if (lastSumbol != "/") {
		url = url + "/"
	};

	url = parseURL(url);
    localStorage.setItem('websites', url['parent_domain']);
    // $(document).ready(function () {
    //     $("#submit").click(function () {
    //         $("#submit").attr("disabled", true);
    //         return true;
    //     });
    // });
  },

//    window.getElementById("submit").click(function () {
//   window.getElementById("submit").attr("disabled", true);
//     //  $('#yourFormId').submit();
//   });
// },

  getWebsite: function(request, sender, sendResponse) {
    // console.log("get ", localStorage.getItem('websites'));
    sendResponse(localStorage.getItem('websites'));
  },

  setTime: function(request, sender, sendResponse) {
    // console.log(request.time);
    localStorage.setItem('time', request.time);

  },

  getCounter: function(request, sender, sendResponse) {

    sendResponse(localStorage.getItem('countDown'));
  },

  setCounter: function(request, sender, sendResponse) {

	 localStorage.setItem('countDown', request.time);
  },

  resetWebsite: function(request, sender, sendResponse) {

	 localStorage.setItem('websites', request.website);
  }

};
	function parseURL(url){
		parsed_url = {}

		if ( url == null || url.length == 0 )
			return parsed_url;

		protocol_i = url.indexOf('://');
		parsed_url.protocol = url.substr(0,protocol_i);

		remaining_url = url.substr(protocol_i + 3, url.length);
		domain_i = remaining_url.indexOf('/');
		domain_i = domain_i == -1 ? remaining_url.length - 1 : domain_i;
		parsed_url.domain = remaining_url.substr(0, domain_i);
		parsed_url.path = domain_i == -1 || domain_i + 1 == remaining_url.length ? null : remaining_url.substr(domain_i + 1, remaining_url.length);

		domain_parts = parsed_url.domain.split('.');
		switch ( domain_parts.length ){
			case 2:
			  parsed_url.subdomain = null;
			  parsed_url.host = domain_parts[0];
			  parsed_url.tld = domain_parts[1];
			  break;
			case 3:
			  parsed_url.subdomain = domain_parts[0];
			  parsed_url.host = domain_parts[1];
			  parsed_url.tld = domain_parts[2];
			  break;
			case 4:
			  parsed_url.subdomain = domain_parts[0];
			  parsed_url.host = domain_parts[1];
			  parsed_url.tld = domain_parts[2] + '.' + domain_parts[3];
			  break;
		}

		parsed_url.parent_domain = parsed_url.host + '.' + parsed_url.tld;

		return parsed_url;
	};

//startup
background.init();
