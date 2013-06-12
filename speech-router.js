(function (global) {
	var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g,
		optionalParam = /\((.*?)\)/g,
		namedParam    = /(\(\?)?:\w+/g,
		splatParam    = /\*\w+/g;

	function SpeechRouter(routes) {
		this.routes = [];
		for (var key in routes) {
			this.routes.push({
				regex: this._convertRouteToRegExp(key),
				callback: this[routes[key]] || routes[key]
			});
		}

		var self = this, resultCount = 0;
		this._recognition = new webkitSpeechRecognition();
		this._recognition.continuous = true;
		this._recognition.onresult = function (event) {
			self.route(event.results[resultCount++][0].transcript.trim());
		};
	};

	SpeechRouter.prototype = {
		_convertRouteToRegExp: function _convertRouteToRegExp(key) {
			key = key.replace(escapeRegExp, "\\$&")
				.replace(optionalParam, "(?:$1)?")
				.replace(namedParam, function (match, optional) {
					return optional ? match : "(\\w+)";
				})
				.replace(splatParam, "(.*?)");
			return new RegExp("^" + key + "$", "i");
		},
	
		route: function route(transcript) {
			for (var i = 0; i < this.routes.length; i++) {
				var result = this.routes[i].regex.exec(transcript);
				if (result && result.length) {
					result.splice(0, 1);
					this.routes[i].callback.apply(this, result);
				}
			}
		},
	
		start: function start() {
			this._recognition.start();
		},

		stop: function stop() {
			this._recognition.stop();
		}
	};
	
	global.SpeechRouter = SpeechRouter;
})(this);