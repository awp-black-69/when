(function(){

	function when(cb){
		if(!(this instanceof when)) {
			return new when(cb);
		}

		var th = this,
			this.listeners = [],
			this.catches = [],
			this.done = this.errored = false;

		cb(function(err, res){
			th.err = err;
			th.res = res;

			th.done = true;
			th.then();
		});
	}

	when.prototype = {
		then: function(fn){
			try {
				if(typeof fn == 'function')
					this.listeners.push(fn);

				if(this.done) {
					this.listeners.forEach(function(v){
						v(this.err, this.res);
					});
					this.listeners = [];
				}
			} catch (e) {
				this.err = e;
				this.errored = true;
				this.catch();
			}

			return this;
		},
		catch: function(fn){
			if(typeof fn == 'function')
				this.listeners.push(fn);

			if (this.errored) {
				this.catches.forEach(function(v){
					v(this.err);
				});
				this.catches = [];
			}

			return this;
		}
	};

})();