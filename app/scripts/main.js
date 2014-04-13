//game
var game;
var current_level = 0;
window.requestAnimationFrame(function() {
    game = new Game(0);
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
        game = new Game(current_level);
    });
    $('#next').on('click', function(event) {
        event.preventDefault();
        current_level = current_level + 1;
        game = new Game(current_level);
    });
    $('#previous').on('click', function(event) {
        event.preventDefault();
        current_level = current_level - 1;
        game = new Game(current_level);
    });
});