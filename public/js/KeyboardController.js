
function KeyboardController() {
    this.player
    this.displayMana = false;

    this.buttons = {
        a: 0,
        b: 0,
        x: 0,
        y: 0,
        up: 0,
        down: 0,
        r: 0
    }

    this.buttonSaveState = {
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
    this.performAction();

}

KeyboardController.prototype.updateKey = function(key, value) {
    console.log("key : "+key +", value : "+ value)
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
        case 'bumper' :
            this.displayMana = value;
            break;
    }
    if (this.displayMana){
        this.player.displayManaCount()
    }else{
        this.player.hideManaCount()
    }
}

KeyboardController.prototype.performAction = function() {

    if(this.buttons.a) {
        if (this.buttonSaveState.a != this.buttons.a ){
            console.log("key : A");
            this.arrowAction('A')
        }
    }
    this.buttonSaveState.a = this.buttons.a
    if(this.buttons.b) {
        if (this.buttonSaveState.b != this.buttons.b ){
            console.log("key : B");
            this.arrowAction('B') 
        }
    }
    this.buttonSaveState.b = this.buttons.b
    if(this.buttons.x) {
        if (this.buttonSaveState.x != this.buttons.x){
            console.log("key : X");
            this.arrowAction('X')
        }
    }
    this.buttonSaveState.x = this.buttons.x
    if(this.buttons.y) {
        if (this.buttonSaveState.y != this.buttons.y){
            console.log("key : Y");
            this.arrowAction('Y')
        }
    }
    this.buttonSaveState.y = this.buttons.y
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
