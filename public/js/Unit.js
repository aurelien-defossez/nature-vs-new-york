function Unit(scene, player, type) {
    console.log('Player ' + player + ' is creating a ' + type);

    this.scene = scene;
    this.player = player;

    if(this.player === HQ.typesEnum.NATURE) {
        this.xPosition = 0.3;
    } else if(this.player === HQ.typesEnum.NEW_YORK) {
        this.xPosition = Game.config.lane.cellNumber - 0.3;
    }

    this.unit = new THREE.Mesh( new THREE.CubeGeometry(0.3,0.3,0.3),  new THREE.MeshBasicMaterial( { color: 0x333333 } ) );
    this.unit.position.x = this.xPosition;
    this.unit.position.y = 0.3;
    this.unit.position.z = -0.3;
    this.unit.castShadow = true;
    this.unit.receiveShadow = true;
    this.scene.add(this.unit);

}

Unit.prototype.update = function(time, dt) {
    var newPositionX;
    if(this.player === HQ.typesEnum.NATURE) {
        newPositionX = dt * Game.config.unit.speed;
    } else if(this.player === HQ.typesEnum.NEW_YORK) {
        newPositionX = - dt * Game.config.unit.speed;
    }

    this.unit.translateX(newPositionX);
    this.xPosition = this.unit.position.x;
}

Unit.prototype.destroy = function() {
    this.scene.remove(this.unit);
}