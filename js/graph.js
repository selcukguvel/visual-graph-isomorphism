var graph = function() {
  var simulationObjects;
  var nodes;
  var links;

  return {
    setSimulationObjects: function(_simulationObjects) {
      simulationObjects = _simulationObjects;
    },
    setNodes: function(_nodes) {
      nodes = _nodes;
    },
    setLinks: function(_links) {
      links = _links;
    },
    getSimulationObjects: function() {
      return simulationObjects;
    },
    getNodes: function() {
      return nodes;
    },
    getLinks: function() {
      return links;
    }
  };
};

var graphManager = (function() {
  var firstGraph;
  var secondGraph;
  var mappingBetweenGraphs;

  function storeGraphInstance(graph, graphOrder) {
    if (graphOrder === 1) firstGraph = graph;
    else if (graphOrder === 2) secondGraph = graph;
    clearMappingBetweenGraphs();
  }

  function storeMappingBetweenGraphs(mapping) {
    mappingBetweenGraphs = mapping;
  }

  function clearMappingBetweenGraphs() {
    mappingBetweenGraphs = null;
  }

  return {
    assignFirstGraph: function(graph) {
      storeGraphInstance(graph, 1);
    },
    assignSecondGraph: function(graph) {
      storeGraphInstance(graph, 2);
    },
    getFirstGraph: function() {
      return firstGraph;
    },
    getSecondGraph: function() {
      return secondGraph;
    },
    assignMappingBetweenGraphs: function(mapping) {
      storeMappingBetweenGraphs(mapping);
    },
    getMappingBetweenGraphs: function() {
      return mappingBetweenGraphs;
    }
  };
})();

var graphNodeClickHandler = (function() {
  var clickedNode;
  var otherNodeElementID;
  var targetRowID;

  function performActions(nodeObj, mapping) {
    revertPreviouslyClickedNodeActions();
    performCurrentlyClickedNodeActions(nodeObj, mapping);
  }

  function revertPreviouslyClickedNodeActions() {
    if (clickedNode != null && otherNodeElementID != null) {
      try {
        d3.select(clickedNode).attr("r", constants.getDefaultNodeSize());
        d3.select(otherNodeElementID).attr("r", constants.getDefaultNodeSize());
        document.getElementById(
          targetRowID
        ).style.backgroundColor = constants.getTableRowBackgroundColor();
      } catch (err) {
        // Newly uploaded graphs may haven't got ids of previously processed graphs.
        // Error is suppressed in here to not clear the variables when a new graph is uploaded.
      }
    }
  }

  function performCurrentlyClickedNodeActions(nodeObj, mapping) {
    clickedNode = nodeObj;
    setRowIDForResultsTable(mapping);
    scrollToRowInResultsTable();
    highlightRowInResultsTable();
  }

  function setRowIDForResultsTable(mapping) {
    var nodeID = d3.select(clickedNode).attr("realID");
    var isFirstGraph = d3
      .select(clickedNode)
      .attr("id")
      .includes(constants.getFirstGraphSvgID().substr(1));
    if (isFirstGraph) {
      // First graph node is selected
      var otherNodeID = mapping[nodeID];
      otherNodeElementID = constants.getSecondGraphSvgID() + otherNodeID;
      enlargeSizeOfNodes();
      targetRowID = nodeID + "-" + otherNodeID;
    } else {
      // Second graph node is selected
      var otherNodeID = Object.keys(mapping).find(
        key => mapping[key] === nodeID
      );
      otherNodeElementID = constants.getFirstGraphSvgID() + otherNodeID;
      enlargeSizeOfNodes();
      targetRowID = otherNodeID + "-" + nodeID;
    }
  }

  function enlargeSizeOfNodes() {
    d3.select(clickedNode).attr("r", constants.getClickedNodeSize());
    d3.select(otherNodeElementID).attr("r", constants.getClickedNodeSize());
  }

  function scrollToRowInResultsTable() {
    var $container = $("#result-scroll-pane"),
      $scrollTo = $(`#${targetRowID}`);

    $container.scrollTop(
      $scrollTo.offset().top - $container.offset().top + $container.scrollTop()
    );
  }

  function highlightRowInResultsTable() {
    document.getElementById(
      targetRowID
    ).style.backgroundColor = constants.getTableRowHighlightedBackgroundColor();
  }

  return {
    clickEvent: function(nodeObj, mapping) {
      performActions(nodeObj, mapping);
    }
  };
})();
