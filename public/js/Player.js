function Player(name, board, controller) {

    this.name = name;
    this.board = board;
    this.controller = controller;

    // Time in ms between two actions
    this.timeBetweenActions = 200;

}

Player.prototype.createUnit = function(button, laneIndex) {
    var lane = this.board.lanes[laneIndex],
        unit = new Unit(lane.scene, this.name, button);

    lane.units.push(unit);
}

Player.prototype.controlAction = function() {
    var time = new Date(),
        timeSinceLastAction = time - this.lastAction;

    if(this.lastAction == null || timeSinceLastAction > this.timeBetweenActions) {
        this.lastAction = new Date();
        this.controller.checkAction(this)
    }
}