$(document).ready(function() {
  $("#graphfile1").on("change", function() {
    document.getElementById("loadingBar1").style.display = "block";
    var formData = new FormData($("#upload-file1")[0]);
    formData.append("graphOrder", 1);
    if (isFormDataEmpty(formData)) return;
    processGraphData(formData, 1, constants.getFirstGraphSvgID()).then(
      isGraphDrawnSuccess => {
        if (isGraphDrawnSuccess) {
          enableCheckIsomorphismButton();
          document.getElementById("result-scroll-pane").style.display = "none";
        }
        document.getElementById("loadingBar1").style.display = "none";
      }
    );
  });

  $("#graphfile2").on("change", function() {
    document.getElementById("loadingBar2").style.display = "block";
    var formData = new FormData($("#upload-file2")[0]);
    formData.append("graphOrder", 2);
    if (isFormDataEmpty(formData)) return;
    processGraphData(formData, 2, constants.getSecondGraphSvgID()).then(
      isGraphDrawnSuccess => {
        if (isGraphDrawnSuccess) {
          enableCheckIsomorphismButton();
          document.getElementById("result-scroll-pane").style.display = "none";
        }
        document.getElementById("loadingBar2").style.display = "none";
      }
    );
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
    document.getElementById("iso-btn").disabled = false;
    $("#iso-btn").css(
      "background-color",
      constants.getCheckIsomorphismButtonColor()
    );
  }
}
