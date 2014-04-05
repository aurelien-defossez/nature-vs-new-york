function Unit(scene, player, type) {
    console.log('Player ' + player + ' is creating a ' + type);

    this.scene = scene;
    this.player = player;

    if(this.player === 'nature') {
        this.xPosition = 0.3;
    } else if(this.player === 'newYork') {
        this.xPosition = Game.config.lane.cellNumber - 0.3;
    }
	
	this.buildTime = Game.config.unit.buildTime * 1000
	this.built = false
	this.pending = true
	
    this.unit = new THREE.Mesh( new THREE.CubeGeometry(0.3,0.3,0.3),  new THREE.MeshBasicMaterial( { color: 0x333333 } ) );
    this.unit.position.x = this.xPosition;
    this.unit.position.y = 0.3;
    this.unit.position.z = -0.3;
    this.unit.castShadow = true;
    this.unit.receiveShadow = true;
    this.scene.add(this.unit);
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
		if(this.unit) {
			var newPositionX;
			if(this.player === 'nature') {
				newPositionX = dt * Game.config.unit.speed;
			} else if(this.player === 'newYork') {
				newPositionX = - dt * Game.config.unit.speed;
			}

			this.unit.translateX(newPositionX);
			this.xPosition = this.unit.position.x;
		}
	} else {
		this.building(time)
	}
}

Unit.prototype.destroy = function() {
    this.scene.remove(this.unit);
}