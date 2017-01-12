require('jsdom-global')('<html><body><div id=app></div></body></html>', {
	features: {
		FetchExternalResources: ['img', 'script'],
		ProcessExternalResources: ['img', 'script']
	}
});
