function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then(function(response) {
      console.log(response)

    // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
    let table = d3.select("#sample-metadata").html("")

    // Use `Object.entries` to add each key and value pair to the panel
    let cell = table.append("td");
    Object.entries(response).forEach(([key, value]) => {
      let row = cell.append("tr");
      row.text('${key}: ${value}');
    });

});

// const plotData = [];

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  let plotData = `/samples/${sample}`
  console.log("plotData=", plotData);
  d3.json(plotData).then(function(plotData) {
    // @TODO: Build a Bubble Chart using the sample data
    let bubbleChart = {
      x: plotData.otu_ids,
      y: plotData.sample_values,
      mode: `markers`,
      marker: {
        color: plotData.otu_ids,
        size: plotData.sample_values
      },
      text: plotData.otu_labels
    };

    let bubbleLayout = {
      height: 600,
      width: 1200
    };

    let bubbleData = [bubbleChart];
      Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    let pieChart = {
      values: plotData.sample_values.slice(0,10),
      labels: plotData.otu_ids.slice(0,10),
      hoverinfo: plotData.otu_labels.slice(0,10),
      text: plotData.otu_labels.slice(0,10),
      type: "pie"
    };
  
    let pieLayout = {
      hieght: 500,
      width: 600
    };

    let pieData = [pieChart];
      Plotly.newPlot("pie", pieData, pieLayout);

  });

};

function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
};

// Initialize the dashboard
init();
