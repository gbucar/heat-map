fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
    .then(data=>data.json())
    .then(data=>{
        let base = data.baseTemperature
        data = data.monthlyVariance
        let color = d3.scaleLinear()
            .domain([-5,5])
            .range(["black", "rgb(179, 224, 238)"])
        let body = d3.select("body")
        let info = body.append("div").attr("id", "info")
        let w = window.innerWidth-window.innerWidth*0.1
        let h = w/2.5
        let padding = 70
        let svg = body.append("svg")
            .attr("height", h)
            .attr("width", w)
        let xScale = d3.scaleTime()
            .domain([d3.min(data, d=>new Date(d.year, 0)), d3.max(data, d=>new Date(d.year, 0))])
            .range([padding, w-padding])
        let yScale = d3.scaleTime()
            .domain([new Date(0, 0), new Date(0, 11)])
            .range([padding, h-padding])
        let xLScale = d3.scaleLinear()
            .domain([-5, 5])
            .range([0, 200])
        let lw = 210
        let lh = 40
        let xAxis = d3.axisBottom(xScale)
        let yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%B"))
        let xLAxis = d3.axisBottom(xLScale)
        let tooltip = body.append("div")
            .attr("id", "tooltip")
            .style("opacity", "0");
        let legend = info.append("svg")
            .attr("width", lw)
            .attr("height", lh)
            .attr("id", "legend")
        legend.selectAll("rect")
            .data([-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5])
            .enter()
            .append("rect")
            .attr("x", (d)=>xLScale(d))
            .attr("y", 0)
            .attr("width", 20)
            .attr("height", 20)
            .style("fill", (d)=>color(d))
        legend.append("g")
            .attr("transform", "translate(5, 20)")
            .call(xLAxis)

        info.append("h2")
            .attr("id", "title")
            .text("Chart about temperature")
        info.append("div")    
            .attr("id", "description")
            .text("interesting chart that shows us, how temperature has changed in last few decades")
        svg.selectAll("rect")
            .attr("id", "chart")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", (d)=>xScale(new Date(d.year, 0)))
            .attr("y", (d)=>yScale(new Date(0, d.month-1)))
            .attr("width", `${w/(d3.max(data, d=>{
                return d.year})-d3.min(data, d=>d.year))}px`)
            .attr("height", `${(h-padding*2)/12}`)
            .attr("class", "cell")
            .attr("data-month", (d)=>d.month-1)
            .attr("data-year", (d)=>d.year)
            .attr("data-temp", (d)=>base + parseFloat(d.variance))
            .attr("fill", (d)=>{
                let temp = d.variance
                return color(temp)
            })
            .on("mouseover", (d)=>{
                let attr = d.originalTarget.attributes
                tooltip
                        .attr("data-year", attr["data-year"].value)
                        .text(`Year: ${attr["data-year"].value} \nMonth: ${attr["data-month"].value} \nTemperature: ${Math.floor(parseFloat(attr["data-temp"].value)*100)/100}`)
                        .attr("style", `left: ${d.clientX+10}px; top: ${d.clientY+10}px;`)
                        .style("opacity", "1")
            })
            .on("mouseout", ()=>{
                tooltip
                    .style("opacity", "0")
                    .text("")
            })
        svg.append("g")
            .attr("transform", "translate("+ 0 +"," + (h-padding+(h-padding*2)/12) + ")")
            .attr("id", "x-axis")
            .call(xAxis)
        svg.append("g")
            .attr("transform", "translate(" + (padding) + ", " + 0 +")")
            .attr("id", "y-axis")
            .call(yAxis)


    })