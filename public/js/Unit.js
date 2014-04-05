function Unit(scene, player, type) {
    console.log('Player ' + player + ' is creating a ' + type);
    var xPosition;
    
    this.scene = scene;
    this.player = player;
    
    if(this.player === 'nature') {
        xPosition = 0.3;
    } else if(this.player === 'newYork') {
        xPosition = Game.config.lane.cellNumber - 0.3;
    }
    
    this.cube = new THREE.Mesh( new THREE.CubeGeometry(0.3,0.3,0.3),  new THREE.MeshBasicMaterial( { color: 0x333333 } ) );
	this.cube.position.x = xPosition;
	this.cube.position.y = 0.3;
	this.cube.position.z = -0.3;
	this.cube.castShadow = true;
	this.cube.receiveShadow = true;
	this.scene.add(this.cube);
    
}

Unit.prototype.update = function(time, dt) {
    var newPositionX;
    if(this.player === 'nature') {
        newPositionX = dt * Game.config.unit.speed / 1000;
    } else if(this.player === 'newYork') {
        newPositionX = - dt * Game.config.unit.speed / 1000;
    }
    
    this.cube.translateX(newPositionX);
}