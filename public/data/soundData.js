var soundData = {
	"musicLayers": [
		{
			file: "data/nature-vs-new-york.mp3",
			heightRange: [0, 1],
			fadeTime: 5,
		}
	],
	
	musicGain: 0.25,
	
	effects: {
		"manaTreeSpawn": {
			files: [ "data/mana_tree_spawn.wav" ],
			gain: 1.0,
			pitch: 1.0,
			pitchRandomization: 0.1
		},
		"rootTreeSpawn": {
			files: [ "data/root_tree_spawn.wav" ],
			gain: 1.0,
			pitch: 1.0,
			pitchRandomization: 0.1
		},
		"protectorTreeSpawn": {
			files: [ "data/protector_tree_spawn.wav" ],
			gain: 1.0,
			pitch: 1.0,
			pitchRandomization: 0.1
		},
		"bankSpawn": {
			files: [ "data/bank_spawn.wav" ],
			gain: 0.5,
			pitch: 1.0,
			pitchRandomization: 0.1
		},
		"policeStationSpawn": {
			files: [ "data/police_station_spawn.wav" ],
			gain: 0.5,
			pitch: 1.0,
			pitchRandomization: 0.1
		}
	}
}
