document.getElementById("submitBtn").addEventListener("click", function(event){
    event.preventDefault();

    const authentication = { // only for testing, hashing will be used in production
        username: "usersdp",
        password: "sdp_22"
    };

    const getUser = document.getElementById("username").value;
    const getPassword = document.getElementById("password").value;

    var loginBox = document.querySelector(".login-box")

    if(getUser === authentication.username && getPassword === authentication.password){
        loginBox.style.display = "none";
        document.getElementById("mainContent").style.display = "block";
    } else {
        document.getElementById("Error").textContent = "Incorrect username or password. Please try again.";
        document.getElementById("username").value = "";
        document.getElementById("password").value = "";

}
});

/**
 * Choosing Pages
 */

const statisticsPage = document.getElementById('statistics-page');
const inputPage = document.getElementById('input-page');
const searchPage = document.getElementById('search-page');

function showStatisticsPage() {
    statisticsPage.style.display = 'block';
    inputPage.style.display = 'none';
    searchPage.style.display = 'none';
}

function showInputPage() {
    statisticsPage.style.display = 'none';
    inputPage.style.display = 'block';
    searchPage.style.display = 'none';
}

function showSearchPage() {
    statisticsPage.style.display = 'none';
    inputPage.style.display = 'none';
    searchPage.style.display = 'block';
}

/**
 * Toggle Searching
 */
const normalSearch = document.getElementById('normal-search');
const advancedSearch = document.getElementById('advanced-search');

function toggleAdvancedSearch(){
    advancedSearch.style.display = (advancedSearch.style.display === 'none' || advancedSearch.style.display === '') ? 'block' : 'none';
    normalSearch.style.display = (advancedSearch.style.display === 'none' || advancedSearch.style.display === '') ? 'block' : 'none';
}