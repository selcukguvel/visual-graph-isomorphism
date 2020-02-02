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
    $("#iso-btn").css("background-color", "rgb(108, 117, 125)");
  }
}

$(document).ready(function() {
  $("#graphfile1").on("change", function() {
    var formData = new FormData($("#upload-file1")[0]);
    formData.append("graphOrder", 1);
    if (isFormDataEmpty(formData)) return;
    processGraphData(formData, 1, "#graph1svg").then(isGraphDrawnSuccess => {
      enableCheckIsomorphismButton();
    });
  });

  $("#graphfile2").on("change", function() {
    var formData = new FormData($("#upload-file2")[0]);
    formData.append("graphOrder", 2);
    if (isFormDataEmpty(formData)) return;
    processGraphData(formData, 2, "#graph2svg").then(isGraphDrawnSuccess => {
      enableCheckIsomorphismButton();
    });
  });
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
