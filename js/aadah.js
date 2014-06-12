var THEME = {'body': {'color': {'main': '#ffffff',
                                'alt': '#000000'
                               },

                      'background-color': {'main': '#222222',
                                           'alt': '#dddddd'
                                          }
                     },

             'header': {'border-bottom-color': {'main': '#ffffff',
                                                 'alt': '#000000'
                                                }
                        },

             '.author': {'color': {'main': '#aaaaaa',
                                   'alt': '#555555'
                                  }
                        },

             'article h1, article h2, article h3, article h4, article h5, article h6': {'border-left-color': {'main': '#ffffff',
                                                                                                                    'alt': '#000000'
                                                                                                                   }
                                                                                             },

             'footer': {'color': {'main': '#aaaaaa',
                                   'alt': '#555555'
                                  },

                         'border-top-color': {'main': '#ffffff',
                                              'alt': '#000000'
                                             }
                        },

             'blockquote': {'color': {'main': '#bbbbbb',
                                      'alt': '#444444'
                                     },

                            'border-left-color': {'main': '#bbbbbb',
                                                  'alt': '#444444'
                                                 }
                           },

             '.pquoter, .pquotel': {'color': {'main': '#bbbbbb',
                                              'alt': '#444444'
                                             },

                                    'background-color': {'main': '#000000',
                                                         'alt': '#ffffff'
                                                        }
                                   },

             'img': {'border-color': {'main': '#000000',
                                      'alt': '#ffffff'
                                     }
                    },

             'video, audio': {'background-color': {'main': '#000000',
                                                   'alt': '#ffffff'
                                                  }
                             },

             'code': {'background-color': {'main': '#000000',
                                           'alt': '#ffffff'
                                          }
                     },

             '.input, .output': {'background-color': {'main': '#111111',
                                                      'alt': '#eeeeee'
                                                     }
                                },

             'table': {'background-color': {'main': '#000000',
                                            'alt': '#ffffff'
                                           }
                      },

             'th': {'background-color': {'main': '#222222',
                                         'alt': '#dddddd'
                                        }
                   },
             
             '.gallery figure': {'border-color': {'main': '#000000',
                                                  'alt': '#ffffff'
                                                 },
                                 'background-color': {'main': '#000000',
                                                      'alt': '#ffffff'
                                                     }
                                },
             
             '.gallery figcaption': {'background-color': {'main': '#000000',
                                                          'alt': '#ffffff'
                                                         }
                                    },
             
             'article a': {'border-bottom-color': {'main': '#ffffff',
                                                    'alt': '#000000'
                                                   }
                           },

             // code theme colors
             '.str': {'color': {'main': '#00ff00',
                                'alt': '#00b000'
                               }
                     },

             '.kwd': {'color': {'main': '#ffff00',
                                'alt': '#b0b000'
                               }
                     },

             '.typ': {'color': {'main': '#00ffff',
                                'alt': '#00b0b0'
                               }
                     },

             '.lit': {'color': {'main': '#ff00ff',
                                'alt': '#b000b0'
                               }
                     },

             '.pun': {'color': {'main': '#ffffff',
                                'alt': '#000000'
                               }
                     },

             '.pln': {'color': {'main': '#ffffff',
                                'alt': '#000000'
                               }
                     },

             '.tag': {'color': {'main': '#00ffff',
                                'alt': '#00b0b0'
                               }
                     },

             '.atn': {'color': {'main': '#ffff00',
                                'alt': '#b0b000'
                               }
                     },

             '.atv': {'color': {'main': '#00ff00',
                                'alt': '#00b000'
                               }
                     },

             '.dec': {'color': {'main': '#ff00ff',
                                'alt': '#b000b0'
                               }
                     }
            };

//--------------------------------------------------------------------------------------------------

function switchTheme(theme) {
    var current;

    // if no valid theme string is passed in, function acts as a toggle
    if (theme != 'main' && theme != 'alt') {
        current = localStorage.getItem('current') == null ? 'alt' : localStorage.getItem('current');
        current = current == 'main' ? 'alt' : 'main';
    }
    else {
        current = theme;
    }

	// store in localStorage and change theme accordingly
    localStorage.setItem('current', current);
    for (var selector in THEME) {
        var $sel = $(selector);
        var props = THEME[selector];
        for (var prop in props) {
            $sel.css(prop, props[prop][current]);
        }
    }
}

function toggleImage() {
    $img = $(this);
    $fig = $img.parent();
    if ($fig.css('width') == '230px') {
        var img_width = $img.css('width');
        var img_height = $img.css('height');
        $fig.css('width', img_width);
        $fig.css('height', img_height);
    }
    else {
        $fig.css('width', '230px');
        $fig.css('height', '230px');
    }
}

function isHome() {
    var regex = /^\/$/;
    return regex.test(location.pathname);
}

function isPost() {
    var regex = /^\/blog\/.+\/$/;
    // if the page is not found, we don't want to count it as a post!
    return regex.test(location.pathname) && $('.title').text() != '404';
}

function prependZero(piece) {
    piece += '';
    return piece.length == 1 ? '0' + piece : piece;
}

function formatTimestamp(date) {
    // if date is omitted, just return the current formatted datetime
    var d = date == null ? new Date() : new Date(date);
    
    // first, the date
    var newDate = d.getFullYear() + '-'; // year
    newDate += prependZero(d.getUTCMonth() + 1) + '-'; // month (zero indexed)
    newDate += prependZero(d.getUTCDate()) + ' '; // date
    
    // second, the time
    newDate += prependZero(d.getUTCHours()) + ':'; // hour
    newDate += prependZero(d.getUTCMinutes()) + ':'; // minute
    newDate += prependZero(d.getUTCSeconds()) + ' UTC'; // second
    
    return newDate;
}

//--------------------------------------------------------------------------------------------------

$(document).ready(function() {
    $('nav, nav a').click(switchTheme);
    $('img', '.gallery').click(toggleImage);
    
    if (isPost()) {    
        $.ajax({
            type: 'POST',
            url: '/post',
            data: {title: $('.title').text(),
                   subtitle: $('.subtitle').text(),
                   author: $('.author').text(),
                   posted: formatTimestamp($('time').text()),
                   dir: location.pathname
                  },
            success: function(data, status) {
                console.log('Success! /post recieved:', status, data);
            },
            error: function(jqXHR, status, error) {
            	console.log('Error with /post:', status, error);
            }
        });
    }
    
    $.ajax({
        type: 'POST',
        url: '/visit',
        data: {last: formatTimestamp()},
        success: function(data, status) {
            console.log('Success! /visit recieved:', status, data);
        },
        error: function(xhr, status, error) {
            console.log('Error with /visit:', status, error);
        }
    });
});

$(window).load(function() {
    // preserve theme while navigating site
    switchTheme(localStorage.getItem('current'));
});
