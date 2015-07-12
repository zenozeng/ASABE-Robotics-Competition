require('yapcudino')({global: true});

function Manipulator() {
    this.position = 0;
}

// offset 为正则是向外
Manipulator.prototype.move = function(offsetSteps) {
    this.position += offsetSteps;
};

// usage: moveTo(0)
//        moveTo(100)
Manipulator.prototype.moveTo = function(position) {
    var offset = position - this.position;
    this.move(offset);
};
