String.prototype.format = function(args) { 
    if (arguments.length>0) { 
        var result = this; 
        if (arguments.length == 1 && typeof (args) == "object") { 
            for (var key in args) { 
                var reg=new RegExp ("({"+key+"})","g"); 
                result = result.replace(reg, args[key]); 
            } 
        } 
        else { 
            for (var i = 0; i < arguments.length; i++) { 
                if(arguments[i]==undefined) { 
                    return ""; 
                } 
                else { 
                    var reg=new RegExp ("({["+i+"]})","g"); 
                    result = result.replace(reg, arguments[i]); 
                } 
            } 
        } 
        return result; 
    } 
    else { 
        return this; 
    } 
};
 
cc.Class({
    extends: cc.Component,

    properties: {
        _mima:null,
        _mimaIndex:0,
        labelUser: cc.Label,
    },
    account: null,
    name: null,
    // use this for initialization
    onLoad: function () {
        if(!cc.sys.isNative && cc.sys.isMobile){
            var cvs = this.node.getComponent(cc.Canvas);
            cvs.fitHeight = true;
            cvs.fitWidth = true;
        }
        
        if(!cc.vv){
            cc.director.loadScene("loading");
            return;
        }
        cc.vv.http.url = cc.vv.http.master_url;
        //接受服务器传来的信息
        cc.vv.net.addHandler('push_need_create_role',function(){
            console.log("onLoad:push_need_create_role");
            cc.director.loadScene("createrole");
        });
        
        cc.vv.audioMgr.playBGM("bgMain.mp3");
        
        this._mima = ["A","A","B","B","A","B","A","B","A","A","A","B","B","B"];
        
        if(!cc.sys.isNative || cc.sys.os == cc.sys.OS_WINDOWS){
            cc.find("Canvas/btn_yk").active = true;    
        }

        cc.find("Canvas/btn_yk").active = true;

        this.account = cc.args["account"];
        if(! this.account) this.account = cc.sys.localStorage.getItem("account");
        
        if(! this.account){
            cc.find("Canvas/btn_user").active = false;
        } 
        else {
            this.name = cc.sys.localStorage.getItem("name");
            //apprently, you cannot do this.name=null, or this.name=""
            if (this.name == "Canvas<Login>") this.name = " ";

            if (this.name) {
                this.labelUser.string = this.name;
                cc.find("Canvas/btn_user").active = true;
            }
            else cc.find("Canvas/btn_user").active = false;
        }
    },
    
    start:function(){
        /*
        this.account =  cc.sys.localStorage.getItem("wx_account");
        var sign = cc.sys.localStorage.getItem("wx_sign");
        if(this.account != null && sign != null){
            var ret = {
                errcode:0,
                account:this.account,
                sign:sign
            }
            cc.vv.userMgr.onAuth(ret);
        } 
        */  
    },
    
    onBtnQuickStartClicked_existing:function(){
        cc.vv.userMgr.guestAuth(this.account);
    },
    onBtnQuickStartClicked_new:function(){
        cc.vv.userMgr.guestAuth(null);
    },

    onBtnWeichatClicked:function(){
        var self = this;
        cc.vv.anysdkMgr.login();
    },
    
    onBtnMIMAClicked:function(event){
        // if(this._mima[this._mimaIndex] == event.target.name){
        //     this._mimaIndex++;
        //     if(this._mimaIndex == this._mima.length){
                cc.find("Canvas/btn_yk").active = true;
        //     }
        // }
        // else{
        //     console.log("oh ho~~~");
        //     this._mimaIndex = 0;
        // }
    }
});
