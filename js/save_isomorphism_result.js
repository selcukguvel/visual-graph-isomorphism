function saveIsomorphismResult() {
  requestSaveIsomorphismResult().then(response => {
    console.log(response);
    if (response.fileCreatedSuccess) {
      // Your file is saved to ..
      console.log(response.fileName);
    } else {
      // File couldn't be saved.
    }
  });
}

function requestSaveIsomorphismResult() {
  return fetch("http://127.0.0.1:5000/save-result", {
    method: "GET"
  }).then(response => response.json());
}
