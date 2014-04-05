function Player(name, board, controller) {

    this.name = name;
    this.board = board;
    this.controller = controller;

}

Player.prototype.createUnit = function(button, laneIndex) {
    var lane = this.board.lanes[laneIndex],
        unit = new Unit(lane.scene, this.name, button);

    lane.units.push(unit);
}

Player.prototype.controlAction = function() {
    this.controller.checkAction(this)
}