jQuery(document).ready(function($) {
    var game = new Game(LocalStorage);
    if (game.getGameStatus() == 1) {
        $('header').hide();
       $('#info,#buttons,#panel').show('500');
        game.start();
    } else {
        $('header').show('500');
        $('#info,#buttons,#panel').hide('500');
    }


        $('.play a').on('click', function(event) {
            event.preventDefault();
            $('header').hide('500');
            $('#info,#buttons,#panel').show('500');
            if (game.getGameStatus() == 1) {} else {
                game.start();
            }
        });




    $('#infobtn').on('click', function(event) {
        event.preventDefault();
        $('header').show('500');
        $('#info,#buttons,#panel').hide('500');
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
    $(window).unload(function() {
        game.saveState();
    });
});