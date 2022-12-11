import React, { useState, useEffect } from "react";

export default function Background(props) {

	const [dimensions, setDimensions] = useState({});
	let requestId = '';
	let radius = 0;
	let dir = 1;

	useEffect(() => {
		adjustWindow();
		window.addEventListener('resize', adjustWindow);
	}, [setDimensions]);

	useEffect(() => {
		if(dimensions.hasOwnProperty('width')) {
			if(requestId) {
				cancelAnimationFrame(requestId);
			}
			setupCanvas();
		}
	}, [dimensions]);

	const adjustWindow = () => {
		const width = window.innerWidth;
		const height = window.innerHeight;
		setDimensions({width, height});
	}

	const setupCanvas = () => {
		const canvas = document.getElementById('canvas');
		const ctx = canvas.getContext("2d");
		const pxScale = window.devicePixelRatio;

		canvas.style.width = dimensions.width + 'px';
		canvas.style.height = dimensions.height + 'px';

		canvas.width = dimensions.width * pxScale;
		canvas.height = dimensions.height * pxScale;

		ctx.scale(pxScale, pxScale);
		drawBackground(ctx);
	}

	const drawBackground = (ctx) => {
		const width = dimensions.width;
		const height = dimensions.height;
		const outerRadius = Math.max(width,height)/2;
		const gradient = ctx.createRadialGradient(width/2, height/2, 200, width/2, height/2, outerRadius+radius);
		gradient.addColorStop(0, "rgb(205,127,235)");
		gradient.addColorStop(0.5, "rgb(225,117,39)");
		gradient.addColorStop(0.7, "rgb(221,52,116)");
		gradient.addColorStop(1, "rgb(232,160,204)");
		ctx.fillStyle = gradient;
		ctx.fillRect(0,0,width,height);
		radius += 1 * dir;
		if(radius > outerRadius/3 || radius < 0) {
			dir *= -1;
		}

		requestId = requestAnimationFrame(() => drawBackground(ctx));
	}

	return (
		<canvas id="canvas"></canvas>
	);
}