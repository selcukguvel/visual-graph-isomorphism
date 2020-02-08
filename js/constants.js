var constants = (function() {
  var defaultNodeSize = 8;
  var clickedNodeSize = 10;
  var defaultEdgeWidth = 2;

  var firstGraphSvgID = "#graph1svg";
  var secondGraphSvgID = "#graph2svg";

  var checkIsomorphismButtonColor = "rgb(108, 117, 125)";
  var isomorphicGraphsButtonColor = "rgb(56, 132, 56)";
  var nonIsomorphicGraphsButtonColor = "rgb(148, 56, 56)";

  var tableRowBackgroundColor = "rgb(76, 82, 88)";
  var tableRowHighlightedBackgroundColor = "rgb(70, 76, 81)";

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
    },
    getCheckIsomorphismButtonColor: function() {
      return checkIsomorphismButtonColor;
    },
    getIsomorphicGraphsButtonColor: function() {
      return isomorphicGraphsButtonColor;
    },
    getNonIsomorphicGraphsButtonColor: function() {
      return nonIsomorphicGraphsButtonColor;
    },
    getTableRowBackgroundColor: function() {
      return tableRowBackgroundColor;
    },
    getTableRowHighlightedBackgroundColor: function() {
      return tableRowHighlightedBackgroundColor;
    }
  };
})();
