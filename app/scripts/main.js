jQuery(document).ready(function($) {
    game = new Game(LocalStorage, Social, Sound);
    if (game.getGameStatus() == 1) {
        $('header').hide('500', function() {
            game.start();
        });
        $('.game_asset').show('500');
    } else {
        $('header').show('500');
        $('.game_asset').hide('500');
    }
    $('.play a').on('click', function(event) {
        event.preventDefault();
        $('.how_to_play').hide('200');
        $('header').hide('500', function() {
            if (game.getGameStatus() == 1) {} else {
                game.start();
            }
        });
        $('.game_asset').show('500');
    });
    $('.how_to_play a').on('click', function(event) {
        event.preventDefault();
        $('.how_to_play').hide('200');
        $('header').hide('500', function() {
            game.tutorial();
        });
        $('.game_asset').show('500');
    });


    $('#infobtn').on('click', function(event) {
        event.preventDefault();

        $('.how_to_play').show('200');

        $('header').show('500');
        $('.game_asset').hide('500');
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
    $('#sharebtn').on('click', function(event) {
        event.preventDefault();
        if (game.isopenSocial()) {
            game.closeSocial();
        } else {
            game.openSocial();
        }
    });
    $(window).unload(function() {
        game.saveState();
    });
});