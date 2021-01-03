cc.Class({
    extends: cc.Component,

    properties: {
        bgmVolume:0.01,
        sfxVolume:1.0,
        
        bgmAudioID:-1,
    },

    // use this for initialization
    init: function () {
        var t = cc.sys.localStorage.getItem("bgmVolume");
        if(t != null){
            this.bgmVolume = parseFloat(t);    
        }
        
        var t = cc.sys.localStorage.getItem("sfxVolume");
        if(t != null){
            this.sfxVolume = parseFloat(t);    
        }
        
        cc.game.on(cc.game.EVENT_HIDE, function () {
            console.log("cc.audioEngine.pauseAll");
            cc.audioEngine.pauseAll();
        });
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc.audioEngine.resumeAll");
            cc.audioEngine.resumeAll();
        });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    getUrl:function(url){
        //return cc.url.raw("resources/sounds/" + url);

        return cc.assetManager._transform({
            'path': cc.path.changeExtname("/sounds/" + url), 
            bundle: cc.AssetManager.BuiltinBundleName.RESOURCES, 
            __isNative__: true, 
            ext: ".mp3"
        });
    },
    
    playBGM(url){
        if(this.bgmAudioID >= 0){
            cc.audioEngine.stop(this.bgmAudioID);
        }

        var audioUrl = this.getUrl(url);
        //console.log(audioUrl);

        cc.assetManager.loadRemote(audioUrl, function (err, clip) {
            console.log(err);
            this.bgmAudioID = cc.audioEngine.play(clip, true, this.bgmVolume);
        }.bind(this));
    },
    
    playSFX(url){
        var audioUrl = this.getUrl(url);
        if (!audioUrl){
            //debug only show 
            console.error(url + "not found");
        }
        if(this.sfxVolume > 0){
            cc.assetManager.loadRemote(audioUrl, function (err, clip) {
                var audioId = cc.audioEngine.play(clip, false, this.sfxVolume);
            }.bind(this));
        }
    },
    
    setSFXVolume:function(v){
        if(this.sfxVolume != v){
            cc.sys.localStorage.setItem("sfxVolume",v);
            this.sfxVolume = v;
        }
    },
    
    setBGMVolume:function(v,force){
        if(this.bgmAudioID >= 0){
            if(v > 0){
                cc.audioEngine.resume(this.bgmAudioID);
            }
            else{
                cc.audioEngine.pause(this.bgmAudioID);
            }
            //cc.audioEngine.setVolume(this.bgmAudioID,this.bgmVolume);
        }
        if(this.bgmVolume != v || force){
            cc.sys.localStorage.setItem("bgmVolume",v);
            this.bgmVolume = v;
            cc.audioEngine.setVolume(this.bgmAudioID,v);
        }
    },
    
    pauseAll:function(){
        cc.audioEngine.pauseAll();
    },
    
    resumeAll:function(){
        cc.audioEngine.resumeAll();
    }
});
