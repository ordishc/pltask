const PlayerCard = (() => {
	'use strict';

	const DOM = {
		selectors: {
			body: 'body',
			playerName: '.player-name',
			playerPos: '.player-position',
			playerImage: 'playerImage',
			playerClub: '.club',
			playerAppearances: '.appearances',
			playerGoals: '.goals',
			playerAssists: '.assists',
			playerGoalsPerMatch: '.goalsPerMatch',
			playerPasses: '.passes',
			dropDown: 'playerSelect'
		}
	};

	// cache DOM elements
	function cacheDom() {
		DOM.$body = document.querySelector(DOM.selectors.body);
		DOM.$playerName = document.querySelector(DOM.selectors.playerName);
		DOM.$playerPos = document.querySelector(DOM.selectors.playerPos);
		DOM.$playerImage = document.getElementById(DOM.selectors.playerImage);
		DOM.$playerClub = document.querySelector(DOM.selectors.playerClub);
		DOM.$appearances = document.querySelector(DOM.selectors.playerAppearances);
		DOM.$goals = document.querySelector(DOM.selectors.playerGoals);
		DOM.$assists = document.querySelector(DOM.selectors.playerAssists);
		DOM.$goalsPerMatch = document.querySelector(DOM.selectors.playerGoalsPerMatch);
		DOM.$passes = document.querySelector(DOM.selectors.playerPasses);
		DOM.$playerSelect = document.getElementById(DOM.selectors.dropDown);
	}

	function retrieveData() {
		const xhr = new XMLHttpRequest();

		xhr.onload = function () {
			if (xhr.status >= 200 && xhr.status < 300) {
				const data = JSON.parse(xhr.response);
				const players = data.players;
				let player = [],
					playerLastName = getLastName(players, player); // Array of last names

				DOM.$playerSelect.onchange=function() {
					let selectedName = handleOnChange();
					let playerStats;
					
					playerLastName.forEach(name => {
						if (name === selectedName) {
							playerStats = players.find(element => {
								let name = element.player.name.last
								let nameToLower = name.toLowerCase().replace(new RegExp(/[èéêë]/g),"e");

								return nameToLower === selectedName;
							});

							updateAllStats(playerStats);
						}
					})
				};

			} else {
				// Handle request error here
				// Would show some sort of error message
				console.log('The request failed!');
			}
		};
		xhr.open('GET', '../data/player-stats.json');
		xhr.send();
	}

	function getLastName(players, player) {
		let playerLastNames,
			lowerCaseNames,
			nameArray = [];
	
		players.map(player => {
			playerLastNames = player.player.name.last;
			lowerCaseNames = playerLastNames.toLowerCase().replace(new RegExp(/[èéêë]/g),"e");
	
			nameArray.push(lowerCaseNames);
		})
	
		return nameArray;
	}
	
	function handleOnChange() {
		let selectedPlayer = DOM.$playerSelect.options[DOM.$playerSelect.selectedIndex].value;
	
		return selectedPlayer;
	}

	function updateAllStats(data) {
		updatePlayerName(data);
		updatePlayerPosition(data);
		updatePlayerStats(data);
		updatePlayerImage(data);
		updatePlayerClub(data);
	}
	
	function updatePlayerName(data) {
		const firstName = data.player.name.first,
			lastName = data.player.name.last;
	
		DOM.$playerName.innerHTML = `${firstName} ${lastName}`;
	}
	
	function updatePlayerPosition(data) {
		const positionData = data.player.info.positionInfo,
			positionString = positionData.split(' ').slice(-1).toString(); //Strip last word from JSON data
	
		DOM.$playerPos.innerHTML = positionString;
	}

	function updatePlayerImage(data) {
		// Regex is removing e's with any accent (Eg. Toure) (would need more for other players)
		// Would create a function to handle all scenarios
		const firstName = data.player.name.first.toLowerCase().replace(new RegExp(/[èéêë]/g),"e"),
			lastName = data.player.name.last.toLowerCase().replace(new RegExp(/[èéêë]/g),"e"),
			newImageName = `${firstName}-${lastName}`,
			imagePath = `images/players/${newImageName}.png`;

		DOM.$playerImage.src = imagePath;
	}

	function updatePlayerClub(data) {
		const playerClubFull = data.player.currentTeam.shortName,
			playerClubShort = playerClubFull.toLowerCase().replace(' ', '-'),
			classList = DOM.$playerClub.classList,
			currentClass = classList[2],
			newClass = `club--${playerClubShort}`;

		DOM.$playerClub.classList.remove(currentClass);
		DOM.$playerClub.classList.add(newClass);
	}
	
	function updatePlayerStats(data) {	
		const appearanceStat = findStatsOfIndividual(data, 'appearances'),
			goalsStat = findStatsOfIndividual(data, 'goals'),
			assistStat = findStatsOfIndividual(data, 'goal_assist'),
			goalsAverage = goalsStat / appearanceStat,
			passBack = findStatsOfIndividual(data, 'backward_pass'),
			passFwd = findStatsOfIndividual(data, 'fwd_pass'),
			minsPlayed = findStatsOfIndividual(data, 'mins_played'),
			passTotal = passBack + passFwd,
			passPerMinute = passTotal / minsPlayed;

		DOM.$appearances.innerHTML = appearanceStat;
		DOM.$goals.innerHTML = goalsStat;
		DOM.$assists.innerHTML = assistStat;
		DOM.$goalsPerMatch.innerHTML = goalsAverage.toFixed(2); // Round maths to 2 decimal places
		DOM.$passes.innerHTML = passPerMinute.toFixed(2) // Round maths to 2 decimal places
	}

	function findStatsOfIndividual(data, stat) {
		const allStatsData = data.stats,
			playerStats = allStatsData.find(stats => stats.name === stat);

		// Handle error if stat doesn't exist (Eg. Mertesacker has no goal assist)
		if (!playerStats) {
			return 0;
		} else {
			return playerStats.value;
		}
	}

	function init() {
		retrieveData();
		cacheDom();
	}

	return {
		init: init
	};
})();
