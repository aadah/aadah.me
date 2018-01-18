/* global $ */

var THEME = {
  'body': {
    'main': {
      'color': '#ffffff',
      'background-color': '#202020'
    },
    'alt': {
      'color': '#000000',
      'background-color': '#e0e0e0'
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
      'color': '#b0b0b0'
    },
    'alt': {
      'color': '#505050'
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
      'color': '#b0b0b0',
      'border-top-color': '#ffffff'
    },
    'alt': {
      'color': '#505050',
      'border-top-color': '#000000'
    }
  },
  'blockquote': {
    'main': {
      'color': '#b0b0b0',
      'border-left-color': '#b0b0b0'
    },
    'alt': {
      'color': '#505050',
      'border-left-color': '#505050'
    }
  },
  '.pquoter, .pquotel': {
    'main': {
      'color': '#c0c0c0',
      'background-color': '#101010'
    },
    'alt': {
      'color': '#404040',
      'background-color': '#f0f0f0'
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
      'background-color': '#303030'
    },
    'alt': {
      'background-color': '#d0d0d0'
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
      'background-color': '#202020'
    },
    'alt': {
      'background-color': '#e0e0e0'
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
      'background-color': '#000000'
    },
    'alt': {
      'background-color': '#ffffff'
    }
  },
  '#fn-box': {
    'main': {
      'background-color': '#101010'
    },
    'alt': {
      'background-color': '#f0f0f0'
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
}

// /////////////////////////////////////////////////////////////////////////////

function setHourlyTheme (fadeOff) {
  var sunriseHour = 6
  var sunsetHour = 18
  var nowHour = new Date().getHours()
  if (sunriseHour <= nowHour && nowHour < sunsetHour) {
    switchTheme('alt', fadeOff)
  } else {
    switchTheme('main', fadeOff)
  }
}

function switchTheme (theme, fadeOff) {
  var prev
  var current
  var selector

  // if no valid theme string is passed in, function acts as a toggle
  if (theme !== 'main' && theme !== 'alt') {
    prev = $('body').data('theme')
    current = prev === 'main' ? 'alt' : 'main'
  } else {
    current = theme
  }

  for (selector in THEME) {
    changeColor(selector, THEME[selector][current], fadeOff)
  }

  $('hr').removeClass($('body').data('theme'))
  $('body').data('theme', current)
  $('hr').addClass($('body').data('theme'))
}

function changeColor (selector, attributes, fadeOff) {
  var $sel = $(selector)
  if (fadeOff) {
    $sel.animate(attributes, 0)
  } else {
    $sel.animate(attributes, 500)
  }
}

// /////////////////////////////////////////////////////////////////////////////

function findFootnotes () {
  return $('.footnote')
}

function extractFootnoteText (f, i) {
  var footnote = $(f)
  var text = footnote.html()
  var num = i.toString()
  var link = $('<a>')

  link.text(num)
  link.attr('href', '#f' + num)
  link.attr('id', 'd' + num)
  footnote.html(link)

  return text
}

function createFootnotesListElement (text, i) {
  var elem = $('<li>')
  var num = i.toString()
  var link = $('<a>')

  link.html(text)
  link.attr('href', '#d' + num)
  link.attr('id', 'f' + num)
  elem.append(link)

  return elem
}

function createFootnotesList () {
  var footnotes = findFootnotes()

  if (footnotes.size() === 0) {
    return
  }

  var list = $('<ol>')
  list.addClass('footnotes')

  for (var i = 0; i < footnotes.size(); i++) {
    var f = footnotes[i]
    var index = i + 1
    var text = extractFootnoteText(f, index)
    var elem = createFootnotesListElement(text, index)
    list.append(elem)
  }

  list.insertBefore($('div.times'))

  $('.footnote').hover(footnoteHoverEnter, footnoteHoverExit)
}

function footnoteHoverEnter (event) {
  var box = $('#fn-box')
  var fn = $('a', this)
  var id = fn.attr('href')
  var html = $(id).html()
  box.html(html)

  var width = box.width()
  var mid = width / 2

  var mainOffsets = $('main').offset()
  var x = event.pageX - mainOffsets.left
  var y = event.pageY - mainOffsets.top
  x -= mid

  x = Math.max(x, -mainOffsets.left)
  x = Math.min(x, $('main').width() - width)

  box.css('left', x.toString() + 'px')
  box.css('top', y.toString() + 'px')

  box.css('z-index', 1)

  box.animate({
    'opacity': 1,
    'z-index': 1
  }, 125)
}

function footnoteHoverExit () {
  var box = $('#fn-box')

  box.animate({
    'opacity': 0,
    'z-index': -1
  }, 125)
}

// /////////////////////////////////////////////////////////////////////////////

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
		// $fig.css('width', '100%');
		// $fig.css('height', '100%');
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

function makeGalleryGrid() {
	$('.gallery').masonry({
		// options
		itemSelector: '.gallery figure',
		gutter: 5,
		// columnWidth: 250
		// percentPosition: true,
		// gutter: 5,
	});
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

	// makeGalleryGrid();

	setHourlyTheme(true);
	setInterval(function () {
		setHourlyTheme();
	}, 60000);
});
