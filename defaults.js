/*
 * These are functions because otherwise the objects would be shared rather than cloned
*/
module.exports = {
	draftSession: function(matchKey, numBans, team1Name, team2Name) {
		var replicateArr = function(arr, numTimes) {
			for(i = 1; i < numTimes; i++) {
				arr = arr.concat(arr);
			}
			
			return arr;
		}
		
		return {
			stageQueue : replicateArr(['t1ban', 't2ban'], numBans).concat([
						 't1pick', 't2pick', 't2pick', 't1pick', 't1pick', 't2pick', 't2pick', 't1pick', 't1pick', 't2pick', 'finish']),
			matchKey : matchKey,
			team1Name : team1Name,
			team2Name : team2Name,
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
		return {
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
			teamTurn: 1
		};
	}
};