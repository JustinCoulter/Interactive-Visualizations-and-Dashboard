function buildMetadata(sample) {
 
  const url =`/metadata/${sample}`;
  console.log(url);
  const metaMeta = d3.select("#sample-metadata");
  

  d3.json(url).then(function(data) {
    // console.log(data);

    metaMeta.html(""); 

    Object.entries(data).forEach(function([key,value]) {    
      const cell = metaMeta.append("p");
      cell.text(`${key}: ${value}`);
    });

  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

  const url =`/samples/${sample}`;
  // console.log(url);
  // const piePie = d3.select("#pie");

  
  d3.json(url).then(function(data) {

    console.log(data);

    var trace1 = {
        labels: data.otu_ids.slice(0,10),
        values: data.sample_values.slice(0,10),
        type: 'pie'
    };

    var dataPie = [trace1];

    var layout = {
      title: "Pie Chart",
    };
    
    Plotly.newPlot("pie", dataPie, layout);

    var trace2 = {
        type: "scatter",
        x:data.otu_ids,
        y:data.sample_values,
        text:data.otu_labels,
        mode:'markers',
        marker: { 
          size:data.sample_values,
          color:data.otu_ids
        }
        
    };

    var layout = {
      title: "Bubble Chart"
    }
    var dataBubble = [trace2];
    
    Plotly.newPlot("bubble", dataBubble, layout);    
    

  });
    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

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
}

// Initialize the dashboard
init();
