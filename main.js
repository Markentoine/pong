'use strict'

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start');
    const player1Choice = document.getElementById('player1');
    const player2Choice = document.getElementById('player2');
    const score1 = document.getElementById('score1');
    const score2 = document.getElementById('score2');
    const scores = [score1, score2];
    const COLORS = {
        player1: {
            human: 'green',
            bot: 'violet'
        },
        player2: {
            human: 'blue',
            bot: 'red'
        }
    };
    const getCanvas = () => document.getElementById('board');
    const typePlayerChoiceDisabled = bool => {
        player1Choice.disabled = bool;
        player2Choice.disabled = bool;
    };
    const getColors = () => {
        const colors = [];
        if (player1Choice.checked) {
            colors.push(COLORS.player1.bot);
        } else {
            colors.push(COLORS.player1.human);
        }
        if (player2Choice.checked) {
            colors.push(COLORS.player2.bot);
        } else {
            colors.push(COLORS.player2.human);
        }
        return colors;
    };
    const getPlayersTypes = () => {
        const players = [];
        if (player1Choice.checked) {
            players.push({
                player1: 'bot'
            });
        } else {
            players.push({
                player1: 'human'
            });
        }
        if (player2Choice.checked) {
            players.push({
                player2: 'bot'
            });
        } else {
            players.push({
                player2: 'human'
            });
        }
        return players;
    }

    let currentGame;
    startButton.addEventListener('click', () => {
        if (startButton.textContent === 'START') {
            const colors = getColors();
            const playersTypes = getPlayersTypes();
            startButton.textContent = 'END';
            currentGame = new Game(getCanvas(), colors, playersTypes, scores);
            typePlayerChoiceDisabled(true);
            currentGame.run(getCanvas());
        } else {
            if (confirm('Are you sure you want to clear the game?')) {
                startButton.textContent = 'START';
                typePlayerChoiceDisabled(false);
                currentGame.clear(getCanvas(), startButton, scores);
            }
        }
    });

})