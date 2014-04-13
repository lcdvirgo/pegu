	function Play() {
	    this.levels = this.readLevels();
	    this.currentLevel = 1;
	    this.params = levels[currentLevel]
	}
	Play.prototype.readLevels = function() {
	    var res;
	    $.ajax({
	        url: 'levels/levels.json',
	        success: function(result) {
	            res = result;
	        },
	        async: false
	    });
	    return res;
	};


Play.prototype.outputGrid = function(){

return new Grid();


}






	 // function readLevels()
	 // 	        local path = system.pathForFile( "levels.txt")
	 // 			--local path = system.pathForFile( "levels.txt", system.DocumentsDirectory )
	 // 	        local file = io.open( path, "r" )
	 // 	        if file then
	 // 	                -- read all contents of file into a string 
	 // 	                local contents = file:read( "*a" ) 
	 // 	                local levelsList = Json.Decode(contents);
	 // 	                io.close( file )
	 // 					return levelsList
	 // 	        end
	 // end
	 // local levels = readLevels()	
	 // local currentLevel = 1
	 // local nextLevel = 1
	 // local prevLevel = 1
	 // local params = levels[currentLevel]
	 // 	function outputGriglia(params)
	 // 	gameContainer = game.nuovaGriglia{params}
	 // 	gameContainer:setReferencePoint(display.CenterReferencePoint)
	 // 	gameContainer.x = display.contentCenterX
	 // 	gameContainer.y = display.contentCenterY
	 // 	gameContainer.name = "griglia"
	 // 	localGroup:insert(gameContainer)
	 // 	gameContainer:fadeIn(200)
	 // 	startTimer()
	 // end
	 // outputGriglia(params)