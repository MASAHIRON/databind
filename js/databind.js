var Binder = function (viewModelTemp) {
    this.observerlist = {};
    this.init(viewModelTemp);
}

Binder.prototype.subscribe = function (event, fn, context) {
    this.callbacks || (this.callbacks = {});
    this.callbacks[event] = {
        fn: fn,
        context: context || this
    };
};

Binder.prototype.publish = function (event) {
    this.callbacks[event]['fn'].call(this.callbacks[event]['context'], arguments);

};

Binder.prototype.init = function (temp) {

    for(var key in temp){
        this[key] = temp[key];
    }
    console.log(this)

    var elements = document.querySelectorAll('[data-bind-view]');
    for(var i = 0, il = elements.length; i < il; i++){
        var key = elements[i].getAttribute('data-bind-view');
        this.observerlist[key] = {
            el: elements[i],
            value: '',
            set: function (val) {
                this.value = val;
                this.notifyRender();
            },
            get: function () {
                return this.value
            },
            notifyRender: this.notifyRender
        }
    }
};

Binder.prototype.getObserver = function (key) {
    return this.observerlist[key];
}

Binder.prototype.addBinding = function (viewModel) {
    for(var key in viewModel['items']){
        this.observerlist[key]['value'] = viewModel['items'][key];
        this.subscribe(key, this.observerlist[key]['set'], this.observerlist[key]);
        viewModel['items'][key]['event'] = key;
    }
};

Binder.prototype.observable = function (context) {
    var self = this;
    var _context = context;
    function observable (val) {
        if(val !== undefined){
            _context = val;
            self.publish(observable['event'], val)
            return this;
        }else{
            return _context
        }
    }
    return observable;
};

Binder.prototype.notify = function (val) {
    console.log(val, this)
//    var observer = this.getObserver(event);
//    observer.set(val);
};


var Model = function () {
    this.record = {
        atk: 50,
        def: 100
    }
};

Model.prototype = {
    records: {
        atk: '100',
        def: '50'
    },
    init: function () {

    },

    fetch: function () {

    },

    get: function () {
        return this.record;
    },

    set: function () {

    }
}


var ViewModel = function (binder) {
    this.items = {
        atk: binder.observable('100'),
        def: binder.observable('200')
    }
    this.getModel = function () {

        var model = new Model();
        var data = model.get();
        this.setModel(data);
    };
    this.setModel = function (data) {
        for(var key in data){
            this.items[key](data[key]);
        }
    };
    binder.addBinding(this);
};

var v = new ViewModel( new Binder({
    notifyRender: function () {
        console.log(this)
        this.el.innerText = this.value[1];
    }
    })
);

v.getModel();
v.items['atk']('500')
v.items['def']('10000')
console.log(v)

