$('.sidenav').sidenav();
$(document).ready(function() {
    M.updateTextFields();
});

let curr_location = window.location.pathname;
if (!["/login", "/register"].includes(curr_location)) {
    localStorage.setItem("last_page", curr_location);
}
