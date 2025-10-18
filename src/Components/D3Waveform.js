import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Waveform({ code }) {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);

        const lines = (code || '').split('\n');
        const data = lines.length ? lines.map((line, index) => ({ x: index, y: line.length })) : [{x: 0, y: 0}];

        const width = Math.max(400, data.length * 15);
        const height = 120;
        svg.attr('viewBox', `0 0 ${width} ${height}`).style('width', '100%').style('height', '120px');

        svg.selectAll("*").remove();

        const xscale = d3.scaleBand()
        .domain(data.map(d => d.x))
        .range([0, width])
        .paddingInner(0.1);

        const yscale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y) || 1])
        .range([height, 0]);

        const barGroups = svg.selectAll("g.bar-group")
            .data(data)
            .join('g')
            .classed('bar-group', true)
            .attr('transform', d => `translate(${xscale(d.x)}, 0)`);

        svg.selectAll('rect')
            .attr('x', d => xscale(d.x))
            .attr('y', height)
            .attr('height', 0)
            .attr('width', xscale.bandwidth())
            .attr('fill', (d, i) => `rgb(31, 111, ${150 + i % 100})`)
            .transition()
            .duration(600)
            .delay((d, i) => i * 20)
            .attr('y', d => yscale(d.y))
            .attr('height', d => height - yscale(d.y));
        
        svg.append('line')
            .attr('x1', 0)
            .attr('y1', height)
            .attr('x2', width)
            .attr('y2', height)
            .attr('stroke', 'black')
            .attr('stroke-width', 1);
    }, [code]);

    return <svg ref={svgRef}></svg>;
}
