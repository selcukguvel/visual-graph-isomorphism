var constants = (function() {
  var defaultNodeSize = 7;
  var clickedNodeSize = 10;
  var defaultEdgeWidth = 2;

  var firstGraphSvgID = "#graph1svg";
  var secondGraphSvgID = "#graph2svg";

  return {
    getDefaultNodeSize: function() {
      return defaultNodeSize;
    },
    getClickedNodeSize: function() {
      return clickedNodeSize;
    },
    getDefaultEdgeWidth: function() {
      return defaultEdgeWidth;
    },
    getFirstGraphSvgID: function() {
      return firstGraphSvgID;
    },
    getSecondGraphSvgID: function() {
      return secondGraphSvgID;
    }
  };
})();
