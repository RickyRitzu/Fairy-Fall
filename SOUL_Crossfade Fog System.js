/*:
* 
* @plugindesc A standalone plugin that allows you to do crossfading multiple fogs.
* @author Soulpour777
*
* @param File Directory
* @desc The exact location of the fog images. By default, at img / Fogs/. Note: / at the end is important.
* @default img/Fogs/
*
* @param Cross Fade Power
* @desc The fastness of the crossfade effect. (When it is showed in the screen)
* @default 10
*
* @help

SOUL_Crossfade Fog System
Author: Soulpour777 

General Help File

In order for you to create or call a fog, you must write this
in the Plugin Command event:

soul_mv fog set fogHierarchy fogName opacity crossfade/notcrossfade xscroll yscroll

where:
fogHierarchy is the letter of the fog you're going to call. You can call
up to 4 types of fog at the same time. It is indicated by letters A, B, C and D.

fogName is the file name you used for the fog you want to use and
show in the screen. For example, your fog's file name is ForestFog, then
it should be written so.

opacity is the visibility or transparency of your fog when shown in the screen.

crossfade/notcrossfade is indicated by whether true or false. if true, then
the crossfade is used, while if false, then crossfade is not used.

xscroll is the scroll speed and x axis of the fog.

yscroll is the scroll speed and y axis of the fog.

For example:

soul_mv fog set A ForestFog 100 true 1 1

The plugin command above indicates fog #1 (or A) 
will show ForestFog, with the opacity of 100,
crossfading, and scrolls at x:1 and y:1 with the same speed.

By default, all fog images are inside img/Fogs/ folder. With the
File Directory plugin parameter, you can organize it to the folder
you want to.

*
*
*/

(function(){

	var soul_mv_params = PluginManager.parameters('SOUL_Crossfade Fog System');

	var fogDirectory = String(soul_mv_params['File Directory']);
	var fogCrossfadePower = Number(soul_mv_params['Cross Fade Power']);

	ImageManager.loadFogs = function(filename, hue) {
	    return this.loadBitmap(fogDirectory, filename, hue, true);
	};

	var soul_mv_gameSystem_initialize = Game_System.prototype.initialize;
	Game_System.prototype.initialize = function() {
	    soul_mv_gameSystem_initialize.call(this);
	    this._fogA = null;
	    this._fogA_crossfade = false;
	    this._fogA_xCross = 0;
	    this._fogA_yCross = 0;
	    this._fogA_opacity = 0;
	    this._fogB = null;
	    this._fogB_xCross = 0;
	    this._fogB_yCross = 0;	    
	    this._fogB_crossfade = false;
	    this._fogB_opacity = 0;
	    this._fogC = null;
	    this._fogC_xCross = 0;
	    this._fogC_yCross = 0;	    
	    this._fogC_crossfade = false;
	    this._fogC_opacity = 0;
	    this._fogD = null;
	    this._fogD_xCross = 0;
	    this._fogD_yCross = 0;	    
	    this._fogD_crossfade = false;
	    this._fogD_opacity = 0;
	    
	};


	Scene_Map.prototype.createDisplayObjects = function() {
		this._fogLayer = [];
		this._fogLayer = [$gameSystem._fogA, $gameSystem._fogB, $gameSystem._fogC, $gameSystem._fogD];
		this._fogLayerSprites = [];		
	    this.createSpriteset();
	    this.createFogLayer();
	    this.createMapNameWindow();
	    this.createWindowLayer();
	    this.createAllWindows();
	};

	var soul_mv_sceneMap_update = Scene_Map.prototype.update;
	Scene_Map.prototype.update = function() {
	    soul_mv_sceneMap_update.call(this);
	    this.updateFogLayer();
	};

	Scene_Map.prototype.createFogLayer = function() {
		this._fogImageA = new TilingSprite();
		this._fogImageA.move(0, 0, Graphics.width, Graphics.height);
		this._fogImageA.bitmap = ImageManager.loadFogs($gameSystem._fogA);
		this._fogImageA.opacity = 0;
		this.addChild(this._fogImageA);
		this._fogImageB = new TilingSprite();
		this._fogImageB.move(0, 0, Graphics.width, Graphics.height);
		this._fogImageB.bitmap = ImageManager.loadFogs($gameSystem._fogB);
		this._fogImageB.opacity = 0;
		this.addChild(this._fogImageB);
		this._fogImageC = new TilingSprite();
		this._fogImageC.move(0, 0, Graphics.width, Graphics.height);
		this._fogImageC.bitmap = ImageManager.loadFogs($gameSystem._fogC);
		this._fogImageC.opacity = 0;
		this.addChild(this._fogImageC);
		this._fogImageD = new TilingSprite();
		this._fogImageD.move(0, 0, Graphics.width, Graphics.height);
		this._fogImageD.bitmap = ImageManager.loadFogs($gameSystem._fogD);
		this._fogImageD.opacity = 0;
		this.addChild(this._fogImageD);				
	}

	Scene_Map.prototype.updateFogLayer = function() {
		
		this._fogImageA.origin.x += $gameSystem._fogA_xCross;
		this._fogImageA.origin.y += $gameSystem._fogA_yCross;
		this._fogImageB.origin.x += $gameSystem._fogB_xCross;
		this._fogImageB.origin.y += $gameSystem._fogB_yCross;
		this._fogImageC.origin.x += $gameSystem._fogC_xCross;
		this._fogImageC.origin.y += $gameSystem._fogC_yCross;				
		if ($gameSystem._fogA_crossfade) {
			if (this._fogImageA.opacity <= $gameSystem._fogA_opacity) {
				this._fogImageA.opacity += fogCrossfadePower;
			}
		} else {
			this._fogImageA.opacity = $gameSystem._fogA_opacity;
		}
		if ($gameSystem._fogB_crossfade) {
			if (this._fogImageB.opacity <= $gameSystem._fogB_opacity) {
				this._fogImageB.opacity += fogCrossfadePower;
			}
		} else {
			this._fogImageB.opacity = $gameSystem._fogB_opacity;
		}
		if ($gameSystem._fogC_crossfade) {
			if (this._fogImageC.opacity <= $gameSystem._fogC_opacity) {
				this._fogImageC.opacity += fogCrossfadePower;
			}
		} else {
			this._fogImageC.opacity = $gameSystem._fogC_opacity;
		}
		if ($gameSystem._foD_crossfade) {
			if (this._fogImageD.opacity <= $gameSystem._fogD_opacity) {
				this._fogImageD.opacity += fogCrossfadePower;
			}
		} else {
			this._fogImageD.opacity = $gameSystem._fogD_opacity;
		}				
	}

	Scene_Map.prototype.reclaimFogImages = function() {
		this._fogImageA.bitmap = ImageManager.loadFogs($gameSystem._fogA);
		this._fogImageB.bitmap = ImageManager.loadFogs($gameSystem._fogB);
	}

	var soul_mv_gameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
	    soul_mv_gameInterpreter_pluginCommand.call(this, command, args); // call original method
	    if (command === 'soul_mv') {
	    	switch(args[0]) {
	    		case 'fog':
	    			if (args[1] === 'set') {
	    				if (args[2] === 'A') {
	    					$gameSystem._fogA = String(args[3]);
	    					$gameSystem._fogA_opacity = Number(args[4]);
	    					if (String(args[5]) === 'true') {
	    						$gameSystem._fogA_crossfade = true;
	    					}
	    					if (String(args[5]) === 'false') {
	    						$gameSystem._fogA_crossfade = false;
	    					}
	    					$gameSystem._fogA_xCross = Number(args[6]);
	    					$gameSystem._fogA_yCross = Number(args[7]);
	    					SceneManager._scene.reclaimFogImages();
	    				}
	    				if (args[2] === 'B') {
	    					$gameSystem._fogB = String(args[3]);
	    					$gameSystem._fogB_opacity = Number(args[4]);
	    					if (String(args[5]) === 'true') {
	    						$gameSystem._fogB_crossfade = true;
	    					}
	    					if (String(args[5]) === 'false') {
	    						$gameSystem._fogB_crossfade = false;
	    					}	    					
	    					$gameSystem._fogB_xCross = Number(args[6]);
	    					$gameSystem._fogB_yCross = Number(args[7]);	    					
	    					SceneManager._scene.reclaimFogImages();
	    				}
	    				if (args[2] === 'C') {
	    					$gameSystem._fogC = String(args[3]);
	    					SceneManager._scene.reclaimFogImages();
	    					$gameSystem._fogC_xCross = Number(args[6]);
	    					$gameSystem._fogC_yCross = Number(args[7]);	 
	    					if (String(args[5]) === 'true') {
	    						$gameSystem._fogC_crossfade = true;
	    					}
	    					if (String(args[5]) === 'false') {
	    						$gameSystem._fogC_crossfade = false;
	    					}	    					   					
	    				}	    
	    				if (args[2] === 'D') {
	    					$gameSystem._fogD = String(args[3]);
	    					$gameSystem._fogD_xCross = Number(args[6]);
	    					$gameSystem._fogD_yCross = Number(args[7]);	
	    					if (String(args[5]) === 'true') {
	    						$gameSystem._fogD_crossfade = true;
	    					}
	    					if (String(args[5]) === 'false') {
	    						$gameSystem._fogD_crossfade = false;
	    					}	    					    					
	    					SceneManager._scene.reclaimFogImages();
	    				}	    									    				
	    			}
	    	}
	    }
	};
})();