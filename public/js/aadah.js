var THEME = {
	'body': {
		'color': {
			'main': '#ffffff',
			'alt': '#000000'
		},
		'background-color': {
			'main': '#222222',
			'alt': '#dddddd'
		}
	},
	'header': {
		'border-bottom-color': {
			'main': '#ffffff',
			'alt': '#000000'
		}
	},
	'.author': {
		'color': {
			'main': '#aaaaaa',
			'alt': '#555555'
		}
	},
	'main h1, main h2, main h3, main h4, main h5, main h6': {
		'border-left-color': {
			'main': '#ffffff',
			'alt': '#000000'
		}
	},
	'footer': {
		'color': {
			'main': '#aaaaaa',
			'alt': '#555555'
		},
		'border-top-color': {
			'main': '#ffffff',
			'alt': '#000000'
		}
	},
	'blockquote': {
		'color': {
			'main': '#bbbbbb',
			'alt': '#444444'
		},
		'border-left-color': {
			'main': '#bbbbbb',
			'alt': '#444444'
		}
	},
	'.pquoter, .pquotel': {
		'color': {
			'main': '#bbbbbb',
			'alt': '#444444'
		},
		'background-color': {
			'main': '#000000',
			'alt': '#ffffff'
		}
	},
	'img': {
		'border-color': {
			'main': '#000000',
			'alt': '#ffffff'
		}
	},
	'video, audio': {
		'background-color': {
			'main': '#000000',
			'alt': '#ffffff'
		}
	},
	'code': {
		'background-color': {
			'main': '#000000',
			'alt': '#ffffff'
		}
	},
	'kbd, samp': {
		'background-color': {
			'main': '#111111',
			'alt': '#eeeeee'
		}
	},
	'table': {
		'background-color': {
			'main': '#000000',
			'alt': '#ffffff'
		}
	},
	'th': {
		'background-color': {
			'main': '#222222',
			'alt': '#dddddd'
		}
	},
	'.gallery figure': {
		'border-color': {
			'main': '#000000',
			'alt': '#ffffff'
		},
		'background-color': {
			'main': '#000000',
			'alt': '#ffffff'
		}
	},
	'.gallery figcaption': {
		'background-color': {
			'main': '#000000',
			'alt': '#ffffff'
		}
	},
	'main a': {
		'border-bottom-color': {
			'main': '#ffffff',
			'alt': '#000000'
		}
	},
	'footer a': {
		'border-bottom-color': {
			'main': '#aaaaaa',
			'alt': '#555555'
		}
	},

	// code theme colors
	'.str': {
		'color': {
			'main': '#00ff00',
			'alt': '#00b000'
		}
	},
	'.kwd': {
		'color': {
			'main': '#ffff00',
			'alt': '#b0b000'
		}
	},
	'.typ': {
		'color': {
			'main': '#00ffff',
			'alt': '#00b0b0'
		}
	},
	'.lit': {
		'color': {
			'main': '#ff00ff',
			'alt': '#b000b0'
		}
	},
	'.pun': {
		'color': {
			'main': '#ffffff',
			'alt': '#000000'
		}
	},
	'.pln': {
		'color': {
			'main': '#ffffff',
			'alt': '#000000'
		}
	},
	'.tag': {
		'color': {
			'main': '#00ffff',
			'alt': '#00b0b0'
		}
	},
	'.atn': {
		'color': {
			'main': '#ffff00',
			'alt': '#b0b000'
		}
	},
	'.atv': {
		'color': {
			'main': '#00ff00',
			'alt': '#00b000'
		}
	},
	'.dec': {
		'color': {
			'main': '#ff00ff',
			'alt': '#b000b0'
		}
	}
};

////////////////////////////////////////////////////////////////////////////////

function switchTheme(theme) {
	var current;
	var selector;
	var prop;

	// if no valid theme string is passed in, function acts as a toggle
	if (theme !== 'main' && theme !== 'alt') {
		current = localStorage.getItem('current') ? localStorage.getItem('current') : 'main';
		current = current === 'main' ? 'alt' : 'main';
	} else {
		current = theme;
	}

	// change theme accordingly
	for (selector in THEME) {
		var $sel = $(selector);
		var props = THEME[selector];
		for (prop in props) {
			$sel.css(prop, props[prop][current]);
		}
	}

	// store current theme in local storage
	localStorage.setItem('current', current);
}

function toggleImage() {
	$img = $(this);
	$fig = $img.parent();
	if ($fig.css('width') == '230px') {
		var img_width = $img.css('width');
		var img_height = $img.css('height');
		$fig.css('width', img_width);
		$fig.css('height', img_height);
	} else {
		$fig.css('width', '230px');
		$fig.css('height', '230px');
	}
}

function windowResize() {
	if (window.innerWidth <= 850) {
		$('img', '.gallery').off('click', toggleImage);
		$('figure', '.gallery').css('width', 'auto');
		$('figure', '.gallery').css('height', 'auto');
	} else {
		$('img', '.gallery').click(toggleImage);
		$('figure', '.gallery').css('width', '230px');
		$('figure', '.gallery').css('height', '230px');
	}
}

function isHome() {
	var regex = /^\/(index\.html)?$/;
	return regex.test(location.pathname);
}

function isBlog() {
	var regex = /^\/blog\/(index\.html)?$/;
	return regex.test(location.pathname);
}

function isPost() {
	var regex = /^\/blog\/.+\/(index\.html)?$/;
	// if the page is not found, we don't want to count it as a post
	return regex.test(location.pathname) && $('.title').text() != '404';
}

function formatTimestamp(date) {
	// if date is omitted, just return the current formatted datetime
	var mdate = date ? moment.utc(new Date()) : moment.utc(new Date(date));

	var formattedDate = mdate.format('D MMMM YYYY H:mm:ss UTC');

	return formattedDate;
}

function ajaxSuccess(msg) {
	return (function (data, status) {
		console.log(msg, data, status);
	});
}

function ajaxError(msg) {
	return (function (xhr, status, err) {
		console.error(msg, status, err);
	});
}

////////////////////////////////////////////////////////////////////////////////

$(function() {
	$('nav, nav a').click(switchTheme);
	$('img', '.gallery').click(toggleImage);

	windowResize();
	$(window).resize(windowResize);

	$.ajax({
		type: 'POST',
		url: '/log/visit',
		data: {
			last: formatTimestamp()
		},
		success: ajaxSuccess('POST /log/visit success:'),
		error: ajaxError('POST /log/visit error:')
	});

	if (isPost()) {
		$.ajax({
			type: 'POST',
			url: '/log/visit/post',
			data: {
				title: $('.title').text(),
				subtitle: $('.subtitle').text(),
				author: $('.author').text(),
				posted: formatTimestamp($('time').text()),
				dir: location.pathname
			},
			success: ajaxSuccess('POST /log/visit/post success:'),
			error: ajaxError('POST /log/visit/post error:')
		});
	}
});

$(window).load(function() {
	// preserve theme while navigating site
	switchTheme(localStorage.getItem('current'));
});
