$(document).ready(function() {
  var $game = $("#game");


  MatchGame.initializeGame($game);

  $("#restart").click(function() {
    MatchGame.initializeGame($game);
  });
});

var MatchGame = {};
/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/
MatchGame.initializeGame = function ($game) {

  var cardValues = MatchGame.generateCardValues();

  updateMovesValueAndText(0, $game);

  MatchGame.renderCards(cardValues,$game);
}

/*
  Generates and returns an array of matching card values.
 */
MatchGame.generateCardValues = function () {
  var valuePairs = [];

  for(var i = 1; i < 9 ; i++) {
    valuePairs.push(i);
    valuePairs.push(i);
  }

  var newArray = [];

  while (valuePairs.length > 0) {
    var randIndex = Math.floor(Math.random() * valuePairs.length);
    // console.log(randIndex);
    newArray.push(valuePairs[randIndex]);
    valuePairs.splice(randIndex,1);
    // console.log("Old: " + valuePairs);
    // console.log("New: " + newArray);
  }

  return newArray;
};


/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/
MatchGame.renderCards = function(cardValues, $game) {
  // $("#game").empty();
  $game.empty();
  $game.data("flippedCards", []);
  $game.data("moves", 0);

  for(var i = 0; i < cardValues.length; i++) {
    var $card = $("<div class=\"col-xs-3 cardcontainer\">" +
                  "  <div id=\"card\">" +
                  "    <figure class=\"front\"></figure>" +
                  "    <figure class=\"back\"></figure>" +
                  "  </div>" +
                  "</div>");
    $card.data("cardData", createCardData(cardValues[i]));

    initCard($card, $card.data("cardData"));

    $game.append($card);
  }

  $("#game .cardcontainer").click(function (){
    var $game = $("#game");
    var flippedCards = $game.data("flippedCards");

    MatchGame.flipCard($(this), $game);
  });
};

function createCardData(value) {
  return card = {
    value: value,
    color: getColorByValue(value),
    flipped: false
  };
}

function getColorByValue(value) {
  var colors = ["hsl(25, 85%, 65%)", "hsl(55, 85%, 65%)",
"hsl(90, 85%, 65%)", "hsl(160, 85%, 65%)", "hsl(220, 85%, 65%)",
"hsl(265, 85%, 65%)", "hsl(310, 85%, 65%)", "hsl(360, 85%, 65%)"];

  if (value > 0 && value < 9) {
    return colors[value-1];
  }

  throw console.error("Unexpected value '" + value +"'");
}


/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {
  var cardData = $card.data("cardData");
  var flippedCards = $game.data("flippedCards");

  if (!cardData.flipped) {
    // set to flipped
    reallyFlip($card, cardData, true);

    flippedCards.push($card);
  }

  if (flippedCards.length === 2) {
    var flipCardData1 = flippedCards[0].data("cardData");
    var flipCardData2 = flippedCards[1].data("cardData");

    if (flipCardData1.value === flipCardData2.value) {
      setBackground(flippedCards[0], "rgb(153, 153, 153)");
      setBackground(flippedCards[1], "rgb(153, 153, 153)");
    }
    else {
      // reset cards
      setTimeout(function() {
        reallyFlip(flippedCards[0], flipCardData1, false);
        reallyFlip(flippedCards[1], flipCardData2, false);
      }, 750);
    }
    // reset array of flipped cards
    $game.data("flippedCards", []);

    incrementMoves($game);
  }
};

function incrementMoves($game) {
  // count
  var moves = $game.data("moves");
  updateMovesValueAndText(++moves, $game);
}

function updateMovesValueAndText(moves, $game) {
  // set value
  $game.data("moves", moves);

  // update text
  var $moves = $("#moves");
  $moves.text("Moves: " + moves);
}

function initCard($card, cardData) {
  var $back = $card.find(".back");
  $back.css({"background-color":cardData.color});
  $back.text(cardData.value);
}

function setBackground($card, newColorValue) {
  $card.find(".back").css({"background-color":newColorValue});
}


function reallyFlip($card, cardData, flipValue) {
   var $realCard = $card.find("#card");

  cardData.flipped = flipValue;
  $realCard.toggleClass("flipped");
}
