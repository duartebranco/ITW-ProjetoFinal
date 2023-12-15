console.log(localStorage.getItem('theme'));

// Add event listener
$('.switch').click(function() {
    if ($('html').attr('data-bs-theme') == 'dark') {

        $('html').removeAttr('data-bs-theme');
        localStorage.removeItem('theme');
        console.log(localStorage.getItem('theme'));
        $(this).children('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
        return;
    } else {
        $('html').attr('data-bs-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        console.log(localStorage.getItem('theme'));
        $(this).children('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
        return;
    }
});

// On page load, check local storage for theme preference
$(window).on('load', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        $('html').attr('data-bs-theme', 'dark');
        // Change the icon to 'fa-toggle-off' when the theme is 'dark'
        $('.switch').children('i').removeClass('fa-toggle-on').addClass('fa-toggle-off');
    } else {
        // Change the icon to 'fa-toggle-on' when the theme is not 'dark'
        $('.switch').children('i').removeClass('fa-toggle-off').addClass('fa-toggle-on');
    }
});


//--- Internal functions
function ajaxHelper(uri, method, data) {
    return $.ajax({
        type: method,
        url: uri,
        dataType: 'json',
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : null,
        error: function (jqXHR, textStatus, errorThrown) {
            console.log("AJAX Call[" + uri + "] Fail...");
            hideLoading();
        }
    });

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}

function showLoading() {
    $("#myModal").modal('show', {
        backdrop: 'static',
        keyboard: false
    });
}
function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    })
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    console.log("sPageURL=", sPageURL);
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!")
};

//--- Page Events
self.activate = function (id) {
    console.log('CALL: getAthletes...');
    var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
    ajaxHelper(composedUri, 'GET').done(function (data) {
        console.log(data);
        hideLoading();
        self.records(data.Records);
        self.currentPage(data.CurrentPage);
        self.hasNext(data.HasNext);
        self.hasPrevious(data.HasPrevious);
        self.pagesize(data.PageSize)
        self.totalPages(data.TotalPages);
        self.totalRecords(data.TotalRecords);
        self.SetFavourites();
    });
};
function showLoading() {
    $("#myModal").modal('show', {
        keyboard: false
    });
}
function hideLoading() {
    $('#myModal').on('shown.bs.modal', function (e) {
        $("#myModal").modal('hide');
    });
}

function sleep(milliseconds) {
    const start = Date.now();
    while (Date.now() - start < milliseconds);
}


$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})


function removeFav(Id) {
    console.log("remove fav")
    $("#fav-" + Id).remove();

    let fav = JSON.parse(localStorage.fav || '[]');

    const index = fav.indexOf(Id);

    if (index != -1)
        fav.splice(index, 1);

    localStorage.setItem("fav", JSON.stringify(fav));
}


$(document).ready(function () {
    showLoading();

    let fav = JSON.parse(localStorage.fav || '[]');

    console.log(fav);


    for (const Id of fav) {
        console.log(Id);

        ajaxHelper('http://192.168.160.58/NBA/api/Players/' + Id, 'GET').done(function (data) {
            console.log(data)
            if (localStorage.fav.length != 0) {
                $("#table-favourites").show();
                $('#noadd').hide();
                $('#nofav').hide();
                $("#table-favourites").append(
                    `<tr id="fav-${Id}">
                        <td class="align-middle">${data.Name}</td>
                        <td class="align-middle">${data.Birthdate.substring(0, data.Birthdate.length - 9)}</td>
                        <td class="align-middle">${data.CountryName}</td>
                        <td class="align-middle">${data.PositionName}</td>
                        <td class="align-middle">${data.Height}</td>
                        <td class="align-middle">${data.Weight}</td>
                        <td class="align-middle"><img style="height: 50px;" src="${data.Photo}"></td>
                        <td class="text-end">
                            <a class="btn btn-outline-primary btn-xs" href="playersDetails.html?id=${Id}"><i class="fa fa-eye" title="Selecione para ver detalhes"></i></a>
                            <a class="btn btn-outline-danger btn-xs btn-favourite" onclick="removeFav(${Id})"><i class="fa fa-heart text-danger" title="Selecione para remover dos favoritos"></i></a>
                        </td>
                    </tr>`
                )
            }
        });
        sleep(50);
    }

    hideLoading();
})