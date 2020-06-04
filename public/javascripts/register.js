$("#i_registracija").click(function () {
    if ($("#i_pgeslo").val() == $("#i_geslo").val()) {
        let data = {
            ime: $("#i_ime").val(),
            priimek: $("#i_priimek").val(),
            postna_stevilka: $("#i_postna_stevilka").val(),
            kraj: $("#i_kraj").val(),
            ulica: $("#i_ulica").val(),
            hisna_stevilka: $("#i_hisna_stevilka").val(),
            email: $("#i_email").val(),
            geslo: $("#i_geslo").val()
        };

        $.ajax({
            method: "post",
            url: "/user/register",
            data: data,
            dataType: "json"
        })
            .done(function (data) {
                console.log(data + " ");
                if (data) {
                    if (data.message == "User exists") {
                        $("#i_email").addClass("invalid");
                    }
                    if (data.message == "password format incorrect") {
                        $("#i_geslo").addClass("invalid");
                    }
                    if (data.message == "success") {
                        window.location = "/login";
                    }
                }
            });
    } else {
        $("#i_pgeslo").addClass("invalid");
    }
});

$("#i_pgeslo").focusout(function () {
    $("#i_pgeslo").removeClass("invalid");
    if ($("#i_pgeslo").val() != $("#i_geslo").val()) {
        $("#i_pgeslo").addClass("invalid");
    } else {
        $("#i_pgeslo").addClass("valid");
    }
});

$("#p_pgeslo").focusout(function () {
    $("#p_pgeslo").removeClass("invalid");
    if ($("#p_pgeslo").val() != $("#p_geslo").val()) {
        $("#p_pgeslo").addClass("invalid");
    } else {
        $("#p_pgeslo").addClass("valid");
    }
});

$("#p_registracija").click(function () {
    if ($("#p_pgeslo").val() == $("#p_geslo").val()) {
        let date_arr = $("#zacetek_delovanja").val().split(".");
        let zacetek_delovanja = `${date_arr[2]}-${date_arr[1]}-${date_arr[0]}`;

        let data = {
            ime: $("#p_ime").val(),
            priimek: $("#p_priimek").val(),
            postna_stevilka: $("#p_postna_stevilka").val(),
            kraj: $("#p_kraj").val(),
            ulica: $("#p_ulica").val(),
            hisna_stevilka: $("#p_hisna_stevilka").val(),
            email: $("#p_email").val(),
            geslo: $("#p_geslo").val(),
            naziv_podjetja: $("#naziv_podjetja").val(),
            davcna: $("#davcna").val(),
            zacetek_delovanja: zacetek_delovanja,
            uspesnost_poslovanja: $("#uspesnost_poslovanja").val()
        };

        $.ajax({
            method: "post",
            url: "/user/register",
            data: data,
            dataType: "json"
        })
            .done(function (data) {
                console.log(data);
                if (data) {
                    if (data.message == "User exists") {
                        $("#p_email").addClass("invalid");
                    }
                    if (data.message == "password format incorrect") {
                        $("#p_geslo").addClass("invalid");
                    }
                    if (data.message == "success") {
                        window.location = "/login";
                    }
                }
            });
    }
});
