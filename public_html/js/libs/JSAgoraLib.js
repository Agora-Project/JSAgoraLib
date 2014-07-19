/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

JSAgoraLib = function(){
    String.prototype.hashCode = function() {
        var hash = 0, i, chr, len;
        if (this.length === 0) return hash;
        for (i = 0, len = this.length; i < len; i++) {
            chr   = this.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };
    
    function JAgoraArgumentID(source, localID) {
        this.source = new String(source);
        this.localID = new Number(localID);
        this.equals = function(obj) {
            if (this === obj)
                return true;
            if (obj === null)
                return false;
            if (localID === null) {
                if (obj.localID !== null)
                    return false;
            } else if (localID !== obj.localID)
                return false;
            if (source === null) {
                if (obj.source !== null)
                    return false;
            } else if (source !== obj.source)
                return false;
            return true;
          };
          this.hashcode = function() {
              var prime = 31;
              var result = 1;
              result = prime * result + ((localID === null) ? 0 : localID);
              result = prime * result + ((source === null) ? 0 : source.hashCode());
              return result;
          };
    }
    
    function JAgoraArgument(id, postername, posterID, content, date) {
        this.id = id;
        this.posterName = new String(postername);
        this.posterID = new Number(posterID);
        this.content = content;
        this.date = date;
	this.incomingEdges = [];
        this.outgoingEdges = [];
        this.hashCode = function() {
		return id.hashCode();
	};
    }
    
    function JAgoraAttackID(originID, targetID) {
        this.originID = originID;
        this.targetID = targetID;
        this.equals = function(obj) {
            if (this === obj)
                return true;
            if (obj === null)
                return false;
            if (originID === null) {
                if (obj.originID !== null)
                    return false;
            } else if (originID !==obj.originID)
                return false;
            if (targetID === null) {
                if (obj.targetID !== null)
                    return false;
            } else if (targetID !== obj.targetID)
                return false;
            return true;
          };
          this.hashCode = function() {
              var prime = 31;
              var result = 1;
              result = prime * result + ((this.originID === null) ? 0 : this.originID.hashCode());
              result = prime * result + ((this.targetID === null) ? 0 : this.targetID.hashCode());
              return result;
          }
    }
    
    function JAgoraAttack(origin, target) {
        this.origin = origin;
        this.target = target;
        this.id = new JAgoraAttackID(origin.getID(), target.getID());
        
    }
    
    function JAgoraThread(id, title, description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
    
    function JAgoraGraph() {
        this.nodeMap = {};
        this.edgeMap = {};
    }
    
}();
