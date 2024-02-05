document.getElementById('clickButton').addEventListener('click', function() {
    fetch('/handle_click', { method: 'POST'})
        .then(response => response.text())
        .then(data => console.log(data));
});