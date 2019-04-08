const yValue = d => d.seq_bar_length + d.re_reading_bar_length;
const xValue = d => d.trial;
//const xValue = d => d.bar_position;

export const alpGen = (selection, props) => {
    const {
        data,
        palette,
        pName,
        pNameOffset,
        alpVizWidth,
        alpVizHeight,
        setSelectedAOI,
        selectedAOI
    } = props;

    // select the data of the participant specified
    const dataVis = data.filter(d => d.p_name === pName);

    // parameter for the canvas of Alpscarf
    //const maxSeqLength = d3.max(dataVis, d => d.seq_bar_length);
    //const maxReReadingLength = d3.max(dataVis, d => d.re_reading_bar_length);
    const maxSeqLength = d3.max(data, d => d.seq_bar_length);
    const maxReReadingLength = d3.max(data, d => d.re_reading_bar_length);
    const yPosition = d => d.seq_bar_length + maxReReadingLength;

    const yScale = d3.scaleLinear()
        .domain([0, maxSeqLength + maxReReadingLength])
        .range([alpVizHeight, 0]);

    const xScale = d3.scaleBand()
        .domain(dataVis.map(xValue))
        .range([0, alpVizWidth])
        .padding(0);

    const groups = selection.selectAll('g').data(dataVis);
    const groupEnter =
        groups.enter().append('g')
            .attr('class', 'tick')
        ; // make a function for enter so that circles can re-use
    groupEnter
            .attr('transform', `translate(${pNameOffset}, 0)`)
        .merge(groups)
            .on('click', d => setSelectedAOI(d.AOI))
        .transition().duration(1000)
        .attr('transform', `translate(${pNameOffset}, 0)`);
    groups.exit()
        .transition().duration(1000)
        .remove();

    // TODO: transition is working; figure out how to avoid creating a new variable groupsRect
    //const groupsRect = groups.select('.bars');
    const groupsRect = selection.selectAll('rect').data(dataVis);

    groupsRect.exit()
        .transition().duration(1000)
        .attr('x', alpVizWidth)
        .remove();

    groupEnter
        .append('rect')
            .attr('class', 'bars')
            .attr('y', d => yScale(yPosition(d)))
            //.attr('x', d => xScale(xValue(d)))
            .attr('x', alpVizWidth)
            .attr('height', d => alpVizHeight - yScale(yValue(d)))
            .attr('width', xScale.bandwidth())
        .merge(groups.select('rect'))
            .attr('stroke-width', '2')

            .classed('highlighted', d =>
                //selectedAOI && selectedAOI === d.AOI
                selectedAOI.length > 0  && selectedAOI.includes(d.AOI)
              )
            .attr('opacity', d =>
                //(!selectedAOI || d.AOI === selectedAOI)
                (selectedAOI.length === 0  || selectedAOI.includes(d.AOI))
                    ? 1
                    : 0.2
                )

        .transition().duration(1000)
            .attr('height', d => alpVizHeight - yScale(yValue(d)))
            .attr('width', xScale.bandwidth())
            .attr('y', d => yScale(yPosition(d)))
            .attr('x', d => xScale(xValue(d)))
            .attr('fill', d => palette(d.AOI))
        ;

    groupEnter
        .append('title')
        .merge(groups.select('title'))
            .text(d => d.AOI + ': ' + d.dwell_duration + ' ms');

    // print p_name
    const groupText = selection.selectAll('text').data([null]);
    groupText
        .enter()
            .append('text')
            .attr("dy", ".35em")
            .text(pName)
            .attr('x', 10)
            .attr('y', alpVizHeight / 2)
            .style("fill-opacity", 1e-6)
        .merge(groupText)
        .transition().duration(1000)
            .attr('x', 0)
            .style("fill-opacity", 1);


    // todo: fade-out of text (p_name) doesn't work
    groupText.exit()
        .transition().duration(1000)
        .attr('x', -10)
        .style("fill-opacity", 1e-6)
        .remove();

};