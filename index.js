const fs = require('fs');
const csv = require('csv-parser');
const D3Node = require('d3-node');
const d3n = new D3Node();

const LICENSE_FILE_PATH = './data/fidelity.csv';

// Create a dictionary to store the data
const data = {};

// Read in the CSV file and store the data in the dictionary
fs.createReadStream(LICENSE_FILE_PATH)
  .pipe(csv())
  .on('data', (row) => {
    if (!data[row['User login']]) {
      data[row['User login']] = [];
    }
    data[row['User login']].push(row);
  })
  .on('end', () => {
    // Create a dictionary to store the most recent push for each unique user
    const mostRecentPush = {};

    // Loop through each user in the dictionary and find their most recent push
    for (const user in data) {
      mostRecentPush[user] = data[user].reduce((a, b) => {
        return new Date(a['Last pushed date']) > new Date(b['Last pushed date']) ? a : b;
      });
    }

    // Create a dictionary to store the number of pushes that happened on each date
    const pushesByDate = {};

    // Find the most recent date of all pushdates
    const mostRecentDate = Object.values(mostRecentPush).reduce((a, b) => {
      return new Date(a['Last pushed date']) > new Date(b['Last pushed date']) ? a : b;
    })['Last pushed date'];  

    console.log(mostRecentDate);

    // Loop through each user's most recent push and count how many pushes happened on each date
    for (const user in mostRecentPush) {
      const push = mostRecentPush[user];
      // console.log(push)
      if (!pushesByDate[push['Last pushed date']]) {
        pushesByDate[push['Last pushed date']] = 0;
      }
      pushesByDate[push['Last pushed date']]++;
    }

    // convert the pushesByDate object into an array of objects
    const pushesByDateArray = [];
    for (const date in pushesByDate) {
        pushesByDateArray.push({
            date: date,
            pushes: pushesByDate[date]
        });
    }

    // Sort the array of objects by date
    pushesByDateArray.sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    // Find the earliest and latest dates in the pushesByDateArray
const earliestDate = new Date(pushesByDateArray[pushesByDateArray.length - 1].date);
const latestDate = new Date(pushesByDateArray[0].date);

// Create an array of all dates between the earliest and latest dates
const allDates = [];
for (let date = earliestDate; date <= latestDate; date.setDate(date.getDate() + 1)) {
  allDates.push(new Date(date));
}

// Create a new array of objects that includes all dates and pushes
const allPushesByDateArray = allDates.map((date) => {
  const dateString = date.toISOString().substring(0, 10);
  const existingPush = pushesByDateArray.find((push) => push.date === dateString);

  // calculate number of days since the most recent push
  const daysSinceMostRecentPush = Math.round((latestDate - date) / (1000 * 60 * 60 * 24));

  return {
    date: dateString,
    pushes: existingPush ? existingPush.pushes : 0,
    daysSinceMostRecentPush
  };
});

// Sort the new array by date
allPushesByDateArray.sort((a, b) => new Date(b.date) - new Date(a.date));

    // save the data to a csv file
    const csvWriter = require('csv-writer').createObjectCsvWriter({
        path: './results/pushes-by-date.csv',
        header: [
            {id: 'date', title: 'Date'},
            {id: 'pushes', title: 'Pushes'},
            {id: 'daysSinceMostRecentPush', title: 'Days Since Most Recent Push'}
        ]
    });
    csvWriter.writeRecords(allPushesByDateArray);



    // Create the options for the bar chart
    const options = {
        ticks: 5,
        tickSize: 5,
        tickPadding: 5,
        color: 'steelblue',
        barPadding: 0.2,
        outerPadding: 0.3,
        xLabel: 'Date',
        yLabel: 'Committers',
        chartTitle: 'Committers by Date',
        width: 800,
        height: 600,
        margin: {
            top: 50,
            right: 50,
            bottom: 50,
            left: 50,
        },
    };

    // Create the bar chart
    const svg = d3n.createSVG(options.width, options.height);

    const x = d3n.d3.scaleBand()
      .range([0, options.width])
      .padding(options.barPadding)
      .domain(pushesByDateArray.map((d) => d.date));

    const y = d3n.d3.scaleLinear()
      .range([options.height, 0])
      .domain([0, d3n.d3.max(pushesByDateArray, (d) => d.pushes)]);

    svg.append('g')
      .attr('transform', `translate(0,${options.height})`)
      .call(d3n.d3.axisBottom(x));

    svg.append('g')
      .call(d3n.d3.axisLeft(y));

    svg.selectAll('rect')
      .data(pushesByDateArray)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.date) + options.margin.left)
      .attr('y', (d) => y(d.pushes))
      .attr('width', x.bandwidth())
      .attr('height', (d) => options.height - y(d.pushes))
      .attr('fill', options.color);

    svg.append('text')
      .attr('x', (options.width / 2))
      .attr('y', (options.margin.top / 2))
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .text(options.chartTitle);

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', (options.margin.left / 2))
      .attr('x', 0 - (options.height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'black')
      .text(options.yLabel);
    
    svg.append('text')
      .attr('x', (options.width / 2))
      .attr('y', options.height - options.margin.bottom +100)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('fill', 'black')
      .text(options.xLabel);



    // Save the chart as an SVG file
    fs.writeFileSync('./results/chart.svg', d3n.svgString());
  });