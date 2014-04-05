function Player(name, board, controller) {

    this.name = name;
    this.board = board;
    this.controller = controller;
    this.controllerType = "gamepad";

    // Time in ms between two actions
    this.timeBetweenActions = 200;

}

Player.prototype.createUnit = function(button, laneIndex) {
    this.board.popMonster(Game.config.controls[this.controllerType][button], laneIndex, this.name)
}

Player.prototype.createBuilding = function(button, laneIndex) {
    this.board.popBuilding(Game.config.controls[this.controllerType][button], laneIndex, this.name)
}



Player.prototype.controlAction = function() {
    var time = new Date(),
        timeSinceLastAction = time - this.lastAction;

    if(this.lastAction == null || timeSinceLastAction > this.timeBetweenActions) {
        this.lastAction = new Date();
        this.controller.checkAction(this)
    }
}