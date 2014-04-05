Game.config = {
    board : {
      height: 720,
      width:1280
    },
	antialiasing : true,
	lane : {
		cellNumber : 8,
		spacing : 2,
		marginLeft : 2,
		marginRight : 2,
		marginTop : 1,
		marginBottom : 1
	},
    hotKeys : {
        keyboard : {
          start : "U+0050"
        }     
    },
    nature : {
		initOwnedCells : 1,
		health : 10,
    	hp: 500,
    	startMana: 50,
    	manaPerSecond: 2,
    	captureSpeed: 0.05
	},
	newYork : {
		initOwnedCells : 1,
		health : 10,
    	hp: 500,
    	startMana: 50,
    	manaPerSecond: 2,
    	captureSpeed: 0
	},
	units: {
		// Porteur de sève
		sapCarrier: {
			attack: 0,
			buildingAttack: 0,
			hp: 5,
			speed: 0.2,
			cost: 10,
			time: 10,
			repairSpeed: 2
		},
		// Loup
		wolf: {
			attack: 3,
			buildingAttack: 2,
			hp: 15,
			speed: 1.0,
			cost: 4,
			time: 4
		},
		// Ours
		bear: {
			attack: 5,
			buildingAttack: 5,
			hp: 5,
			speed: 0.4,
			cost: 8,
			time: 6
		},
		// Ent
		Ent: {
			attack: 10,
			buildingAttack: 10,
			hp: 50,
			speed: 0.2,
			cost: 20,
			time: 20
		},
		// Constructeur
		builder: {
			attack: 0,
			buildingAttack: 0,
			hp: 5,
			speed: 0.2,
			cost: 20,
			time: 20,
			captureSpeed: 0.1
		},
		// Bûcheron
		lumberjack: {
			attack: 2,
			buildingAttack: 10,
			hp: 15,
			speed: 0.4,
			cost: 5,
			time: 5
		},
		// Policier
		policeman: {
			attack: 2,
			buildingAttack: 1,
			hp: 10,
			speed: 0.5,
			cost: 2,
			time: 2
		},
		// Mécha
		Mecha: {
			attack: 10,
			buildingAttack: 10,
			hp: 50,
			speed: 0.25,
			cost: 20,
			time: 20
		}
	},
	buildings: {
		// Arbre Mana
		manaTree: {
			hp: 100,
			cost: 20,
			time: 20,
			manaPerSecond: 1.0
		},
		// Arbre Protecteur
		protectorTree: {
			hp: 100,
			cost: 20,
			time: 20,
			attack: 9
		},
		// Arbre à Racines
		rootTree: {
			hp: 100,
			cost: 20,
			time: 20,
			captureSpeed: 0.05
		},
		// Ronces
		brambles: {
			cost: 10,
			time: 10,
			attack: 2
		},
		// Banque
		bank: {
			hp: 100,
			cost: 20,
			time: 20,
			manaPerSecond: 1.0
		},
		// Station de Police
		policeStation: {
			hp: 100,
			cost: 20,
			time: 20,
			policemansPerSecond: 0.2
		},
		// Atelier
		workshop: {
			hp: 100,
			cost: 20,
			time: 20,
			productionBonus: 0.2
		},
		// Béton Armé
		armedConcrete: {
			hp: 50,
			cost: 10,
			time: 10
		}
	},
	objectMapping : {
		"stupid" : {
			file : "data/root.js"
		}
	},
    unit : {
		speed : 1,
		buildTime : 3 //in seconds
	}
}

