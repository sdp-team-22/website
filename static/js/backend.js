// GET appends data onto URL
// POST uploads data

document.getElementById('clickButton').addEventListener('click', function() {
    fetch('/handle_click', { method: 'POST'})
        .then(response => response.text())
        .then(data => console.log(data));
});

document.getElementById('filein').addEventListener('input', function() {
    var inputElement = document.getElementById('filein');
    // create formData object, add files into formData
    var formData = new FormData();
    for (let i = 0; i < inputElement.files.length; i++) {
        formData.append('files', inputElement.files[i]);
    }
    // create post request and handle responses
    fetch('/handle_input', {
        method: 'POST',
        body: formData
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
});