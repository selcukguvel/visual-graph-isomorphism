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
    }
  };
})();
