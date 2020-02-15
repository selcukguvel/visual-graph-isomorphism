function saveIsomorphismResult() {
  requestSaveIsomorphismResult().then(response => {
    console.log(response);
    if (response.fileCreatedSuccess) {
      $(".saved-file-info").text(response.fileName);
      console.log(response.fileName);
    } else {
      $(".saved-file-info").text("The file couldn't be created.");
    }
  });
}

function requestSaveIsomorphismResult() {
  return fetch("http://127.0.0.1:5000/save-result", {
    method: "GET"
  }).then(response => response.json());
}
