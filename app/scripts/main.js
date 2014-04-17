jQuery(document).ready(function($) {
    var game = new Game(LocalStorage,Social,Sound);
    if (game.getGameStatus() == 1) {
        $('header').hide();
        $('.game_asset').show('500');
        game.start();
    } else {
        $('header').show('500');
        $('.game_asset').hide('500');
    }
    $('.play a').on('click', function(event) {
        event.preventDefault();
        $('header').hide('500');
        $('.game_asset').show('500');
        if (game.getGameStatus() == 1) {} else {
            game.start();
        }
    });
    $('#infobtn').on('click', function(event) {
        event.preventDefault();
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

if(game.isopenSocial()){
game.closeSocial();
}else{
    game.openSocial();
}

        
    });

    $(window).unload(function() {
        game.saveState();
    });
});