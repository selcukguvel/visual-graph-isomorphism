function processGraphData(formData, graphOrder, svgID) {
  return getParsedGraphData(formData).then(graphJSON => {
    if (graphJSON["error"] == null) {
      console.log("graph", graphJSON);

      let simulationObjects = createSimulationObjects(graphJSON, svgID);
      createGraphObject(graphOrder, graphJSON, simulationObjects);
      return true;
    } else {
      alert("Unsupported File Format");
      return false;
    }
  });
}

function getParsedGraphData(formData) {
  return fetch("http://127.0.0.1:5000/parse", {
    method: "POST",
    body: formData
  }).then(response => response.json());
}

function createSimulationObjects(graph, svgID) {
  var svg = d3.select(svgID),
    width = +svg.attr("width"),
    height = +svg.attr("height");

  svg.selectAll("*").remove();

  var simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3.forceLink().id(function(d) {
        return d.id;
      })
    )
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2));

  var color = d3.scaleOrdinal(d3.schemeCategory20);

  var link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke-width", function(d) {
      // Edge width, can be set to a specific value if the graph is undirected
      if (d.value == null) return constants.getDefaultEdgeWidth();
      else return Math.sqrt(d.value);
    });

  var node = svg
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(graph.nodes)
    .enter()
    .append("circle")
    .attr("realID", function(d) {
      return d.id;
    })
    .attr("id", function(d) {
      return svgID.substring(1) + d.id;
    })
    .attr("r", constants.getDefaultNodeSize())
    .attr("fill", function(d) {
      return color(d.group);
    })
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  node.append("title").text(function(d) {
    return "Node " + d.id;
  });

  node.on(
    "click",
    function() {
      d3.selectAll("circle").attr("r", constants.getDefaultNodeSize());
      d3.select(this).attr("r", constants.getClickedNodeSize());
      // Check whether mapping between graphs is available
      var mapping = graphManager.getMappingBetweenGraphs();
      if (mapping != null) {
        var nodeId = d3.select(this).attr("realID");
        console.log(nodeId);
        var targetRowID;
        if (Object.keys(mapping).includes(nodeId)) {
          // First graph
          var secondGraphNodeID = mapping[nodeId];
          d3.select(constants.getSecondGraphSvgID() + secondGraphNodeID).attr(
            "r",
            constants.getClickedNodeSize()
          );
          targetRowID = nodeId + "-" + secondGraphNodeID;
        } else if (Object.keys(values).includes(nodeId)) {
          // Second graph
          var firstGraphNodeID = Object.keys(mapping).find(
            key => obj[key] === nodeId
          );
          d3.select(constants.getFirstGraphSvgID() + firstGraphNodeID).attr(
            "r",
            constants.getClickedNodeSize()
          );
          targetRowID = firstGraphNodeID + "-" + nodeId;
        }
        // var a = document.getElementById(targetRowID).offsetHeight;
        // console.log(a);
        // $("#result-scroll-pane").scrollTop(45); // Get the td elements of table, go to that position and highlight it.

        var $container = $("#result-scroll-pane"),
          $scrollTo = $(`#${targetRowID}`);

        console.log($container.scrollTop());
        console.log($scrollTo.offset().top);
        console.log($container.offset().top);

        $container.scrollTop(
          $scrollTo.offset().top -
            $container.offset().top +
            $container.scrollTop()
        );

        // document.getElementById(targetRowID).style.backgroundColor =
        //   "rgb(166, 179, 191)";
      }
      //  Scroll down in the scroll pane in order to highlight the
      //  row which contains the clicked node and the target node.
    }
    // d3.select(this).attr("id", function(d) {
    //   console.log(d.id);
    //   return d.id;
    // });
  );

  simulation.alpha(2);
  simulation.nodes(graph.nodes).on("tick", ticked);

  simulation.force("link").links(graph.links);

  function ticked() {
    link
      .attr("x1", function(d) {
        return d.source.x;
      })
      .attr("y1", function(d) {
        return d.source.y;
      })
      .attr("x2", function(d) {
        return d.target.x;
      })
      .attr("y2", function(d) {
        return d.target.y;
      });

    node
      .attr("cx", function(d) {
        return d.x;
      })
      .attr("cy", function(d) {
        return d.y;
      });
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return { simulation: simulation, node: node, link: link };
}

function createGraphObject(graphOrder, graphJSON, simulationObjects) {
  var graphObj = graph();

  graphObj.setNodes(graphJSON.nodes);
  graphObj.setLinks(graphJSON.links);
  graphObj.setSimulationObjects(simulationObjects);

  if (graphOrder === 1) {
    graphManager.assignFirstGraph(graphObj);
  } else if (graphOrder === 2) {
    graphManager.assignSecondGraph(graphObj);
  }
}
