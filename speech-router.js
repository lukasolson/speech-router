var SpeechRouter = (function () {
	if (typeof webkitSpeechRecognition === "undefined") return null;
	
	var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g,
		optionalParam = /\((.*?)\)/g,
		namedParam    = /(\(\?)?:\w+/g,
		splatParam    = /\*\w+/g,
		convertFormatToRegExp = function (format) {
			format = format
				.replace(escapeRegExp, "\\$&")
				.replace(optionalParam, "(?:$1)?")
				.replace(namedParam, function (match, optional) {
					return optional ? match : "(\\w+)";
				})
				.replace(splatParam, "(.*?)");
			return new RegExp("^" + format + "$", "i");
		},
		trigger = function (transcript) {
			console.log(transcript);
			for (var i = 0; i < routes.length; i++) {
				var result = routes[i].regex.exec(transcript);
				if (result && result.length) {
					result.splice(0, 1);
					routes[i].callback.apply(routes[i].context, result);
				}
			}
		};
	
	var speechRecognition = new webkitSpeechRecognition(),
		routes = [],
		recognizing = false;
	
	speechRecognition.continuous = true;
//	speechRecognition.interimResults = true;
	
	speechRecognition.onresult = function (event) {
		var finalTranscript = ""; //, interimTranscript = "";
		for (var i = event.resultIndex; i < event.results.length; i++) {
//			if (event.results[i].isFinal) {
				finalTranscript += event.results[i][0].transcript;
//			} else {
//				interimTranscript += event.results[i][0].transcript;
//			}
		}
		trigger(finalTranscript.trim()); // + interimTranscript);
	};

	function SpeechRouter(properties) {
		if (!properties) return;
		
		for (var property in properties) {
			this[property] = properties[property];
		}
		this.route(properties["routes"]);
	}

	SpeechRouter.prototype = {
		route: function (format, callback) {
			if (typeof format === "object") {
				var routesObj = format;
				for (var format in routesObj) {
					this.route(format, routesObj[format]);
				}
			} else {
				routes.push({
					regex: convertFormatToRegExp(format),
					callback: this[callback] || callback,
					context: this
				});
			}
		},
		
		trigger: function (transcript) {
			trigger(transcript);
		},

		start: function () {
			if (!recognizing) {
				recognizing = true;
				speechRecognition.start();
			}
		},

		stop: function () {
			if (recognizing) {
				recognizing = false;
				speechRecognition.stop();
			}
		}
	};
	
	return SpeechRouter;
})();