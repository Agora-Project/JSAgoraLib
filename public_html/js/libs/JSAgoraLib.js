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

var BSON = bson().BSON;

function JAgoraLib(hostname, port) {
    this.userID = -1;
    this.sessionID = null;
    this.hostName = hostname;
    this.port = port;
    
    this.openConnection = function(Url) {
        var xmlHttp = new XMLHttpRequest(); 
        xmlHttp.open("POST", Url, true);
        return xmlHttp;
    }
}

function hashCode(str) {
        var hash = 0, i, chr, len;
        if (str.length === 0) return hash;
        for (i = 0, len = str.length; i < len; i++) {
            chr   = str.charCodeAt(i);
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
          result = prime * result + ((source === null) ? 0 : hashCode(source));
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
    
    this.addIncomingEdge = function(arg) { incomingEdges.push(arg); };
    this.addOutgoingEdge = function(arg) { outgoingEdges.push(arg); };
}
    
function JAgoraAttackID(originID, targetID) {
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

function JAgoraAttack(origin, target) {
    this.origin = origin;
    this.target = target;
    this.id = new JAgoraAttackID(origin.getID(), target.getID());
    
    this.construct = function(origin, target) {
    this.origin = origin;
    this.target = target;
    
    id = new JAgoraAttackID(origin.getID(), target.getID());
  }

}

function JAgoraThread(id, title, description) {
    this.id = id;
    this.title = title;
    this.description = description;
}

function JAgoraGraph() {
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

function deBSONiseNodeID(bsonNodeID) {
    return new JAgoraArgumentID(bsonNodeID.source,
        bsonNodeID.id);
}
 
function deBSONiseNode(bsonNode) {
    var nodeID = deBSONiseNodeID(bsonNode.id);
    var node = new JAgoraArgument(nodeID);

    node.posterID = bsonNode.posterID;
    node.posterName = bsonNode.posterName;
    node.Date = new Date(bsonNode.date);
    node.threadID = bsonNode.threadID;
    node.content = bsonNode.content;
    
    return node;
}

function deBSONiseEdge(bsonEdge, graph) {
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
      originNode = new JAgoraArgument(originID);

    if (graph.isInGraph(targetID))
      targetNode = graph.getNodeByID(targetID);
    else
      targetNode = new JAgoraArgument(targetID);

    var e = new JAgoraAttack(originNode, targetNode);

    return e;
}

function deBSONiseGraph( bsonGraph) {
    var graph = new JAgoraGraph();
    var nodes = bsonGraph.nodes;
    var n;
    for (n in nodes)
      graph.addNode(deBSONiseNode(n));

    var e, edges = bsonGraph.edges;
    for (e in edges)
      graph.addEdge(deBSONiseEdge(e, graph));

    return graph;
  }