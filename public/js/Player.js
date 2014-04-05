function Player(name, board, controller) {

    this.name = name;
    this.board = board;
    this.controller = controller;

}

Player.prototype.createUnit = function(button, lane) {
    var unit = new Unit(this.name, button);
    if(lane === 'lowerLane') {
        this.board.lowerLane.units.push(unit);
    } else if(lane === 'middleLane') {
        this.board.middleLane.units.push(unit);
    } else if(button === 'upperLane') {
        this.board.uperLane.units.push(unit);
    }

}

Player.prototype.controlAction = function() {
    var time = new Date(),
        timeSinceLastAction = time - this.lastAction;

    if(this.lastAction == null || timeSinceLastAction > 200) {
        this.lastAction = new Date();
        this.controller.checkAction(this)
    }
}