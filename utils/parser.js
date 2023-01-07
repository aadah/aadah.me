var fs = require('fs')
var peg = require('pegjs')
var moment = require('moment')

var blogGrammar = fs.readFileSync('grammars/blog.pegjs', 'utf8')
var pegParser = peg.buildParser(blogGrammar)

var parser = {}

parser._parse = function (manuscript) {
  return pegParser.parse(manuscript)
}

parser.parse = function (path, manuscript, post) {
  var result = parser._parse(manuscript)
  var pathRgx = new RegExp('\\[PATH\\]', 'g')
  var timesRgx = new RegExp('\\[TIMES\\]', 'g')

  result.html = result.html.replace(pathRgx, path)

  if (post) {
    times = parser.createTimes(post.posted, post.updated)
    result.html = result.html.replace(timesRgx, times)
  } else {
    result.html = result.html.replace(timesRgx, '')
  }

  return result
}

// /////////////////////////////////////////////////////////////////////////////

parser.formatTimestamp = function (date, withTime) {
  var mdate = date ? moment.utc(date) : moment.utc()
  var template = 'dddd D MMMM YYYY'

  template = withTime ? template + ' [at] H:mm:ss UTC' : template

  var formattedDate = mdate.format(template)

  return formattedDate
}

parser.createBlogPost = function (post) {
  var template = fs.readFileSync('grammars/templates/blog_post.html', 'utf8').trim()

  template = template.replace('[POSTID]', post._id)
  template = template.replace('[TITLE]', post.title)
  template = template.replace('[SUBTITLE]', post.subtitle)
  template = template.replace('[AUTHOR]', post.author)
  template = template.replace('[DATE]', parser.formatTimestamp(post.posted))

  return template
}

parser.escapeHTML = function (text) {
  var ampersandRgx = new RegExp('&', 'g')
  var leftAngleBracketRgx = new RegExp('<', 'g')
  var rightAngleBracketRgx = new RegExp('>', 'g')

  text = text.replace(ampersandRgx, '&amp;')
  text = text.replace(leftAngleBracketRgx, '&lt;')
  text = text.replace(rightAngleBracketRgx, '&gt;')

  return text
}

// /////////////////////////////////////////////////////////////////////////////

parser.createStrong = function (text) {
  var template = fs.readFileSync('grammars/templates/strong.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

parser.createEmphasis = function (text) {
  var template = fs.readFileSync('grammars/templates/em.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

parser.createStrikethrough = function (text) {
  var template = fs.readFileSync('grammars/templates/s.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

parser.createSalutation = function (text) {
  var template = fs.readFileSync('grammars/templates/salutation.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

parser.createFootnote = function (text) {
  var template = fs.readFileSync('grammars/templates/footnote.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

parser.createSmallCaps = function (text) {
  var template = fs.readFileSync('grammars/templates/small_caps.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

parser.createMeasurement = function (amount, unit) {
  var filename
  var template

  if (unit) {
    filename = 'grammars/templates/measurement' + '.html'
  } else {
    filename = 'grammars/templates/measurement' + '_no_unit.html'
  }

  template = fs.readFileSync(filename, 'utf8')
  template = template.replace('[AMOUNT]', amount)
  template = template.replace('[UNIT]', unit)

  return template
}

parser.createQuote = function (quote) {
  var template = fs.readFileSync('grammars/templates/quote.html', 'utf8').trim()

  template = template.replace('[QUOTE]', quote)

  return template
}

parser.createLink = function (target, link, text) {
  var template = fs.readFileSync('grammars/templates/a.html', 'utf8').trim()

  if (target === 'in') {
    target = '_self'
  } else if (target === 'out') {
    target = '_blank'
  }

  template = template.replace('[TARGET]', target)
  template = template.replace('[LINK]', link)
  template = template.replace('[TEXT]', text)

  return template
}

parser.createBlockquote = function (paragraphs) {
  var template = fs.readFileSync('grammars/templates/blockquote.html', 'utf8')

  paragraphs = paragraphs.join('\n')
  template = template.replace('[PARAGRAPHS]', paragraphs)

  return template
}

parser.createPullQuote = function (side, lines) {
  var template = fs.readFileSync('grammars/templates/q.html', 'utf8')
  side = side[0]
  lines = lines.join('\n')

  template = template.replace('[SIDE]', side)
  template = template.replace('[LINES]', lines)

  return template
}

parser.createKeyboard = function (input) {
  var template = fs.readFileSync('grammars/templates/kbd.html', 'utf8').trim()

  template = template.replace('[INPUT]', input)

  return template
}

parser.createHTML = function (head, body) {
  var template = fs.readFileSync('grammars/templates/html.html', 'utf8')

  template = template.replace('[HEAD]', head)
  template = template.replace('[BODY]', body)

  return template
}

parser.createHead = function (title, subtitle, author) {
  var template = fs.readFileSync('grammars/templates/head.html', 'utf8')

  var titleRgx = new RegExp('\\[TITLE\\]', 'g')
  var subtitleRgx = new RegExp('\\[SUBTITLE\\]', 'g')
  var authorRgx = new RegExp('\\[AUTHOR\\]', 'g')

  template = template.replace(titleRgx, title)
  template = template.replace(subtitleRgx, subtitle)
  template = template.replace(authorRgx, author || '')

  return template
}

parser.createBody = function (header, main, footer) {
  var template = fs.readFileSync('grammars/templates/body.html', 'utf8')

  footer = footer || parser.createFooter([])

  template = template.replace('[HEADER]', header)
  template = template.replace('[MAIN]', main)
  template = template.replace('[FOOTER]', footer)

  return template
}

parser.createHeader = function (title, subtitle, author) {
  var template = fs.readFileSync('grammars/templates/header.html', 'utf8')

  template = template.replace('[TITLE]', title)
  template = template.replace('[SUBTITLE]', subtitle)

  if (author) {
    template = template.replace('[AUTHOR]', parser.createAuthor(author))
  } else {
    template = template.replace('[AUTHOR]', '')
  }

  return template
}

parser.createAuthor = function (author) {
  var template = fs.readFileSync('grammars/templates/author.html', 'utf8')
  
  template = template.replace('[AUTHOR]', author)
  
  return template
}

parser.createMain = function (components) {
  var template = fs.readFileSync('grammars/templates/main.html', 'utf8')

  components = components.join('\n')
  template = template.replace('[COMPONENTS]', components)

  return template
}

parser.createFooter = function (paragraphs) {
  var template = fs.readFileSync('grammars/templates/footer.html', 'utf8')

  paragraphs = paragraphs.join('\n')
  template = template.replace('[PARAGRAPHS]', paragraphs)

  return template
}

parser.createTimes = function (posted, updated) {
  var template = fs.readFileSync('grammars/templates/times.html', 'utf8')
  var postedRgx = new RegExp('\\[POSTED\\]', 'g')
  var updatedRgx = new RegExp('\\[UPDATED\\]', 'g')

  template = template.replace(postedRgx, parser.formatTimestamp(posted, true))
  template = template.replace(updatedRgx, parser.formatTimestamp(updated, true))

  return template
}

parser.createMedia = function (type, path, caption) {
  var filename
  var template

  if (caption) {
    filename = 'grammars/templates/' + type + '.html'
  } else {
    filename = 'grammars/templates/' + type + '_no_caption.html'
  }

  template = fs.readFileSync(filename, 'utf8')
  template = template.replace('[PATH]', path)
  template = template.replace('[CAPTION]', caption)

  return template
}

parser.createParagraph = function (lines) {
  var template = fs.readFileSync('grammars/templates/paragraph.html', 'utf8')

  lines = lines.join('\n')
  template = template.replace('[LINES]', lines)

  return template
}

parser.createGallery = function (images) {
  var template = fs.readFileSync('grammars/templates/gallery.html', 'utf8')

  images = images.join('\n')
  template = template.replace('[IMAGES]', images)

  return template
}

parser.createCode = function (lang, code) {
  var template = fs.readFileSync('grammars/templates/code.html', 'utf8')

  template = template.replace('[LANG]', lang)
  template = template.replace('[CODE]', code)

  return template
}

parser.createSample = function (samp) {
  var template = fs.readFileSync('grammars/templates/samp.html', 'utf8')

  template = template.replace('[SAMPLE]', samp)

  return template
}

parser.createTable = function (caption, rows) {
  var template = fs.readFileSync('grammars/templates/table.html', 'utf8')

  rows = rows.join('\n')
  template = template.replace('[CAPTION]', caption)
  template = template.replace('[ROWS]', rows)

  return template
}

parser.createTableCaption = function (caption) {
  var template = fs.readFileSync('grammars/templates/caption.html', 'utf8')

  template = template.replace('[CAPTION]', caption)

  return template
}

parser.createTableRow = function (cells) {
  var template = fs.readFileSync('grammars/templates/tr.html', 'utf8')

  cells = cells.join(' ')
  template = template.replace('[CELLS]', cells)

  return template
}

parser.createHeaderCell = function (text) {
  var template = fs.readFileSync('grammars/templates/th.html', 'utf8')

  template = template.replace('[TEXT]', text)

  return template
}

parser.createStandardCell = function (text) {
  var template = fs.readFileSync('grammars/templates/td.html', 'utf8')

  template = template.replace('[TEXT]', text)

  return template
}

parser.createSection = function (num, text) {
  var template = fs.readFileSync('grammars/templates/h.html', 'utf8')
  var numRgx = new RegExp('\\[NUM\\]', 'g')

  template = template.replace(numRgx, num)
  template = template.replace('[TEXT]', text)

  return template
}

parser.createList = function (tag, lines) {
  while (true) {
    var deepestLevel = -1
    var i = undefined
    var j = undefined
    for (var k = 0; k < lines.length; k++) {
      var level = lines[k].level
      if (level > deepestLevel) {
        deepestLevel = level
        i = k
        j = i + 1
      } else if (level < deepestLevel) {
        break
      } else {
        j++
      }
    }

    linesBefore = lines.slice(0, i)
    subList = formatList(tag, lines.slice(i, j))
    linesAfter = lines.slice(j)

    lineHeader = linesBefore.pop()
    if (lineHeader) {
      lineHeader.content = [lineHeader.content, subList].join('\n')
      linesBefore.push(lineHeader)
    } else {
      return subList
    }

    lines = linesBefore.concat(linesAfter)
  }
}

function formatList(tag, lines) {
  var listTempl = fs.readFileSync('grammars/templates/list.html', 'utf8')
  var tagRgx = new RegExp('\\[TAG\\]', 'g')

  bullets = lines.map(formatLine).join('\n')
  list = listTempl.replace(tagRgx, tag)
  list = list.replace('[CONTENT]', bullets)

  return list
}

function formatLine(line) {
  var liTempl = fs.readFileSync('grammars/templates/list_element.html', 'utf8')
  return liTempl.replace('[CONTENT]', line.content)
}

parser.createSeparator = function () {
  var template = fs.readFileSync('grammars/templates/separator.html', 'utf8')
  return template
}

module.exports = parser
