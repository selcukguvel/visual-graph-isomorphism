function showIsomorphismResult() {
  document.getElementById("check-iso-btn").disabled = true;
  document.getElementById("save-iso-results-btn").disabled = true;
  getIsomorphismResult().then(isomorphismJSON => {
    if (isomorphismJSON.isIsomorphic) {
      $("#result-scroll-pane tbody").empty();
      document.getElementById("result-container").style.display = "block";
      $("#check-iso-btn").css(
        "background-color",
        constants.getIsomorphicGraphsButtonColor()
      );

      graphManager.assignMappingBetweenGraphs(isomorphismJSON.mapping);
      updateFirstGraph(isomorphismJSON.mapping);
      enableCheckIsomorphismButtonAfterUpdate();
    } else {
      $("#check-iso-btn").css(
        "background-color",
        constants.getNonIsomorphicGraphsButtonColor()
      );
    }
  });
  $("#check-iso-btn").trigger("blur");
  $("#save-iso-results-btn").trigger("blur");
}

function getIsomorphismResult() {
  return fetch("http://127.0.0.1:5000/isomorphism", {
    method: "GET"
  }).then(response => response.json());
}

function updateFirstGraph(mapping) {
  var firstGraph = graphManager.getFirstGraph();
  var secondGraph = graphManager.getSecondGraph();

  var firstGraphNodes = firstGraph.getNodes();

  updateNodesUsingMapping(firstGraphNodes, secondGraph.getNodes(), mapping);
}

async function updateNodesUsingMapping(
  firstGraphNodes,
  secondGraphNodes,
  mapping
) {
  const numberOfNodes = firstGraphNodes.length;
  sortFirstGraphNodes(firstGraphNodes, secondGraphNodes, mapping);
  for (let firstGraphNode of firstGraphNodes) {
    var secondGraphNode = getMappedSecondGraphNode(
      firstGraphNode,
      secondGraphNodes,
      mapping
    );
    firstGraphNode.fx = secondGraphNode.x;
    firstGraphNode.fy = secondGraphNode.y;

    let [firstGraphNodeID, secondGraphNodeID] = [
      firstGraphNode.id,
      secondGraphNode.id
    ];
    var nodeColor = getRandomNodeColor(numberOfNodes, firstGraphNodeID);
    restart(firstGraphNodeID, secondGraphNodeID, nodeColor);
    addMappingRowToTable(nodeColor, firstGraphNodeID, secondGraphNodeID);
    await new Promise(r => setTimeout(r, constants.getNodeUpdatingInterval()));
  }
}

function sortFirstGraphNodes(firstGraphNodes, secondGraphNodes, mapping) {
  /* Sort nodes of first graph in increasing order with respect to the
     euclidean distance between the mapped second graph nodes.
     By doing that, the nodes with smallest distances between the mapped nodes will
     be arranged earlier. */

  firstGraphNodes.sort(function(node1, node2) {
    var node1Dist = getDistBetweenNodeCoordinates(
      node1,
      secondGraphNodes,
      mapping
    );
    var node2Dist = getDistBetweenNodeCoordinates(
      node2,
      secondGraphNodes,
      mapping
    );

    if (node1Dist < node2Dist) {
      return -1;
    }
    if (node1Dist > node2Dist) {
      return 1;
    }
    return 0;
  });
}

function getDistBetweenNodeCoordinates(node, secondGraphNodes, mapping) {
  var secondGraphNode = getMappedSecondGraphNode(
    node,
    secondGraphNodes,
    mapping
  );
  return Math.hypot(node.x - secondGraphNode.x, node.y - secondGraphNode.y);
}

function getMappedSecondGraphNode(node, secondGraphNodes, mapping) {
  var id = node.id;
  var targetID = mapping[id];
  var secondGraphNode = secondGraphNodes.filter(function(e) {
    return e.id == targetID;
  })[0];
  return secondGraphNode;
}

function getRandomNodeColor(numOfSteps, step) {
  // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
  // Adam Cole, 2011-Sept-14
  // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
  var r, g, b;
  var h = step / numOfSteps;
  var i = ~~(h * 6);
  var f = h * 6 - i;
  var q = 1 - f;
  switch (i % 6) {
    case 0:
      r = 1;
      g = f;
      b = 0;
      break;
    case 1:
      r = q;
      g = 1;
      b = 0;
      break;
    case 2:
      r = 0;
      g = 1;
      b = f;
      break;
    case 3:
      r = 0;
      g = q;
      b = 1;
      break;
    case 4:
      r = f;
      g = 0;
      b = 1;
      break;
    case 5:
      r = 1;
      g = 0;
      b = q;
      break;
  }
  var c =
    "#" +
    ("00" + (~~(r * 255)).toString(16)).slice(-2) +
    ("00" + (~~(g * 255)).toString(16)).slice(-2) +
    ("00" + (~~(b * 255)).toString(16)).slice(-2);
  return c;
}

function restart(firstGraphNodeId, secondGraphNodeId, color) {
  var firstGraph = graphManager.getFirstGraph();

  var firstGraphNodes = firstGraph.getNodes();
  var firstGraphLinks = firstGraph.getLinks();

  var simulation = firstGraph.getSimulationObjects().simulation;

  var firstGraphNodeElementID =
    constants.getFirstGraphSvgID() + firstGraphNodeId;
  d3.select(firstGraphNodeElementID).attr("r", constants.getDefaultNodeSize());
  d3.select(firstGraphNodeElementID).attr("fill", function(d) {
    return color;
  });

  var secondGraphNodeElementID =
    constants.getSecondGraphSvgID() + secondGraphNodeId;
  d3.select(secondGraphNodeElementID).attr("r", constants.getDefaultNodeSize());
  d3.select(secondGraphNodeElementID).attr("fill", function(d) {
    return color;
  });

  // Update and restart the simulation.
  simulation.nodes(firstGraphNodes);
  simulation.force("link").links(firstGraphLinks);
  simulation.alpha(0.5).restart();
}

function addMappingRowToTable(nodeColor, firstGraphNodeID, secondGraphNodeID) {
  let leftRow = `<b><font color="${nodeColor}">${firstGraphNodeID}</font></b>`;
  let rightRow = `<b><font color="${nodeColor}">${secondGraphNodeID}</font></b>`;

  $("#result-table").append(
    `<tr id="${firstGraphNodeID}-${secondGraphNodeID}"><td>${leftRow}</td><td>${rightRow}</td></tr>`
  );
  $("#result-scroll-pane").scrollTop($("#result-table")[0].scrollHeight);
}

function enableCheckIsomorphismButtonAfterUpdate() {
  setTimeout(function() {
    document.getElementById("check-iso-btn").disabled = false;
    document.getElementById("save-iso-results-btn").disabled = false;
  }, graphManager.getFirstGraph().getNodes().length *
    constants.getNodeUpdatingInterval());
}
