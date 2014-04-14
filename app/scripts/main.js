//game
var game;

window.requestAnimationFrame(function() {
    game = new Game(LocalStorage);
});
// DUMMY CODE ALERT// 
// DUMMY CODE ALERT// 
// DUMMY CODE ALERT// 
// DUMMY CODE ALERT// 
//buttons
jQuery(document).ready(function($) {
    $('.play a').on('click', function(event) {
        event.preventDefault();
        $('header').hide('500');
        $('#info').show('500');
    });
    $('#infobtn').on('click', function(event) {
        event.preventDefault();
        $('header').show('500');
        $('#info').hide('500');
    });
    $('#refresh').on('click', function(event) {
        event.preventDefault();
        game.restart();
    });
    $('#next').on('click', function(event) {
        event.preventDefault();
        game.nextLevel();
    });
    $('#previous').on('click', function(event) {
        event.preventDefault();
        game.previousLevel();
    });
});