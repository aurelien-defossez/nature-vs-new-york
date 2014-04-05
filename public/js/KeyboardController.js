
function KeyboardController(player) {
    this.player = player;

    this.buttons = {
        a: 0,
        b: 0,
        x: 0,
        y: 0,
        up: 0,
        down: 0,
        r: 0
    }
}

KeyboardController.prototype.pressKey = function(key) {
    this.updateKey(key, 1);
    this.performAction();
}

KeyboardController.prototype.releaseKey = function(key) {
    this.updateKey(key, 0);
}

KeyboardController.prototype.updateKey = function(key, value) {
    switch(key) {
        case 'input0':
            this.buttons.a = value;
            break;
        case 'input1':
            this.buttons.b = value;
            break;
        case 'input2':
            this.buttons.x = value;
            break;
        case 'input3':
            this.buttons.y = value;
            break;
        case 'up':
            this.buttons.up = value;
            break;
        case 'down':
            this.buttons.down = value;
            break;
        case 'shoulder' :
            this.buttons.r = value;
            break;
    }
}

KeyboardController.prototype.performAction = function() {

    if(this.buttons.a) {
        this.arrowAction('A')
    } else if(this.buttons.b) {
        this.arrowAction('B')
    } else if(this.buttons.x) {
        this.arrowAction('X')
    } else if(this.buttons.y) {
        this.arrowAction('Y')
    }

}

KeyboardController.prototype.arrowAction = function(button) {
    var lane;
    if( this.buttons.up ) {
        lane = 2;
    } else if ( this.buttons.down ) {
        lane = 0;
    } else {
        lane = 1;
    }
    // Building mode
    if (this.buttons.r) {
        this.player.createBuilding(button, lane);
    } else {
        this.player.createUnit(button, lane);
    }
}