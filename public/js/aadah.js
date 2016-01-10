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
			'color': '#cccccc',
			'background-color': '#111111'
		},
		'alt': {
			'color': '#333333',
			'background-color': '#eeeeee'
		}
	},
	'main li': {
		'main': {
			'color': '#ffffff'
		},
		'alt': {
			'color': '#000000'
		}
	},
	'img, audio, video': {
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
	'p kbd, samp': {
		'main': {
			'background-color': '#333333'
		},
		'alt': {
			'background-color': '#cccccc'
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
	'#fn-box': {
		'main': {
			'background-color': '#111111'
		},
		'alt': {
			'background-color': '#eeeeee'
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

function findFootnotes() {
	return $('.footnote a');
}

function extractFootnoteText(f, i) {
	var footnote = $(f);
	var text = footnote.text();
	var num = i.toString();

	footnote.text(num);
	footnote.attr('href', '#f'+num);

	return text;
}

function createFootnotesListElement(text, i) {
	var elem = $('<li>');
	var num = i.toString();

	elem.text(text);
	elem.attr('id', 'f'+num);

	return elem;
}

function footnoteHoverEnter(event) {
	var box = $('#fn-box');
	var fn = $('a', this);
	var id = fn.attr('href');
	var html = $(id).html();
	box.html(html);
	var width = box.css('width');
	width = Number(width.substring(0, width.length-2));
	mid = width / 2;

	var x = event.pageX - window.pageXOffset;
	var y = event.pageY - window.pageYOffset;
	x -= mid;

	box.css('left', x.toString()+'px');
	box.css('top', y.toString()+'px');

	box.css('z-index', 1);

	box.animate({
		'opacity': 0.95,
		'z-index': 1
	}, 125);
}

function footnoteHoverExit() {
	var box = $('#fn-box');

	box.animate({
		'opacity': 0.0,
		'z-index': -1
	}, 125);
}

function createFootnotesList() {
	var footnotes = findFootnotes();

	if (footnotes.size() === 0) {
		return;
	}

	var list = $('<ol>');
	list.addClass('footnotes');

	for (i = 0; i < footnotes.size(); i++) {
		var f = footnotes[i];
		var index = i + 1;
		var text = extractFootnoteText(f, index);
		var elem = createFootnotesListElement(text, index);
		list.append(elem);
	}

	list.insertBefore($('div.times'));

	$('.footnote').hover(footnoteHoverEnter, footnoteHoverExit);
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

$(function () {
	$('body').data('theme', 'main');
	$('body').data('imageSizesStored?', false);
	$('img', '.gallery').data('expanded?', false);

	createFootnotesList();
});

$(window).load(function () {
	windowResize();
	$(window).resize(windowResize);

	setHourlyTheme(true);
	setInterval(function () {
		setHourlyTheme();
	}, 60000);
});
