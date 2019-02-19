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
        // let selectedPlayer;

        document.getElementById('playerSelect').onchange=function() {
            let selectedName = handleOnChange();
            // let found = players.find(function(element) {
            //     return element.player.name.last === 'Rooney';
            // });
            let playerStats;

            // console.log(playerLastName)
            // console.log(data.includes(player));
            // console.log(players)
            // console.log(found);
           
            
            playerLastName.forEach(function(name) {
                // console.log(name)
                if (name === selectedName) {
                    console.log(selectedName)

                    playerStats = players.find(function(element) {
                        let name = element.player.name.last;
                        let nameToLower = name.toLowerCase().replace(new RegExp(/[èéêë]/g),"e");

                        return nameToLower === selectedName;
                    });

                    console.log(playerStats)
                    updatePlayerName(playerStats);
                }
            })
        };

	} else {
		// What do when the request fails
		console.log('The request failed!');
	}

	// Code that should run regardless of the request status
    // console.log('This always runs...');
};

// Create and send a GET request
// The first argument is the post type (GET, POST, PUT, DELETE, etc.)
// The second argument is the endpoint URL
xhr.open('GET', '../data/player-stats.json');
xhr.send();

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

// let showSelected = function() {
//     const playerSelect = document.getElementById('playerSelect');
//     let selectedPlayer = playerSelect.options[playerSelect.selectedIndex].value;

//     // if(selectedPlayer === )

//     console.log(playerLastName)
//     console.log(selectedPlayer);

//     return selectedPlayer;
// }

function handleOnChange() {
    const playerSelect = document.getElementById('playerSelect');
    let selectedPlayer = playerSelect.options[playerSelect.selectedIndex].value;

    return selectedPlayer;
}

function updatePlayerName(data) {
    const playerName = document.querySelector('.player-name');
    const text = playerName;
    let firstName = data.player.name.first;
    let lastName = data.player.name.last;

    text.innerHTML = `${firstName} ${lastName}`;
}