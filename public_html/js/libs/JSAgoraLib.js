/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

JSAgoraLib = function(){
    function JAgoraNodeID(source, localID) {
        this.source = source;
        this.localID = localID;
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
    }
    
    function JAgoraArgument(id, postername, posterID, content, date) {
        this.id = id;
        this.posterName = postername;
        this.posterID = posterID;
        this.content = content;
        this.date = date;
	this.incomingEdges = [];
        this.outgoingEdges = [];
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
              prime = 31;
              result = 1;
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
    
}();
