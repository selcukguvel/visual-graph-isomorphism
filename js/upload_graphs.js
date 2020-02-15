$(document).ready(function() {
  $("#graphfile1").on("change", function() {
    performUploadAction("#upload-file1", 1, "loadingBar1");
  });

  $("#graphfile2").on("change", function() {
    performUploadAction("#upload-file2", 2, "loadingBar2");
  });

  $(".custom-file-input").on("change", function() {
    var fileName = $(this)
      .val()
      .split("\\")
      .pop();
    $(this)
      .siblings(".custom-file-label")
      .addClass("selected")
      .html(fileName);
  });
});

function performUploadAction(uploadFileFormID, graphOrder, loadingBarID) {
  var formData = new FormData($(uploadFileFormID)[0]);
  formData.append("graphOrder", graphOrder);
  if (isFormDataEmpty(formData)) return;
  document.getElementById(loadingBarID).style.display = "block";
  var svgID =
    graphOrder == 1
      ? constants.getFirstGraphSvgID()
      : constants.getSecondGraphSvgID();
  processGraphData(formData, graphOrder, svgID).then(isGraphDrawnSuccess => {
    if (isGraphDrawnSuccess) {
      enableCheckIsomorphismButton();
    } else {
      d3.select(svgID)
        .selectAll("*")
        .remove();
      clearIsomorphismResult();
      $("#check-iso-btn").css(
        "background-color",
        constants.getCheckIsomorphismButtonColor()
      );
      document.getElementById("check-iso-btn").disabled = true;
    }
    document.getElementById("result-container").style.display = "none";
    document.getElementById(loadingBarID).style.display = "none";
  });
}

function isFormDataEmpty(formData) {
  // console.log(...formData);
  var iter = formData.entries();
  var fileName = iter.next().value[1].name;
  return fileName === "";
}

function enableCheckIsomorphismButton() {
  if (
    graphManager.getFirstGraph() != null &&
    graphManager.getSecondGraph() != null
  ) {
    document.getElementById("iso-checker-container").style.display = "block";
    document.getElementById("check-iso-btn").disabled = false;
    $("#check-iso-btn").css(
      "background-color",
      constants.getCheckIsomorphismButtonColor()
    );
  }
}

function clearIsomorphismResult() {
  $("#result-scroll-pane tbody").empty();
  $(".saved-file-info").empty();
}
