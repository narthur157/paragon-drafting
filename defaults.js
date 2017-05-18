
/*
 * These are functions because otherwise the objects would be shared rather than cloned
*/
module.exports = {
	draftSession: function(matchKey, numBans, team1Name, team2Name) {
		var replicateArr = function(arr, numTimes) {
			ret = [];
			for(i = 0; i < numTimes; i++) {
				ret = ret.concat(arr);
			}
			
			return ret;
		}
		
		return {
			stageQueue : replicateArr(['t1ban', 't2ban'], numBans).concat([
						 't1pick', 't2pick', 't2pick', 't1pick', 't1pick', 't2pick', 't2pick', 't1pick', 't1pick', 't2pick', 'finish']),
			matchKey : matchKey || Math.random() * 999999, // would be better to check sessions for collisions
			team1Name : team1Name || '1',
			team2Name : team2Name || '2',
			numBans : numBans,
			observerId : 'obs',
			stageTag: 'readyStage',
			stageState: {
				team1Ready: false,
				team2Ready: false
			}
		};
	},
	
	pickStageState: function() {
		var state = {
			teams: {
				1: {
					picked: [],
					banned: []
				},
				2: {
					picked: [],
					banned: []
				}
			},
			teamTurn: 1,
			timeLeft: 40
		};
		
		setInterval(function() { state.timeLeft--; }, 1000);
		
		return state;
	}
};