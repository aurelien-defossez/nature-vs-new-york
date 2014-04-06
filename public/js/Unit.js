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

function Unit(scene, player, type, loader) {

    var unitConfig = Game.config.units[type]

    this.phase = "walk"
    this.scene = scene;
    this.player = player;
    this.type = type;
    this.direction = (this.player === HQ.typesEnum.NATURE) ? 1 : -1;
    this.hp = unitConfig.hp;
    this.speed = unitConfig.speed;
    this.attack = unitConfig.attack;
    this.buildingAttack = unitConfig.buildingAttack;
    this.cooldown = unitConfig.cooldown;
    this.cooldownTimer = 0

    console.log('Player ' + player + ' is creating a ' + type);

    if(this.player === HQ.typesEnum.NATURE) {
        this.xPosition = 0.3/2;
    } else if(this.player === HQ.typesEnum.NEW_YORK) {
        this.xPosition = Game.config.lane.cellNumber - 0.3/2;
    }
	this.pending = true
	this.cost = Game.config.unit.cost
    this.buildDelay = unitConfig.time;

    this.animations = {}
    this.currentAnimation = null
    var self = this
    fileName = Game.config.units[type].modelFile
    if (fileName)
    { 
        loader.load(fileName, function(geometry, materials)
        {
            self.mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshFaceMaterial(materials))
            self.mesh.castShadow = true
            self.mesh.receiveShadow = true

            var materials = self.mesh.material.materials
            for (var k in materials)
            {
                materials[k].skinning = true
            }

            for (var i = 0; i < self.mesh.geometry.animations.length; ++i)
            {
                if (THREE.AnimationHandler.get(self.mesh.geometry.animations[i].name) == null)
                    THREE.AnimationHandler.add(self.mesh.geometry.animations[i])
            }

            self.animations.walk = new THREE.Animation(self.mesh, type+"_walk", THREE.AnimationHandler.CATMULLROM)
            self.animations.walk.loop = true
            self.animations.idle = new THREE.Animation(self.mesh, type+"_idle", THREE.AnimationHandler.CATMULLROM)
            self.animations.idle.loop = true
            self.currentAnimation = self.animations.walk
            self.currentAnimation.play()
        })
    }else{
        this.mesh = new THREE.Mesh( new THREE.CubeGeometry(0.3,0.3,0.3),  new THREE.MeshBasicMaterial( { color: colors[this.type] } ) );
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
    }


}

Unit.prototype.startBuild = function(){
    this.pending = false
}

Unit.prototype.activate = function(){
    return this.buildDelay = 0
}

Unit.prototype.setPosition = function(x) {
    this.mesh.position.x = x
    this.xPosition = x
}

Unit.prototype.isBuilt = function(time){
    return this.buildDelay <= 0
}

Unit.prototype.hide = function(time){
    return this.mesh.visible = true
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
    this.phase = phase
    if (phase == "walk"){
        if (this.currentAnimation)
        {
            this.currentAnimation.stop()
            this.currentAnimation = this.animations.walk
            this.currentAnimation.play()
        }

    } else if ( phase == "wait"){
        if (this.currentAnimation)
        {
            this.currentAnimation.stop()
            this.currentAnimation = this.animations.idle
            this.currentAnimation.play()
        }
    }
}

Unit.prototype.update = function(time, dt) {
    if (this.isBuilt()){
        if (this.phase == "walk") {
            this.mesh.position.x = this.mesh.position.x + this.speed * this.direction * dt
            this.xPosition = this.mesh.position.x
        } else if (this.cooldownTimer > 0) {
            this.cooldownTimer -= dt
        }
    } else if (!this.pending) {
        this.buildDelay -= dt
    }

    if (this.currentAnimation != null)
    {
        this.currentAnimation.update(dt)
    }
}

Unit.prototype.startCooldown = function() {
    this.cooldownTimer = this.cooldown
}

Unit.prototype.isReady = function() {
    return this.cooldownTimer <= 0
}

Unit.prototype.hit = function(points) {
    this.hp -= points

    if (this.hp <= 0) {
        this.destroy()
        return true
    }
}

Unit.prototype.destroy = function() {
    this.scene.remove(this.mesh);
}
