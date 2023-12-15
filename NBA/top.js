// Get the select elements
let seasonSelect = document.getElementById('seasonSelect');
const seasonTypeSelect = document.getElementById('seasonTypeSelect');

// Create the initial chart
const ctx = document.getElementById('myChart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        scales: {
            y: {
                min: 0,
                max: 5,
            }
        }
    }
});

// Create a function to update the chart data
function updateChartData(data) {
    const seasonIndex = seasonSelect.value;
    const seasonData = data[seasonIndex];

    chart.data.labels = seasonData.Players.map(player => player.PlayerName);
    chart.data.datasets = [{
        label: 'Rank',
        data: seasonData.Players.map(player => player.Rank),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }];

    chart.update();
}

// Create a function to update the chart
function updateChart(apiUrl) {
    // Fetch data for the new season type
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            // Populate the season select element with options
            while (seasonSelect.firstChild) {
                seasonSelect.removeChild(seasonSelect.firstChild);
            }

            data.forEach((item, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.text = item.Season;
                seasonSelect.appendChild(option);
            });

            // Update the chart when a season is selected
            seasonSelect.addEventListener('change', () => {
                updateChartData(data);
            });

            // Trigger a change event to load the initial data for the season
            const event = new Event('change');
            seasonSelect.dispatchEvent(event);

            // Update the chart with the new data
            updateChartData(data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

// Update the chart when a season type is selected
seasonTypeSelect.addEventListener('change', (event) => {
    const seasonType = event.target.value;

    // Determine the API URL based on the selected season type
    let apiUrl;
    if (seasonType === 'Playoff Season') {
        apiUrl = 'http://192.168.160.58/NBA/API/Statistics/Top5RankedPlayerByPlayoffSeason';
    } else {
        apiUrl = 'http://192.168.160.58/NBA/API/Statistics/Top5RankedPlayerByRegularSeason';
    }

    // Update the chart with the new API URL
    updateChart(apiUrl);
});

// Trigger a change event to load the initial data for the season type
const event = new Event('change');
seasonTypeSelect.dispatchEvent(event);
