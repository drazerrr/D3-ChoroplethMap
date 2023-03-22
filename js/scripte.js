const url1 = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json';
const req1 = new XMLHttpRequest();
const req2 = new XMLHttpRequest();
const width = 1200;
const height = 600;
const padding = 60;


req1.open('GET', url1, true);

req1.send();

 req1.onload = () => {
    let mapdata =  JSON.parse(req1.responseText);
    const url2 = 'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json';
    req2.open('GET', url2, true);
    req2.send();
    
    req2.onload = () => {
        let educationdata = JSON.parse(req2.responseText);
        let newmapdata  = topojson.feature(mapdata, mapdata.objects.counties).features;
        const svg = d3.select('main')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

         const toolTip = d3.select('main')
                           .append('div')
                           .attr('id', 'tooltip');           

                    svg.selectAll('path')
                       .data(newmapdata)
                       .enter()
                       .append('path')
                       .attr('d', d3.geoPath())
                       .attr('class', 'county')
                       .style('fill', (d) => {
                        for(let i = 0; i < educationdata.length; i ++) {
                            if(d.id === educationdata[i].fips){
                                if(educationdata[i].bachelorsOrHigher <= 12) { return '#4F7942';
                            } else if(educationdata[i].bachelorsOrHigher <= 30){
                                return '#228B22';
                            } else if(educationdata[i].bachelorsOrHigher <= 48){
                                return '#7CFC00';
                            } else if(educationdata[i].bachelorsOrHigher <= 66){
                                return '#008000';
                            } 
                            }
                        }
                       })
                       .attr('data-fips', (d) => d.id)
                       .attr('data-education', (d) => {
                        for(let i = 0; i < educationdata.length; i ++) {
                            if(d.id === educationdata[i].fips){
                                return educationdata[i].bachelorsOrHigher
                            }
                        };

                       })
                       .on('mouseover', (e, d) => {
                        let area;
                        let state;
                        let percentage;
                        for(let i = 0; i < educationdata.length; i++){
                            if(d.id === educationdata[i].fips) {
                                area = educationdata[i].area_name;
                                state = educationdata[i].state;
                                percentage = educationdata[i].bachelorsOrHigher;
                            };
                        };   
                        d3.select('#tooltip')
                          .style('opacity', 0.85)
                          .style('left', e.pageX + 6 + 'px')
                          .style('top', e.pageY + 'px')
                          .html(`<p>${area}, ${state}: ${percentage}%</p>`)
                          .attr('data-education', percentage)
                    })
                    .on('mouseout', () => {

                        return d3.select("#tooltip")
                                 .style('opacity', 0)
                                 .style('left', 0)
                                 .style('top', 0)
                    })

                       const legW = width / 5; 
const legH = 20;
const legendColors = [0, 12, 30, 48];

                       let legend = svg.append("g")
                       .attr("transform", "translate(900, 300)")
                       .attr("id", "legend");
                       let xScale = d3.scaleLinear()
  .domain([0, 80])
  .range([0, legW]);
  
let xAxis = d3.axisBottom()
  .scale(xScale)
  .ticks(3)
  .tickSize(20)
  .tickFormat((d, i) => ['0%', '12%', '30%', '48%', '66%'][i]);

legend.selectAll("rect")
  .data(legendColors)
  .enter()
  .append("rect")
  .attr("width", legW / legendColors.length)
  .attr("height", legH)
  .attr("x", (d, i) => i * (legW / legendColors.length))
  .style("fill", d => d === 0 ? '#4F7942': d === 12 ? '#228B22' : d === 30 ? '#7CFC00' : '#008000');

legend.append("g")
  .call(xAxis);
                                        

    }
};