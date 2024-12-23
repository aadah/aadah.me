/* global $ */

function findFootnotes () {
  return $('.footnote')
}

function extractFootnoteText (f, i) {
  var footnote = $(f)
  var text = footnote.html()
  var num = i.toString()

  footnote.text(num)
  footnote.attr('id', 'f' + num)

  return text
}

function createFootnotesListElement (text, i) {
  var elem = $('<li>')
  var num = i.toString()
  var span = $('<span>')
  var link = $('<a>')

  span.html(text)
  span.attr('id', 't' + num)
  elem.append(span)

  link.text('⇑')
  link.attr('href', '#f' + num)
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

  $('footer').prepend(list)

  $('.footnote').hover(footnoteHoverEnter, footnoteHoverExit)
}

function footnoteHoverEnter (event) {
  var box = $('#fn-box')
  var fn = $(this)
  var id = fn.attr('id')
  id = '#t' + id.substring(1)
  var span = $(id)
  var html = span.html()
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

function toggleImage () {
  var $img = $(this)
  var $fig = $img.closest('figure')
  $fig.toggleClass('expanded', 350, 'swing')
}

// /////////////////////////////////////////////////////////////////////////////

$(function () {
  $('body').data('theme', 'main')
  createFootnotesList()
})

$(window).load(function () {
  $('img', '.gallery').click(toggleImage)
})
                                                                                                                                                                                           
// /////////////////////////////////////////////////////////////////////////////                                                                                                             
                                                                                                                                                                                             
window.MathJax = {                                                                                                                                                                           
  loader: {                                                                                                                                                                                  
    load: [                                                                                                                                                                                  
      '[tex]/mathtools',                                                                                                                                                                     
      // '[tex]/tagformat'                                                                                                                                                                   
    ]                                                                                                                                                                                        
  },                                                                                                                                                                                         
  tex: {                                                                                                                                                                                     
    packages: {                                                                                                                                                                              
      '[+]': [                                                                                                                                                                               
        'mathtools',                                                                                                                                                                         
        // 'tagformat'                                                                                                                                                                       
      ]                                                                                                                                                                                      
    },                                                                                                                                                                                       
    macros: {                                                                                                                                                                                
      textsc: ['\\style{font-variant-caps: small-caps;}{\\text{#1}}', 1]                                                                                                                     
    },                                                                                                                                                                                       
    tags: 'ams',                                                                                                                                                                             
    // tagformat: {                                                                                                                                                                          
    //   tag: (tag) => 'Equation ' + tag,                                                                                                                                                    
    // }                                                                                                                                                                                     
  },                                                                                                                                                                                         
};
