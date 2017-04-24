// TODO: Use.


function load(state) {
	playing = state.playing || -1;
	
	for (var i = 0; i < 4; i++) {
		var player = players[i];
		if (player) {
			player.figure.parentNode.removeChild(player.figure);
		}
	}
	
	players = [];
	for (var i = 0; i < 4; i++) {
		var player = state.players && state.players[i];
		if (player) {
			players[i] = new Player(player.name, i);
			if (player.money !== undefined) {
				players[i].money = player.money;
			}
			players[i].position = player.position || 0;
			players[i].jailed = player.jailed;
			players[i].paused = player.paused;
			players[i].moveFigure();
			players[i].refreshStats();
		}
		document.getElementById('name' + i).textContent = player ? player.name : '';
	}
	
	for (var i = 0, field; field = fields[i]; i++) {
		var stateField = (state.fields && state.fields[i]) || {};
		field.owner = players[stateField.ownerIndex] || undefined;
		if (field instanceof Place) {
			field.betted = 0;
			field.houses = stateField.houses || 0;
			field.earns = stateField.earns || field.amounts[field.houses];
			field.updateEarns();
		}
	}
	
	questions = [];
	document.getElementById('message').textContent = '';
	say('State loaded.');
}


function save() {
	var state = { playing: playing, players: [], fields: [] };
	
	for (var i = 0; i < 4; i++) {
		var player = players[i];
		if (player) {
			state.players[i] = { name: player.name, money: player.money, position: player.position, jailed: player.jailed, paused: player.paused };
		}
	}
	
	for (var i = 0, field; field = fields[i]; i++) {
		var stateField = {};
		if (field.owner) {
			stateField.ownerIndex = field.owner.index;
		}
		if (field.earns) {
			stateField.earns = field.earns;
		}
		if (field.houses) {
			stateField.houses = field.houses;
		}
		state.fields[i] = stateField;
	}
	
	return state;
}