function ViewModel() {
    var self = this;

    self.Name = ko.observable('');
    self.Players = ko.observableArray([]);

    self.searchPlayers = function() {
        var query = self.Name();
        fetch("http://192.168.160.58/NBA/Players/Search?q=" + query)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                self.Players(data.data);
            })
            .catch(function(error) {
                console.log(error);
            });
    };
}