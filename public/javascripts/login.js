$("#prijava").submit(function (event) {
    event.preventDefault();
    $("#email").removeClass("invalid");
    $("#geslo").removeClass("invalid");

    $.ajax({
    method: "post",
    url: "/user/login",
    data: { email: $("#email").val(), geslo: $("#geslo").val() },
})
    .done(function (data) {
        console.log(data);
        if (data) {
            if (data.message == "login failed") {
                $("#email").addClass("invalid");
                $("#geslo").val("");
                $("#geslo").addClass("invalid");
            }
            if (data.message == "success") {
                window.location = "/";
            }
        }
    });
});
