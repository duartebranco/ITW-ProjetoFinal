// Load the Visualization API and the piechart package.
google.charts.load('current', { 'packages': ['bar'] });
google.charts.setOnLoadCallback(drawChart);

var composedUri = "http://192.168.160.58/Olympics/api/statistics/games_athletes";
// Set chart options
var options = {
    chart: {
        title: 'Estatísticas Gerais',
        subtitle: 'N.º de Atletas por Edição dos Jogos Olímpicos',
    },
    bars: 'horizontal', // Required for Material Bar Charts.
    legend: { position: 'none' },
    height: 800,
    hAxis: { textStyle: { fontSize: 11, fontName: 'Open Sans' } },
    vAxis: { textStyle: { fontSize: 11, fontName: 'Open Sans' } }
};

// Callback that creates and populates a data table,
// instantiates the pie chart, passes in the data and
// draws it.
function drawChart() {
    // Create our data table.
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Edição'); // Implicit domain label col.
    data.addColumn('number', 'Atletas'); // Implicit series 1 data col.
    ajaxHelper(composedUri, 'GET').done(function (stats) {
        // Interact with the data returned
        $.each(stats, function (index, item) {
            data.addRow([item.Name, item.Counter]);
        })
        // Instantiate and draw our chart, passing in some options.
        var chart = new google.charts.Bar(document.getElementById('chart_div'));
        chart.draw(data, options);
    });
}

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