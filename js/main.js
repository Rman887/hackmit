Promise.all([
    d3.json("data/boroughs.geojson"),
    d3.json("data/dede4.geojson"),
    d3.json("data/test2 (2).geojson")
]).then(function(data) {
    drawMap(data[0], data[2]);
}).catch(function(error) {
    console.log(error);
});

function drawMap(boroughs, dede) {
    var width = 900,
        height = 900;

    var backgroundColor = "#b5f1ff";
    d3.select("body").style();

    var svg = d3.select( "body" )
        .append( "svg" )
        .classed("mapSVG", true)
        .attr( "width", width )
        .attr( "height", height )
        .attr("transform", "rotate(-45, 0, 0)")

    var g = svg.append( "g" );

    // Compute the feature bounds and centroid
    var bounds = d3.geoBounds(boroughs),
        center = d3.geoCentroid(boroughs);

    // Compute the angular distance between bound corners
    var distance = d3.geoDistance(bounds[0], bounds[1]),
        scale = height / distance / Math.sqrt(2) * 1.3;

    var albersProjection = d3.geoAlbers()
        .scale( scale )
        .rotate( [0,0] )
        .center( center )
        .translate( [width / 2, height / 2] );

    var geoPath = d3.geoPath()
        .projection( albersProjection );


    g.selectAll( "path" )
        .data(boroughs.features)
        .enter()
        .append( "path" )
        .attr( "fill", "#a3ffb9" )
        .attr( "stroke", "#333")
        .attr( "d", geoPath );

    var points = svg.append('g');

    points.selectAll('path')
        .data(dede.features)
        .enter()
        .append('path')
        .classed("accident", true)
        .attr('d', geoPath.pointRadius(function(feature, index) {
            return Math.pow(parseInt(feature.properties.injured_killed) + 1, 1.5) / 20 + 0.75;
        }))
        .on("mouseover", function(d) {
            d3.select("h2").text("Injured: " + d.properties.injured_killed);
            d3.select(this).attr("class", "accident hover");
        })
        .on("mouseout", function(d) {
            d3.select("h2").text("");
            d3.select(this).attr("class", "accident");
        });

}
