var colors = {
    sapCarrier: 0x65F255,
    wolf: 0x909090,
    bear: 0x75450D,
    ent: 0x006106
}

function Unit(scene, player, type) {
    console.log('Player ' + player + ' is creating a ' + type);

    var unitConfig = Game.config.units[type]
    
    this.scene = scene;
    this.player = player;
    this.type = type;
    this.direction = (this.player === HQ.typesEnum.NATURE) ? 1 : -1;
    this.hp = unitConfig.hp;
    this.speed = unitConfig.speed;
    this.attack = unitConfig.attack;
    this.attackBuilding = unitConfig.attackBuilding;

    if(this.player === HQ.typesEnum.NATURE) {
        this.xPosition = 0.3/2;
    } else if(this.player === HQ.typesEnum.NEW_YORK) {
        this.xPosition = Game.config.lane.cellNumber - 0.3/2;
    }
	this.pending = true
	this.cost = Game.config.unit.cost
    this.buildDelay = unitConfig.time;
}

Unit.prototype.startBuild = function(){
    this.pending = false
}

Unit.prototype.isBuilt = function(time){
    return this.buildDelay <= 0
}
Unit.prototype.runUnit = function(){
	this.unit = new THREE.Mesh( new THREE.CubeGeometry(0.3,0.3,0.3),  new THREE.MeshBasicMaterial( { color: colors[this.type] } ) );
    this.unit.position.x = this.xPosition;
    this.unit.position.y = 0.3/2;
    this.unit.position.z = -0.3/2;
    this.unit.castShadow = true;
    this.unit.receiveShadow = true;
    this.scene.add(this.unit);
}

Unit.prototype.update = function(time, dt) {
    if (this.isBuilt()){
        this.unit.translateX(this.speed * this.direction * dt);
        this.xPosition = this.unit.position.x;
    } else if (!this.pending) {
        this.buildDelay -= dt
    }
}

Unit.prototype.destroy = function() {
    this.scene.remove(this.unit);
}
