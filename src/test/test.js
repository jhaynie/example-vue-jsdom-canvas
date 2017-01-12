const fs = require('fs');
const os = require('os');
const path = require('path');
const Canvas = require('canvas');
const jsdom = require('jsdom');
const imageDiff = require('image-diff');

const Hello = require('src/hello');

describe('test', () => {
	it('should render to canvas', (done) => {
		// create our Vue canvas component
		const vm = new Vue({
			el: document.createElement('div'),
			render: (h) => h(Hello)
		});
		const canvas = vm.$el;

		// convert the canvas into a PNG via data url
		const url = canvas.toDataURL('image/png');
		const buf = new Buffer(url.substring('data:image/png;base64,'.length), 'base64');

		should(buf.toString('base64')).be.equal('iVBORw0KGgoAAAANSUhEUgAAAJYAAADICAYAAAAKhRhlAAAABmJLR0QA/wD/AP+gvaeTAAABT0lEQVR4nO3dywkCMQBAwSgWpfVoH2IfFmRX2sKu5LmyzJxDPvDIMRkDAAAAAACY57B04GuMd7mRXzmvODPfO269AfZJWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEXitNXCz3HdaOXbfe58l8fc+fbBjUVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFYvFrM/N/Jp396gv/xI1FQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIRFQlgkhEVCWCSERUJYJIQFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAsHMf6/QGSOGG0WMAAAAASUVORK5CYII=');
		done();

		// create a new image and load from that data url
		const img = $('<img src="' + url + '" id=img width=150 height=200>');
		$('body').append(img);
		const imgel = $('#img');

		// now take the image and create a new canvas which we're going to draw
		// the img into the canvas
		const el2 = $('<canvas width=150 height=200 id=canvas2></canvas>');
		$('body').append(el2);
		const canvas2 = $('#canvas2').get(0);
		const ctx2 = canvas2.getContext('2d');
		// load the image from the data url
		const img2 = new Canvas.Image;
	   img2.src = url;
		// draw this img into the canvas
		ctx2.drawImage(img2, 0, 0);

		// now convert this img on the canvas into a blob
		canvas2.toBlob(function(blob) {
			try {
				// convert the blob into a node buffer
				const blobbuf = jsdom.blobToBuffer(blob);
				// and compare the node buffer encoded as base64 to the original
				// canvas image we drew and they should be the *exact* same
				should(blobbuf.toString('base64')).be.equal(buf.toString('base64'));

				// now let's write out both png into a file and use image-diff to also compare
				const fn1 = path.join(os.tmpdir(), 'image1.png');
				const fn2 = path.join(os.tmpdir(), 'image2.png');
				fs.writeFileSync(fn1, buf);
				fs.writeFileSync(fn2, blobbuf);

				// use the image-diff library to compare the original "reference"
				// to our newly produced image copy and make sure they are the same
				imageDiff({
					actualImage: fn2,
					expectedImage: fn1
				}, function (err, imagesAreSame) {
					// clean up our temp files
					fs.unlinkSync(fn1);
					fs.unlinkSync(fn2);
					if (err) {
						done(err);
					} else {
						// they should be the same!!
						should(imagesAreSame).be.true;
						done();
					}
				});
			} catch (ex) {
				done(ex);
			}
		});
	});
});
