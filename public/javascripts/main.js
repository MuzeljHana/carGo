$('.sidenav').sidenav();
$(document).ready(function() {
    M.updateTextFields();
});

let curr_location = window.location.pathname;
if (curr_location != "/login") {
    localStorage.setItem("last_page", curr_location);
}
