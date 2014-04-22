var colors = {
    sapCarrier: 0x65F255,   // Light green
    wolf: 0x909090,         // Grey
    bear: 0x75450D,         // Brown
    ent: 0x006106,          // Dark green
    builder: 0xF5B507,      // Orange
    lumberjack: 0xAB1F91,   // Purple
    policeman: 0x2626AB,    // Dark blue
    mecha: 0xB81D1D         // Red
}

function Unit(scene, player, type, loader, hq) {
    var unitConfig = Game.config.units[type]

    this.phase = "walk"
    this.scene = scene;
    this.player = player;
    this.type = type;
    this.hq = hq
    this.direction = (this.player === HQ.typesEnum.NATURE) ? 1 : -1;
    this.hp = unitConfig.hp;
    this.speed = unitConfig.speed;
    this.attack = unitConfig.attack;
    this.buildingAttack = unitConfig.buildingAttack;
    this.width = unitConfig.width;
    this.cooldown = unitConfig.cooldown;
    this.cooldownTimer = 0
    this.deathAnimationFinished = false

    console.log('Player ' + player + ' is creating a ' + type);

    if(this.player === HQ.typesEnum.NATURE) {
        this.xPosition = 0.3/2;
    } else if(this.player === HQ.typesEnum.NEW_YORK) {
        this.xPosition = Game.config.lane.cellNumber - 0.3/2;
    }
	this.pending = true
	this.cost = Game.config.unit.cost
	this.buildTime = unitConfig.time
    this.buildDelay = unitConfig.time

    this.animations = {}
    this.currentAnimation = null

    fileName = Game.config.units[type].modelFile

    if (fileName)
    { 
        this.loadUnit(loader, this.type, fileName)
    }else{
        this.mesh = new THREE.Mesh( new THREE.CubeGeometry(this.width, this.width, this.width),
        new THREE.MeshBasicMaterial( { color: colors[this.type] } ) );
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }
}

Unit.prototype.loadUnit = function(loader, name, fileName)
{
    var self = this
    if (!window.getModel(name))
    {

        loader.load(fileName, function(geometry, materials) {
            window.models.push({name:self.type, geometry:geometry, materials:materials})
            self.unitLoaded(self.type)
        })
    } else 
    {
        this.unitLoaded(name)
    }

}

Unit.prototype.unitLoaded = function(name)
{
    var model = window.getModel(name)

    this.mesh = new THREE.SkinnedMesh(model.geometry, new THREE.MeshFaceMaterial(model.materials))
    this.mesh.castShadow = true
    this.mesh.receiveShadow = true

    var materials = this.mesh.material.materials
    for (var k in materials)
    {
        materials[k].skinning = true
    }

    for (var i = 0; i < this.mesh.geometry.animations.length; ++i)
    {
        if (THREE.AnimationHandler.get(this.mesh.geometry.animations[i].name) == null)
            THREE.AnimationHandler.add(this.mesh.geometry.animations[i])
    }

    this.animations.walk = new THREE.Animation(this.mesh, this.type+"_walk", THREE.AnimationHandler.CATMULLROM)
    this.animations.walk.loop = true
    this.animations.idle = new THREE.Animation(this.mesh, this.type+"_idle", THREE.AnimationHandler.CATMULLROM)
    this.animations.idle.loop = true
    this.animations.death = new THREE.Animation(this.mesh, this.type+"_death", THREE.AnimationHandler.CATMULLROM)
    this.animations.death.loop = false
    if (this.type == "builder"){
        this.animations.working = new THREE.Animation(this.mesh, this.type+"_working", THREE.AnimationHandler.CATMULLROM)
        this.animations.working.loop = true
    }
    this.currentAnimation = this.animations.walk
    this.currentAnimation.play()

}

Unit.prototype.startBuild = function(){
    this.pending = false
}

Unit.prototype.activate = function(){
    return this.buildDelay = 0
}

Unit.prototype.setPosition = function(x) {
    if (this.mesh) {
        this.mesh.position.x = x
        this.xPosition = x
    }
}

Unit.prototype.isBuilt = function(time){
    return this.buildDelay <= 0
}

Unit.prototype.hide = function(time){
    if (this.mesh) {
        this.mesh.visible = true
    }
}

Unit.prototype.runUnit = function(){
    if (!this.mesh)
        return;
    this.mesh.position.z = - 0.3 * 0.5
    this.mesh.position.x = this.xPosition
    this.mesh.rotation.y = Math.PI/2
    if (this.player == "newYork"){
        this.mesh.rotation.y = -Math.PI/2
    }
    this.scene.add(this.mesh);
	/*this.unit = new THREE.Mesh( new THREE.CubeGeometry(0.3,0.3,0.3),  new THREE.MeshBasicMaterial( { color: colors[this.type] } ) );
    this.unit.position.x = this.xPosition;
    this.unit.position.y = 0.3/2;
    this.unit.position.z = -0.3/2;
    this.unit.castShadow = true;
    this.unit.receiveShadow = true;
    this.scene.add(this.unit);*/
}

Unit.prototype.switchAnimation = function(phase){
    if (this.capturing) {
        this.capturing = false
        this.hq.captureSpeed[this.lane.id] -= Game.config.units.builder.captureSpeed
    }

    this.phase = phase

    if (this.currentAnimation){
        this.currentAnimation.stop()
        this.currentAnimation = null
    }

    if (phase == "walk"){
        this.currentAnimation = this.animations.walk
        this.capturing = false
    } else if ( phase == "wait"){
        this.currentAnimation = this.animations.idle
        this.capturing = false
    } else if ( phase == "build"){
        this.currentAnimation = this.animations.working
        this.capturing = true
        this.hq.captureSpeed[this.lane.id] += Game.config.units.builder.captureSpeed
    } else if ( phase == "die"){
         this.currentAnimation = this.animations.death
         this.capturing = false
    }

    if (this.currentAnimation) {
        this.currentAnimation.play(0)
    }
}

Unit.prototype.willCollideWith = function(bounds, dt) {
    var unitBounds = this.getBounds(this.speed * this.direction * dt)

    return this.direction > 0 && unitBounds.right > bounds.left && unitBounds.right < bounds.right
        || this.direction < 0 && unitBounds.left > bounds.left && unitBounds.left < bounds.right
}

Unit.prototype.getBounds = function(offset) {
    offset = offset || 0
    return {
        left: this.xPosition - this.width * 0.5 + offset,
        right: this.xPosition + this.width * 0.5 + offset
    }
}

Unit.prototype.update = function(time, dt) {
    if (this.currentAnimation != null) {
        this.currentAnimation.update(dt)
        if (this.currentAnimation.data.name == this.type+"_death" && !this.currentAnimation.isPlaying) {
            this.deathAnimationFinished = true;
        }
    }
}

Unit.prototype.startCooldown = function() {
    this.cooldownTimer = this.cooldown
}

Unit.prototype.isReady = function() {
    return !this.capturing && this.cooldownTimer <= 0
}

Unit.prototype.hit = function(points) {
    this.hp -= points

    if (this.hp <= 0) {
        this.destroy()

        musicManager.playSfx(this.type + "Death")
        return true
    }
}

Unit.prototype.move = function(dt) {
    if (this.mesh) {
        this.mesh.position.x = this.mesh.position.x + this.speed * this.direction * dt
        this.xPosition = this.mesh.position.x
    }
}

Unit.prototype.destroy = function() {
    if (this.capturing) {
        this.capturing = false
        this.hq.captureSpeed[this.lane.id] -= Game.config.units.builder.captureSpeed
    } 
    this.switchAnimation("die")
    //this.scene.remove(this.mesh);
}

Unit.prototype.getBuildPercentProgress = function(){
	if (!this.isBuilt()) {
		return Math.floor( (this.buildTime - this.buildDelay) / this.buildTime * 100 )
	}
}
