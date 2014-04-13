//game
window.requestAnimationFrame(function() {
    new Game();
});


//buttons
jQuery(document).ready(function($) {
    $('.play a').on('click', function(event) {
        event.preventDefault();
        $('header').hide('500');
        $('#info').show('500');
    });
    $('#info').on('click', function(event) {
        event.preventDefault();
        /* Act on the event */
        $('header').show('500');
        $('#info').hide('500');
    });
});