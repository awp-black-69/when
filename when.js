function when(cb){
	if(!(this instanceof when)) {
		return new when(cb);
	}

	var th = this;

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

when.prototype.then = function(fn){
	var th = this
		,chain
		,pastFirstWhen = false;
	try {
		if(typeof fn == 'function')
			this.listeners.push(fn);

		if(this.done) {

			this.listeners.forEach(function(v){
				chain = chain || v(th.err, th.res);
				if(pastFirstWhen && chain && chain instanceof when) chain.then(v);
				if(chain) pastFirstWhen = true;
				
			});
			this.listeners = [];
		}
	} catch (e) {
		this.err = e;
		this.errored = true;
		this.catch();
	}

	return this;
};
when.prototype.catch= function(fn){
	if(typeof fn == 'function')
		this.listeners.push(fn);

	if (this.errored) {
		this.catches.forEach(function(v){
			v(this.err);
		});
		this.catches = [];
	}

	return this;
};

when.all = function(whens){
	if(!(whens instanceof Array)) return false;

	var wnCount = 0
		,wn
		,errs = new Array(whens.length)
		,results = new Array(whens.length);

	return when(function(cb){
		for(var i=0; i<whens.length; i++) {
			wn = whens[i];
			wn.then(function(i, err, data){
				errs[i] = err;
				results[i] = data;
				wnCount++;
				if(wnCount == whens.length) {
					cb(errs, results);
				}
			}.bind(null, i));
		}
	});
};

when.delay = function(ms){
	return when(function(cb){
		setTimeout(cb, ms);
	});
};

module.exports = when;
