import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Waveform({ code }) {
    const svgRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const width = 4000;
        const height = 120;
        svg.attr('viewBox', `0 0 ${width} ${height}`).style('width', '100%').style('height', '120px');

        svg.selectAll("*").remove();

        const lines = (code || '').split('\n');
        const data = lines.length ? lines.map((line, index) => ({ x: index, y: line.length })) : [{x: 0, y: 0}];

        const xscale = d3.scaleBand()
        .domain(data.map(d => d.x))
        .range([0, width])
        .paddingInner(0.1);

        const yscale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.y) || 1])
        .range([height, 0]);

        
