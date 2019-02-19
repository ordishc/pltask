"use strict";

// Set up our HTTP request
const xhr = new XMLHttpRequest();

// Setup our listener to process completed requests
xhr.onload = function () {
	// Process our return data
	if (xhr.status >= 200 && xhr.status < 300) {
        // What do when the request is successful
        const data = JSON.parse(xhr.response);
        const players = data.players;
        let player = [];
        let playerLastName = getLastName(players, player); // Array of last names

        document.getElementById('playerSelect').onchange=function() {
            let selectedName = handleOnChange();
            let playerStats;
            
            playerLastName.forEach(function(name) {
                if (name === selectedName) {
                    playerStats = players.find(function(element) {
                        let name = element.player.name.last;
                        let nameToLower = name.toLowerCase().replace(new RegExp(/[èéêë]/g),"e");

                        return nameToLower === selectedName;
                    });

                    updateAllStats(playerStats);
                }
            })
        };

	} else {
		// What do when the request fails
		console.log('The request failed!');
	}

	// Code that should run regardless of the request status
    function getLastName(players, player) {
        let playerLastNames;
        let lower;
        let nameArray = [];
    
        players.map(function(player) {
            playerLastNames = player.player.name.last;
            lower = playerLastNames.toLowerCase().replace(new RegExp(/[èéêë]/g),"e");
    
            nameArray.push(lower);
        })
    
        return nameArray;
    }
    
    function handleOnChange() {
        const playerSelect = document.getElementById('playerSelect');
        let selectedPlayer = playerSelect.options[playerSelect.selectedIndex].value;
    
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
        const playerName = document.querySelector('.player-name');
        let firstName = data.player.name.first;
        let lastName = data.player.name.last;
    
        playerName.innerHTML = `${firstName} ${lastName}`;
    }
    
    function updatePlayerPosition(data) {
        const playerPos = document.querySelector('.player-position');
        let positionData = data.player.info.positionInfo;
        let positionString = positionData.split(' ').slice(-1).toString(); //Strip last word from JSON data
    
        playerPos.innerHTML = positionString;
    }

    function updatePlayerImage(data) {
        const playerImage = document.getElementById('playerImage');
        let firstName = data.player.name.first.toLowerCase().replace(new RegExp(/[èéêë]/g),"e");
        let lastName = data.player.name.last.toLowerCase().replace(new RegExp(/[èéêë]/g),"e");
        let newImageName = `${firstName}-${lastName}`;
        let imagePath = `images/players/${newImageName}.png`;

        playerImage.src = imagePath;
    }

    function updatePlayerClub(data) {
        const clubImage = document.querySelector('.club');
        let playerClubFull = data.player.currentTeam.shortName;
        let playerClubShort = playerClubFull.toLowerCase().replace(' ', '-');
        let classList = clubImage.classList;
        let currentClass = classList[2];
        let newClass = `club--${playerClubShort}`;

        clubImage.classList.remove(currentClass);
        clubImage.classList.add(newClass);
    }
    
    function updatePlayerStats(data) {
        const appearances = document.getElementById('appearances');
        const goals = document.getElementById('goals');
        const assists = document.getElementById('assists');
        const goalsPerMatch = document.getElementById('goalsPerMatch');
        const passes = document.getElementById('passes');
    
        let appearanceStat = findStatsOfIndividual(data, 'appearances');
        let goalsStat = findStatsOfIndividual(data, 'goals');
        let assistStat = findStatsOfIndividual(data, 'goal_assist');
        let goalsAverage = goalsStat / appearanceStat;
        let passBack = findStatsOfIndividual(data, 'backward_pass');
        let passFwd = findStatsOfIndividual(data, 'fwd_pass');
        let minsPlayed = findStatsOfIndividual(data, 'mins_played');
        let passTotal = passBack + passFwd;
        let passPerMinute = passTotal / minsPlayed;
    
        appearances.innerHTML = appearanceStat;
        goals.innerHTML = goalsStat;
        assists.innerHTML = assistStat;
        goalsPerMatch.innerHTML = goalsAverage.toFixed(2); // Round maths to 2 decimal places
        passes.innerHTML = passPerMinute.toFixed(2) // Round maths to 2 decimal places
    }
    
    function findStatsOfIndividual(data, stat) {
        let allStatsData = data.stats;
        let playerStats = allStatsData.find(function(stats) {

            return stats.name === stat;
        })
    
        // Handle error is stat doesn't exist (Eg. Mertesacker has no goal assist)
        if (!playerStats) {
            return 0;
        } else {
            return playerStats.value;
        }
    }
};

// Create and send a GET request
// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
// The second argument is the endpoint URL
xhr.open('GET', '../data/player-stats.json');
xhr.send();