$("document").ready(function () {
    var map = L.map('map', {
        fullscreenControl: true,
        fullscreenControlOptions: {
            position: 'topleft'
        }
    }).setView([0, 0], 2);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    var composedUri = "http://192.168.160.58/Olympics/api/Games?page=1&pagesize=100";
    ajaxHelper(composedUri, 'GET')
        .done(function (data) {
            console.log(data);
            $.each(data.Records, function (index, record) {
                L.marker([record.Lat, record.Lon]).addTo(map)
                    .bindPopup(record.Name + '<br>' + record.CityName + " (" + record.CountryName + ")<br><a class=\"text-dark text-decoration-none\" href =\"./GameDetails?id=" + record.Id+"\"><span class=\"text-danger\">&rarr;</span> Ver Jogos</a>");
            });
        });
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
        }
    });
}
