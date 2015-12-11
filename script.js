/* global alert $ */
'use strict'
$(function () {
  class Game {
    constructor () {
      this.counter = 1
      this.currentPlayer = null
      this.playerX = []
      this.playerO = []
      this.winner = null
    }

    playMove (cellNumber) {
      // check for who's playing and assign it
      this.currentPlayer = this.getPlayer()

      // assign the cell to the right player
      if (this.cellIsOccupied(cellNumber)) {
        alert('Nope')
      } else {
        if (this.currentPlayer === 'x') {
          this.playerX.push(cellNumber)
        } else if (this.currentPlayer === 'o') {
          this.playerO.push(cellNumber)
        }
      }

      // scan the players' move history and look for winning
      // combinations of moves
      this.checkForWinner()

      // incremement the game counter
      this.counter++
    }

    hasWon (player) {
      return player.some(function (cells) {
        return (cells.reduce(function (a, b) { return a + b }) === 15)
      })
    }

    checkForWinner () {
      var x_combinations = combinations(3, this.playerX)
      var o_combinations = combinations(3, this.playerO)

      if (this.hasWon(x_combinations)) {
        this.winner = 'x'
      } else if (this.hasWon(o_combinations)) {
        this.winner = 'o'
      }
    }

    getPlayer () {
      return (this.counter % 2 === 0) ? 'o' : 'x'
    }

    // check if a cell is already occupied by a player
    checkCell (playerList, cell) {
      return playerList.indexOf(cell) !== -1
    }

    cellIsOccupied (cell) {
      return (this.checkCell(this.playerX, cell) || this.checkCell(this.playerO, cell))
    }
  }

  // this is rather inefficient, but the external API is solid
  function combinations (size, array) {
    // return the powerset of a given array
    function powerset (array) {
      var ps = [[]]
      for (var i = 0; i < array.length; i++) {
        for (var j = 0, len = ps.length; j < len; j++) {
          ps.push(ps[j].concat(array[i]))
        }
      }
      return ps
    }

    // filter a nested array for subsets of a given size
    function of_size (size, arr) {
      return arr.filter(function (el) {
        return (el.length === size)
      })
    }

    // filter our powerset for combinations of a given size
    return of_size(size, powerset(array))
  }

  var game = new Game()

  $('.cell').click(function (event) {
    var currentCell = $(this).data().cell
    game.playMove(currentCell)
    if (game.currentPlayer === 'x') {
      $(this).html('<span class="glyphicon glyphicon-remove"></span>')
    } else if (game.currentPlayer === 'o') {
      $(this).html('<span class="glyphicon glyphicon-ok"></span>')
    }

    if (game.winner !== null) {
      alert(`${game.winner.toUpperCase()} has won the game!`)
      $('.cell').unbind('click')
    }
  })

})
