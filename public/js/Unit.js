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
	
	this.buildTime = Game.config.unit.buildTime * 1000
	this.built = false
	this.pending = true
	
    this.cube = new THREE.Mesh( new THREE.CubeGeometry(0.3,0.3,0.3),  new THREE.MeshBasicMaterial( { color: 0x333333 } ) );
	this.cube.position.x = xPosition;
	this.cube.position.y = 0.3;
	this.cube.position.z = -0.3;
	this.cube.castShadow = true;
	this.cube.receiveShadow = true;
	this.scene.add(this.cube);
	
}

Unit.prototype.isBuilt = function(){
	return this.built
}
Unit.prototype.startBuild = function(){
	this.pending = false
}

Unit.prototype.building = function(time){
	if (!this.pending) {
		if (typeof(this.createTime)=="undefined"){
			this.createTime = time
		}
		this.built = time - this.createTime >= this.buildTime
	}
}

Unit.prototype.update = function(time, dt) {
	if (this.isBuilt()){
		var newPositionX;
		if(this.player === 'nature') {
			newPositionX = dt * Game.config.unit.speed;
		} else if(this.player === 'newYork') {
			newPositionX = - dt * Game.config.unit.speed;
		}
		this.cube.translateX(newPositionX);
	} else {
		this.building(time)
	}
    
}