
const endpointUrl = 'https://query.wikidata.org/sparql';
const sparqlQuery = `
SELECT DISTINCT ?item ?itemLabel ?subclassOf ?subclassOfLabel ?foodEnergy WHERE {
    ?item p:P7971 ?statement0.
    ?statement0 ps:P7971 ?foodEnergy.
    OPTIONAL { ?item wdt:P279 ?subclassOf. }
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
`;

// Perform the query and process the data once
async function fetchData() {
    try {
        const response = await fetch(endpointUrl + "?query=" + encodeURIComponent(sparqlQuery), {
            headers: { 'Accept': 'application/json' }
        });
        const data = await response.json();
        const sparqlData = data.results.bindings.map(item => {
            return {
                name: item.itemLabel.value,
                category: item.subclassOfLabel ? item.subclassOfLabel.value : "Unknown", // Handle missing categories
                calories: parseInt(item.foodEnergy.value) || 0, // Handle missing calories
            };
        });

        return sparqlData; // Return sparqlData
    } catch (error) {
        console.error("Error fetching data from SPARQL endpoint", error);
    }
}
// Call renderBarChart to initialize the chart with empty data
fetchData().then(data => {
sparqlData = data;
renderBarChart(); 
});

// Initialize the chart and data
let selectedItems = [];
const svg = d3.select("#bar-chart");
const margin = { top: 20, right: 20, bottom: 100, left: 100 };
const width = 350 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const xScale = d3.scaleBand()
    .range([0, width])
    .domain(["Cumulative Calories"])
    .padding(0.2);

const yScale = d3.scaleLinear()
    .range([height, 0]);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const xAxisGroup = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`);

const yAxisGroup = chartGroup.append("g");

// Render bar chart based on selected food items
function renderBarChart() {
    let cumulative = 0;
    const data = selectedItems.map(item => {
        const start = cumulative;
        cumulative += item.calories;
        return { ...item, start, end: cumulative };
    });

    const totalCalories = selectedItems.reduce((sum, item) => sum + item.calories, 0);
    document.getElementById("total-calories").textContent = `Total Calories: ${totalCalories}`;2289

    yScale.domain([0, Math.max(cumulative, 2000)]);

    // Update bar segments
    const bars = chartGroup.selectAll(".bar")
        .data(data);

    bars.enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", xScale("Cumulative Calories"))
        .attr("y", d => yScale(d.end))
        .attr("width", xScale.bandwidth())
        .attr("height", d => yScale(d.start) - yScale(d.end))
        .attr("fill", d => color(d.name));

    // Add labels next to the bars
    const labels = chartGroup.selectAll(".label")
        .data(data);

    labels.enter()
        .append("text")
        .attr("class", "label")
        .merge(labels)
        .attr("x", width + 10) // Position label slightly to the right of the bars
        .attr("y", d => yScale(d.end) + (yScale(d.start) - yScale(d.end)) / 2)
        .text(d => `${d.name} (${d.calories} cal)`);

    bars.exit().remove();
    labels.exit().remove();

    xAxisGroup.call(d3.axisBottom(xScale));
    yAxisGroup.call(d3.axisLeft(yScale).ticks(5));
}

function renderFoodList(filteredData) {
    const list = document.getElementById("data-list");
    list.innerHTML = ""; // Clear existing items

    // If there are no selected categories or search input, don't render anything
    if (filteredData.length === 0) {
        return; // Do nothing, keep the list empty
    }

    // Sort the filtered data alphabetically by the food name
    filteredData.sort((a, b) => a.name.localeCompare(b.name));

    // Remove duplicates by using a Set to track already added items
    const seen = new Set();
    const uniqueData = filteredData.filter(item => {
        if (seen.has(item.name)) {
            return false; // Skip if the item has already been added
        }
        seen.add(item.name);
        return true; // Include the item if it hasn't been added yet
    });

    // Create and append list items for each unique food item
    uniqueData.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        li.onclick = () => toggleSelection(item); // Toggle selection of items
        list.appendChild(li);
    });
}

// Toggle food item selection
function toggleSelection(item) {
    const index = selectedItems.findIndex(selectedItem => selectedItem.name === item.name);
    if (index === -1) {
        selectedItems.push(item);
    } else {
        selectedItems.splice(index, 1);
    }
    renderBarChart();
}

// Filter data based on category
function filterData(category) {
    const filteredData = sparqlData.filter(item => item.category.toLowerCase().includes(category.toLowerCase()));
    renderFoodList(filteredData);
}

// Filter the food list based on search input
function filterList() {
    const searchTerm = document.getElementById("search-bar").value.toLowerCase();
    const list = document.getElementById("data-list");

    // Clear the existing list before adding new items
    list.innerHTML = "";

    // If the search term is empty, clear the list (i.e., don't display anything)
    if (searchTerm === "") {
        return; // Do nothing and leave the list empty
    }

    // Filter data based on search term
    const filteredData = sparqlData.filter(item => item.name.toLowerCase().includes(searchTerm));

    // If no items match the search term, don't display anything
    if (filteredData.length === 0) {
        return; // Do nothing, keep the list empty
    }

    // Sort the filtered data alphabetically by the food name
    filteredData.sort((a, b) => a.name.localeCompare(b.name));

    // Remove duplicates by using a Set to track already added items
    const seen = new Set();
    const uniqueData = filteredData.filter(item => {
        if (seen.has(item.name)) {
            return false; // Skip if the item has already been added
        }
        seen.add(item.name);
        return true; // Include the item if it hasn't been added yet
    });

    // Create and append list items for each unique food item
    uniqueData.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        li.onclick = () => toggleSelection(item); // Toggle selection of items
        list.appendChild(li);
    });
}

// Deselect all selected items
function deselectAll() {
    selectedItems = [];
    renderBarChart();
    document.getElementById("search-bar").value = "";
    renderFoodList(sparqlData);

    // Clear the food list when no category is selected
    const list = document.getElementById("data-list");
    list.innerHTML = ""; // Clear the list completely
}

// Initialize the page
let sparqlData = []; // Declare sparqlData globally
fetchData().then(data => {
    sparqlData = data;
});
