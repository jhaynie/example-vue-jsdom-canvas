<template>
	<canvas width="150" height="200"></canvas>
</template>

<script>
export default {
	mounted() {
		// use jquery to get our canvas element
		const canvas = this.$el;
		// draw a couple of boxes into the canvas
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'rgb(200,0,0)';
		ctx.fillRect(10, 10, 50, 50);
		ctx.fillStyle = 'rgba(0, 0, 200, 0.5)';
		ctx.fillRect(30, 30, 50, 50);
	}
}
</script>
