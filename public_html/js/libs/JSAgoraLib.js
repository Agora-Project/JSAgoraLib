/* Copyright (C) 2015 Agora Communication Corporation

    This program is free software; you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation; either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along
    with this program; if not, write to the Free Software Foundation, Inc.,
    51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
    
    */
exports.Buffer = require('buffer');
exports.IJSAgoraLib = { LOGIN_ACTION: 0,
LOGOUT_ACTION : 1,
QUERY_BY_THREAD_ID_ACTION : 2,
ADD_ARGUMENT_ACTION : 3,
ADD_ATTACK_ACTION : 4,
ADD_ARGUMENT_VOTE_ACTION : 5,
ADD_ATTACK_VOTE_ACTION : 6,
REGISTER_ACTION : 7,
QUERY_THREAD_LIST_ACTION : 8,
EDIT_ARGUMENT_ACTION : 9,
QUERY_BY_ARGUMENT_ID_ACTION : 10,
DELETE_ARGUMENT_ACTION : 11,

USER_ID_FIELD : "id",
USER_TYPE_FIELD : "utp",
SESSION_ID_FIELD : "sid",
ACTION_FIELD : "act",
USER_FIELD : "usr",
PASSWORD_FIELD : "pwd",
RESPONSE_FIELD : "r",
REASON_FIELD : "rs",
THREAD_ID_FIELD : "tID",
GRAPH_FIELD : "g",
THREAD_LIST_FIELD : "t",
CONTENT_FIELD : "c",
ATTACKER_FIELD : "att",
DEFENDER_FIELD : "def",
ARGUMENT_ID_FIELD : "aid",
VOTE_TYPE_FIELD : "vt",
EMAIL_FIELD : "@",

  // Content data
TEXT_FIELD : "txt",

  // Private constants for deconstructing server messages
SERVER_OK : 0,
SERVER_FAIL : 1

};

var BSON = bson().BSON;

exports.JSAgoraLib = function(url) {
    this.userID = -1;
    this.sessionID = null;
    this.usertype = -1;
    this.url = url;
    
    this.openConnection = function(Url) {
        var xmlHttp = new XMLHttpRequest(); 
        xmlHttp.open("POST", Url, false);
        //xmlHttp.responseType = "arraybuffer";
        return xmlHttp;
    };
    
    this.constructLoginRequest = function(user, password) {
        bson = {};
        bson[exports.IJSAgoraLib.ACTION_FIELD] = exports.IJSAgoraLib.LOGIN_ACTION;
        bson[exports.IJSAgoraLib.USER_FIELD] = user;
        bson[exports.IJSAgoraLib.PASSWORD_FIELD] = password;
        return bson;
    };

    this.parseLoginResponse = function(bson) {
        response = bson[exports.IJSAgoraLib.RESPONSE_FIELD];
        if (response === exports.IJSAgoraLib.SERVER_FAIL) {
            Log.error("[JSAgoraLib] Could not login (" + bson.REASON_FIELD + ")");
            return false;
        }

        // Success!
        sessionID = bson[exports.IJSAgoraLib.SESSION_ID_FIELD];
        userID = bson[exports.IJSAgoraLib.USER_ID_FIELD];
        userType = bson[exports.IJSAgoraLib.USER_TYPE_FIELD];
        return true;
    };
    
    /**
   * Performs a login with an Agora server.
   *
   * @param user
   * @param password
   * @return
   */
    this.login = function(user, password) {
        // TODO: Can't differentiate between what happened. Make return int?
        var s = this.openConnection(url);
        if (s == null) {
            alert("[JSAgoraLib] Could not connect because socket could not be opened.");
            return false;
        }

        var success = exports.JSAgoraComms.writeBSONObjectToHTTP(s,
                this.constructLoginRequest(user, password));
        if (!success) {
            alert("[JSAgoraLib] Could not send login message.");
            return false;
        }

        var response = exports.JSAgoraComms.readBSONObjectFromHTTP(s);
        if (response == null) {
            alert("[JSAgoraLib] Could not read login response.");
            return false;
        }
        success = this.parseLoginResponse(response);
        if (!success) {
            alert("[JSAgoraLib] Wrong login information.");
            return false;
        }

        alert("[JSAgoraLib] Successful login for " + user);
        return true;
    };
}

exports.hashCode = function(str) {
        var hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    };

exports.JSAgoraArgumentID = function(source, localID) {
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
          result = prime * result + ((source === null) ? 0 : hashCode(source));
          return result;
      };
}

exports.JSAgoraArgument = function(id, postername, posterID, content, date) {
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
    
    this.addIncomingEdge = function(arg) { incomingEdges.push(arg); };
    this.addOutgoingEdge = function(arg) { outgoingEdges.push(arg); };
}
    
exports.JSAgoraAttackID = function(originID, targetID) {
    this.originID = originID; //argID
    this.targetID = targetID; //argID
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

exports.JSAgoraAttack = function(origin, target) {
    this.origin = origin;
    this.target = target;
    this.id = new JSAgoraAttackID(origin.getID(), target.getID());
    
    this.construct = function(origin, target) {
    this.origin = origin;
    this.target = target;
    
    id = new JSAgoraAttackID(origin.getID(), target.getID());
  }

}

exports.JSAgoraThread = function(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
}

exports.JSAgoraGraph = function() {
    this.nodeMap = {};
    this.edgeMap = {};
    this.nodes = [];
    
    this.addNode = function(node) { 
        nodeMap[node.getID()] = node; 
        nodes.push(node);
    }
    
    this.addEdge = function(edge) {
		edgeMap[edge.getID()] = edge;
		edge.origin.addOutgoingEdge(edge);
		edge.target.addIncomingEdge(edge);
	}
}

exports.deBSONiseNodeID = function(bsonNodeID) {
    return new JSAgoraArgumentID(bsonNodeID.source,
        bsonNodeID.id);
}
 
exports.deBSONiseNode = function(bsonNode) {
    var nodeID = deBSONiseNodeID(bsonNode.id);
    var node = new JSAgoraArgument(nodeID);

    node.posterID = bsonNode.posterID;
    node.posterName = bsonNode.posterName;
    node.Date = new Date(bsonNode.date);
    node.threadID = bsonNode.threadID;
    node.content = bsonNode.content;
    
    return node;
}

exports.deBSONiseEdge = function(bsonEdge, graph) {
    var originID = deBSONiseNodeID(bsonEdge.origin);
    var targetID = deBSONiseNodeID(bsonEdge.target);

    // Check whether the origin nodes are or are not in the graph.
    // If they are not, simply add a node containing only an ID.
    // That should be enough to ask for it in case it's interesting.
    var originNode = null;
    var targetNode = null;

    if (graph.isInGraph(originID))
      originNode = graph.getNodeByID(originID);
    else
      originNode = new JSAgoraArgument(originID);

    if (graph.isInGraph(targetID))
      targetNode = graph.getNodeByID(targetID);
    else
      targetNode = new JSAgoraArgument(targetID);

    var e = new JSAgoraAttack(originNode, targetNode);

    return e;
}

 exports.deBSONiseGraph = function( bsonGraph) {
    var graph = new JSAgoraGraph();
    var nodes = bsonGraph.nodes;
    var n;
    for (n in nodes)
      graph.addNode(deBSONiseNode(n));

    var e, edges = bsonGraph.edges;
    for (e in edges)
      graph.addEdge(deBSONiseEdge(e, graph));

    return graph;
}

exports.JSAgoraComms = {
    readBSONObjectFromHTTP: function(s) {
        try {
            if ( s.readyState == 4 && s.status == 200 ) {
                var buf = new Buffer(s.response, 'utf16le')
                alert(buf);
                return BSON.deserialize(buf);
            }
            else alert("[JSAgoraComms] Could not access response.");
        } catch (ex) {
            alert("[JSAgoraComms] Could not read BSON object from HTTP: " + ex);
        }
        return null;
    },
    writeBSONObjectToHTTP: function(s, bson) {
    try {
      s.send(BSON.serialize(bson));
      return true;
    } catch (e) {
      alert("[JSAgoraComms] Could not write BSON object to socket: " + e);
    }
    
    return false;
  }
};