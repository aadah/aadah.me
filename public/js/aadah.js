var THEME = {
	'body': {
		'main': {
			'color': '#ffffff',
			'background-color': '#222222'
		},
		'alt': {
			'color': '#000000',
			'background-color': '#dddddd'
		}
	},
	'header': {
		'main': {
			'border-bottom-color': '#ffffff'
		},
		'alt': {
			'border-bottom-color': '#000000'
		}
	},
	'.author': {
		'main': {
			'color': '#aaaaaa'
		},
		'alt': {
			'color': '#555555'
		}
	},
	'main h1, main h2, main h3, main h4, main h5, main h6': {
		'main': {
			'border-left-color': '#ffffff'
		},
		'alt': {
			'border-left-color': '#000000'
		}
	},
	'footer': {
		'main': {
			'color': '#aaaaaa',
			'border-top-color': '#ffffff'
		},
		'alt': {
			'color': '#555555',
			'border-top-color': '#000000'
		}
	},
	'blockquote': {
		'main': {
			'color': '#bbbbbb',
			'border-left-color': '#bbbbbb'
		},
		'alt': {
			'color': '#444444',
			'border-left-color': '#444444'
		}
	},
	'.pquoter, .pquotel': {
		'main': {
			'color': '#bbbbbb',
			'background-color': '#000000'
		},
		'alt': {
			'color': '#444444',
			'background-color': '#ffffff'
		}
	},
	'img': {
		'main': {
			'border-color': '#000000'
		},
		'alt': {
			'border-color': '#ffffff'
		}
	},
	'video, audio': {
		'main': {
			'background-color': '#000000'
		},
		'alt': {
			'background-color': '#ffffff'
		}
	},
	'code': {
		'main': {
			'background-color': '#000000'
		},
		'alt': {
			'background-color': '#ffffff'
		}
	},
	'p > kbd, samp': {
		'main': {
			'background-color': '#111111'
		},
		'alt': {
			'background-color': '#eeeeee'
		}
	},
	'table': {
		'main': {
			'background-color': '#000000'
		},
		'alt': {
			'background-color': '#ffffff'
		}
	},
	'th': {
		'main': {
			'background-color': '#222222'
		},
		'alt': {
			'background-color': '#dddddd'
		}
	},
	'.gallery figure': {
		'main': {
			'border-color': '#000000',
			'background-color': '#000000'
		},
		'alt': {
			'border-color': '#ffffff',
			'background-color': '#ffffff'
		}
	},
	'.gallery figcaption': {
		'main': {
			'color': '#ffffff',
			'background-color': '#000000'
		},
		'alt': {
			'color': '#000000',
			'background-color': '#ffffff'
		}
	},
	'main a': {
		'main': {
			'border-bottom-color': '#ffffff'
		},
		'alt': {
			'border-bottom-color': '#000000'
		}
	},
	'footer a': {
		'main': {
			'border-bottom-color': '#aaaaaa'
		},
		'alt': {
			'border-bottom-color': '#555555'
		}
	},

	// code theme colors
	'.str': {
		'main': {
			'color': '#00ff00'
		},
		'alt': {
			'color': '#00b000'
		}
	},
	'.kwd': {
		'main': {
			'color': '#ffff00'
		},
		'alt': {
			'color': '#b0b000'
		}
	},
	'.typ': {
		'main': {
			'color': '#00ffff'
		},
		'alt': {
			'color': '#00b0b0'
		}
	},
	'.lit': {
		'main': {
			'color': '#ff00ff'
		},
		'alt': {
			'color': '#b000b0'
		}
	},
	'.pun': {
		'main': {
			'color': '#ffffff'
		},
		'alt': {
			'color': '#000000'
		}
	},
	'.pln': {
		'main': {
			'color': '#ffffff'
		},
		'alt': {
			'color': '#000000'
		}
	},
	'.tag': {
		'main': {
			'color': '#00ffff'
		},
		'alt': {
			'color': '#00b0b0'
		}
	},
	'.atn': {
		'main': {
			'color': '#ffff00'
		},
		'alt': {
			'color': '#b0b000'
		}
	},
	'.atv': {
		'main': {
			'color': '#00ff00'
		},
		'alt': {
			'color': '#00b000'
		}
	},
	'.dec': {
		'main': {
			'color': '#ff00ff'
		},
		'alt': {
			'color': '#b000b0'
		}
	}
};

////////////////////////////////////////////////////////////////////////////////

function setHourlyTheme(fadeOff) {
	var sunrise_hour = 6;
	var sunset_hour = 18;
	var now_hour = new Date().getHours();
	if (sunrise_hour <= now_hour && now_hour < sunset_hour) {
		switchTheme('alt', fadeOff);
	} else {
		switchTheme('main', fadeOff);
	}
}

function switchTheme(theme, fadeOff) {
	var prev;
	var current;
	var selector;

	// if no valid theme string is passed in, function acts as a toggle
	if (theme !== 'main' && theme !== 'alt') {
		prev = $('body').data('theme');
		current = prev === 'main' ? 'alt' : 'main';
	} else {
		current = theme;
	}

	for (selector in THEME) {
		changeColor(selector, THEME[selector][current], fadeOff);
	}

	$('body').data('theme', current);
}

function changeColor(selector, attributes, fadeOff) {
	var $sel = $(selector);
	var attr;
	if (fadeOff) {
		$(selector).animate(attributes, 0);
	} else {
		$sel.animate(attributes, 500);
	}
}

////////////////////////////////////////////////////////////////////////////////

function toggleImage() {
	$img = $(this);
	$fig = $img.closest('figure');
	$img.data('expanded?', !$img.data('expanded?'));
	if ($img.data('expanded?')) {
		var img_width = $img.data('width');
		var img_height = $img.data('height');
		$fig.animate({
			'width': img_width,
			'height': img_height
		}, 500, 'easeOutCubic');
	} else {
		$fig.animate({
			'width': '230px',
			'height': '230px'
		}, 500, 'easeOutCubic');
	}
}

function imageResize($img, $fig) {
	if ($img.data('expanded?')) {
		var img_width = $img.data('width');
		var img_height = $img.data('height');
		$fig.css('width', img_width);
		$fig.css('height', img_height);
	} else {
		$fig.css('width', '230px');
		$fig.css('height', '230px');
	}
}

function storeImageSizes() {
	if ($('body').data('imageSizesStored?')) return;
	$('img', '.gallery').each(function () {
		$img = $(this);
		$img.data('width', $img.css('width'));
		$img.data('height', $img.css('height'));
	});
	$('body').data('imageSizesStored?', true);
}

function windowResize() {
	if (window.innerWidth <= 850) {
		$('img', '.gallery').off('click', toggleImage);
		$('figure', '.gallery').css('width', 'auto');
		$('figure', '.gallery').css('height', 'auto');
	} else {
		storeImageSizes();
		$('img', '.gallery').off('click', toggleImage);
		$('img', '.gallery').click(toggleImage);
		$('img', '.gallery').each(function () {
			$img = $(this);
			$fig = $img.closest('figure');
			imageResize($img, $fig);
		});
	}
}

////////////////////////////////////////////////////////////////////////////////

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
	var mdate = date ? moment.utc(new Date(date)) : moment.utc(new Date());

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
	$('body').data('theme', 'main');
	$('body').data('imageSizesStored?', false);
	$('img', '.gallery').data('expanded?', false);

	$.ajax({
		type: 'POST',
		url: '/log/visit',
		data: {
			last: new Date()
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
				posted: new Date($('time').text()),
				dir: location.pathname
			},
			success: ajaxSuccess('POST /log/visit/post success:'),
			error: ajaxError('POST /log/visit/post error:')
		});
	}
});

$(window).load(function() {
	windowResize();
	$(window).resize(windowResize);

	setHourlyTheme(true);
	setInterval(function () {
		setHourlyTheme();
	}, 60000);
});
