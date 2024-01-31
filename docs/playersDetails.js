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


// Custom Knockout.js binding
ko.bindingHandlers.dateOnly = {
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        if (value === null) {
            $(element).text("");
            return;
        }
        var splitValue = value.split("T")[0];
        $(element).text(splitValue);
    }
};


// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/NBA/API/Players/');
    self.displayName = 'NBA Players Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Birthdate = ko.observable('');
    self.CountryId = ko.observable('');
    self.CountryName = ko.observable('');
    self.DraftYear = ko.observable('');
    self.PositionId = ko.observable('');
    self.PositionName = ko.observable('');
    self.Height = ko.observable('');
    self.Weight = ko.observable('');
    self.School = ko.observable('');
    self.Photo = ko.observable('');
    self.Seasons = ko.observableArray([]);
    self.Teams = ko.observableArray([]);

    //--- Stats Record
    self.PlayerId = ko.observable('');
    self.Season = ko.observable('');
    self.TeamId = ko.observable('');
    self.Acronym = ko.observable('');
    self.Regular = ko.observableArray([]);
    self.Regular2 = ko.observable('');
    self.Playoff = ko.observableArray([]);
    self.Playoff2 = ko.observable('');


    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getPlayers...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Birthdate(data.Birthdate);
            self.CountryId(data.CountryId);
            self.CountryName(data.CountryName);
            self.DraftYear(data.DraftYear);
            self.PositionId(data.PositionId);
            self.PositionName(data.PositionName);
            self.Height(data.Height);
            self.Weight(data.Weight);
            self.School(data.School);
            self.Photo(data.Photo);
            self.Seasons(data.Seasons);
            self.Teams(data.Teams);

            $('body').on('click', '#statm', function() {
                // Get player's Id and season
                var playerId = self.Id();
                var season = $(this).find('span').text().slice(0, -3);
    
                // Construct API URL
                var apiUrl = `http://192.168.160.58/NBA/API/Players/Statistics?id=${playerId}&seasonId=${season}`;
    
                // Make HTTP request
                fetch(apiUrl)
                    .then(response => response.json())
                    .then(data => {
                        // Handle API response
                        console.log(data);
                        self.PlayerId(data.PlayerId);
                        self.Season(data.Season);
                        self.TeamId(data.TeamId);
                        self.Acronym(data.Acronym);
                        self.Regular(data.Regular);
                        self.Regular2(data.Regular.Rank);
                        self.Playoff(data.Playoff);
                        self.Playoff2(data.Playoff.Rank);
                    })
                    .catch(error => {
                        // Handle error
                        console.error('Error:', error);
                    });
            });
        });
    };

    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function showLoading() {
        $('#myModal').modal('show', {
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

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})