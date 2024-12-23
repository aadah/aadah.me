var fs = require('fs')
var peg = require('pegjs')
var moment = require('moment')
var cheerio = require('cheerio')

var grammar = fs.readFileSync('grammars/manuscript.pegjs', 'utf8')
var pegParser = peg.generate(grammar)

class Parser {
  constructor(forFeed) {
    this.forFeed = forFeed
  }
}

Parser.prototype._clean = function(text) {
  return cheerio.load(text).text().trim()
}

Parser.prototype._parse = function (manuscript) {
  return pegParser.parse(manuscript, { parser: this })
}

Parser.prototype.parse = function (path, manuscript, post) {
  var result = this._parse(manuscript)
  var pathRgx = new RegExp('\\[PATH\\]', 'g')
  var timesRgx = new RegExp('\\[TIMES\\]', 'g')

  result.html = result.html.replace(pathRgx, path)

  if (post && !this.forFeed) {
    times = this.createTimes(post.posted, post.updated)
    result.html = result.html.replace(timesRgx, times)
  } else {
    result.html = result.html.replace(timesRgx, '')
  }

  return result
}

Parser.prototype.handler = function (filePath, replacements) {
  var parser = this;
  return function (req, res, next) {
    fs.readFile(filePath, 'utf8', function (err, manuscript) {
      if (err) {
        res.status(500).render('error/500')
      } else {
        try {
          if (replacements) {
            const vars = Object.keys(replacements);
            vars.forEach(v => {
              manuscript = manuscript.replace(`[${v}]`, replacements[v])
            })
          }
          var path = `${req.baseUrl}${req.path}`
          var result = parser.parse(path, manuscript)
          res.status(200).type('text/html').send(result.html)
        } catch (err) {
          res.status(500).render('error/500')
        }
      }
    })
  }
}

// /////////////////////////////////////////////////////////////////////////////

Parser.prototype.formatTimestamp = function (date, withTime) {
  var mdate = date ? moment.utc(date) : moment.utc()
  var template = 'dddd D MMMM YYYY'

  template = withTime ? template + ' [at] H:mm:ss UTC' : template

  var formattedDate = mdate.format(template)

  return formattedDate
}

Parser.prototype.createBlogPost = function (post) {
  return this.createEntry(
    `/blog/${post._id}`,
    post.title,
    post.subtitle,
    post.author,
    this.formatTimestamp(post.posted)
  )
}

Parser.prototype.createEntry = function (link, title, subtitle, author, posted) {
  var template = fs.readFileSync('grammars/templates/entry.html', 'utf8').trim()

  template = template.replace('[LINK]', link)
  template = template.replace('[TITLE]', title)
  template = template.replace('[SUBTITLE]', subtitle)
  template = template.replace('[AUTHOR]', author ? `<p class="a">${author}</p>` : "")
  template = template.replace('[DATE]', posted ? `<p class="d">${posted}</p>` : "")

  return template
}

Parser.prototype.escapeHTML = function (text) {
  var ampersandRgx = new RegExp('&', 'g')
  var leftAngleBracketRgx = new RegExp('<', 'g')
  var rightAngleBracketRgx = new RegExp('>', 'g')

  text = text.replace(ampersandRgx, '&amp;')
  text = text.replace(leftAngleBracketRgx, '&lt;')
  text = text.replace(rightAngleBracketRgx, '&gt;')

  return text
}

// /////////////////////////////////////////////////////////////////////////////

Parser.prototype.createStrong = function (text) {
  var template = fs.readFileSync('grammars/templates/strong.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

Parser.prototype.createEmphasis = function (text) {
  var template = fs.readFileSync('grammars/templates/em.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

Parser.prototype.createStrikethrough = function (text) {
  var template = fs.readFileSync('grammars/templates/s.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

Parser.prototype.createSalutation = function (text) {
  var template = fs.readFileSync('grammars/templates/salutation.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

Parser.prototype.createFootnote = function (text) {
  var template = fs.readFileSync('grammars/templates/footnote.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

Parser.prototype.createSmallCaps = function (text) {
  var template = fs.readFileSync('grammars/templates/small_caps.html', 'utf8').trim()

  template = template.replace('[TEXT]', text)

  return template
}

Parser.prototype.createMeasurement = function (amount, unit) {
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

Parser.prototype.createQuote = function (quote) {
  var template = fs.readFileSync('grammars/templates/quote.html', 'utf8').trim()

  template = template.replace('[QUOTE]', quote)

  return template
}

Parser.prototype.createLink = function (target, link, text) {
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

Parser.prototype.createBlockquote = function (paragraphs) {
  var template = fs.readFileSync('grammars/templates/blockquote.html', 'utf8')

  paragraphs = paragraphs.join('')
  template = template.replace('[PARAGRAPHS]', paragraphs)

  return template
}

Parser.prototype.createStatement = function (paragraphs) {
  var template = fs.readFileSync('grammars/templates/statement.html', 'utf8')

  paragraphs = paragraphs.join('')
  template = template.replace('[PARAGRAPHS]', paragraphs)

  return template
}

Parser.prototype.createPullQuote = function (side, lines) {
  if (this.forFeed) {
    return ''
  }

  var template = fs.readFileSync('grammars/templates/q.html', 'utf8')
  side = side[0]
  lines = lines.join('\n')

  template = template.replace('[SIDE]', side)
  template = template.replace('[LINES]', lines)

  return template
}

Parser.prototype.createKeyboard = function (input) {
  var template = fs.readFileSync('grammars/templates/kbd.html', 'utf8').trim()

  template = template.replace('[INPUT]', input)

  return template
}

Parser.prototype.createHTML = function (head, body) {
  if (this.forFeed) {
    return body
  }

  var template = fs.readFileSync('grammars/templates/html.html', 'utf8')

  template = template.replace('[HEAD]', head)
  template = template.replace('[BODY]', body)

  return template
}

Parser.prototype.createHead = function (title, subtitle, author, headImage) {
  var template = fs.readFileSync('grammars/templates/head.html', 'utf8')

  var titleRgx = new RegExp('\\[TITLE\\]', 'g')
  var subtitleRgx = new RegExp('\\[SUBTITLE\\]', 'g')
  var authorRgx = new RegExp('\\[AUTHOR\\]', 'g')
  var headImageRgx = new RegExp('\\[IMAGE\\]', 'g')

  template = template.replace(titleRgx, this._clean(title))
  template = template.replace(subtitleRgx, this._clean(subtitle))
  template = template.replace(authorRgx, this._clean(author) || '')
  template = template.replace(headImageRgx, headImage || 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect rx=%2210%22 width=%22100%22 height=%22100%22 fill=%22%23202020%22 /><text x=%220.15em%22 y=%22.95em%22 font-size=%2280%22 fill=%22%23ffffff%22>⚖</text></svg>')

  return template
}

Parser.prototype.createBody = function (header, main, footer) {
  footer = footer || this.createFooter([])

  if (this.forFeed) {
    return main + footer
  }

  var template = fs.readFileSync('grammars/templates/body.html', 'utf8')

  template = template.replace('[HEADER]', header)
  template = template.replace('[MAIN]', main)
  template = template.replace('[FOOTER]', footer)

  return template
}

Parser.prototype.createHeader = function (title, subtitle, author) {
  var template = fs.readFileSync('grammars/templates/header.html', 'utf8')

  template = template.replace('[TITLE]', title)
  template = template.replace('[SUBTITLE]', subtitle)

  if (author) {
    template = template.replace('[AUTHOR]', this.createAuthor(author))
  } else {
    template = template.replace('[AUTHOR]', '')
  }

  return template
}

Parser.prototype.createAuthor = function (author) {
  var template = fs.readFileSync('grammars/templates/author.html', 'utf8')

  template = template.replace('[AUTHOR]', author)

  return template
}

Parser.prototype.createMain = function (components) {
  var template = fs.readFileSync('grammars/templates/main.html', 'utf8')

  components = components.join('')

  if (this.forFeed) {
    return components
  }

  template = template.replace('[COMPONENTS]', components)

  return template
}

Parser.prototype.createFooter = function (paragraphs) {
  var template = fs.readFileSync('grammars/templates/footer.html', 'utf8')

  paragraphs = paragraphs.join('')
  template = template.replace('[PARAGRAPHS]', paragraphs)

  return template
}

Parser.prototype.createTimes = function (posted, updated) {
  var template = fs.readFileSync('grammars/templates/times.html', 'utf8')
  var postedRgx = new RegExp('\\[POSTED\\]', 'g')
  var updatedRgx = new RegExp('\\[UPDATED\\]', 'g')

  template = template.replace(postedRgx, this.formatTimestamp(posted, true))
  template = template.replace(updatedRgx, this.formatTimestamp(updated, true))

  return template
}

Parser.prototype.createMedia = function (type, path, caption) {
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

Parser.prototype.createParagraph = function (lines) {
  var template = fs.readFileSync('grammars/templates/paragraph.html', 'utf8')

  lines = lines.join('\n')
  template = template.replace('[LINES]', lines)

  return template
}

Parser.prototype.createGallery = function (images) {
  var template = fs.readFileSync('grammars/templates/gallery.html', 'utf8')

  images = images.join('')
  template = template.replace('[IMAGES]', images)

  return template
}

Parser.prototype.createCode = function (lang, code) {
  var template = fs.readFileSync('grammars/templates/code.html', 'utf8')

  template = template.replace('[LANG]', lang)
  template = template.replace('[CODE]', code)

  return template
}

Parser.prototype.createSample = function (samp) {
  var template = fs.readFileSync('grammars/templates/samp.html', 'utf8')

  template = template.replace('[SAMPLE]', samp)

  return template
}

Parser.prototype.createTable = function (caption, rows) {
  var template = fs.readFileSync('grammars/templates/table.html', 'utf8')

  rows = rows.join('')
  template = template.replace('[CAPTION]', caption)
  template = template.replace('[ROWS]', rows)

  return template
}

Parser.prototype.createTableCaption = function (caption) {
  var template = fs.readFileSync('grammars/templates/caption.html', 'utf8')

  template = template.replace('[CAPTION]', caption)

  return template
}

Parser.prototype.createTableRow = function (cells) {
  var template = fs.readFileSync('grammars/templates/tr.html', 'utf8')

  cells = cells.join(' ')
  template = template.replace('[CELLS]', cells)

  return template
}

Parser.prototype.createHeaderCell = function (text) {
  var template = fs.readFileSync('grammars/templates/th.html', 'utf8')

  template = template.replace('[TEXT]', text)

  return template
}

Parser.prototype.createStandardCell = function (text) {
  var template = fs.readFileSync('grammars/templates/td.html', 'utf8')

  template = template.replace('[TEXT]', text)

  return template
}

Parser.prototype.createSection = function (num, text) {
  var template = fs.readFileSync('grammars/templates/h.html', 'utf8')
  var numRgx = new RegExp('\\[NUM\\]', 'g')
  var idRgx = new RegExp('\\[ID\\]', 'g')

  template = template.replace(numRgx, num)
  template = template.replace('[TEXT]', text)
  
  text = this._clean(text)

  let id = `s${num-1}-` + text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  id = id.replace(/^-+|-+$/g, '')
  template = template.replace(idRgx, id)

  return template
}

Parser.prototype.createList = function (tag, lines) {
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
      lineHeader.content = [lineHeader.content, subList].join('')
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

  bullets = lines.map(formatLine).join('')
  list = listTempl.replace(tagRgx, tag)
  list = list.replace('[CONTENT]', bullets)

  return list
}

function formatLine(line) {
  var liTempl = fs.readFileSync('grammars/templates/list_element.html', 'utf8')
  return liTempl.replace('[CONTENT]', line.content)
}

Parser.prototype.createSeparator = function () {
  var template = fs.readFileSync('grammars/templates/separator.html', 'utf8')
  return template
}

module.exports = {
  web: new Parser(false),
  feed: new Parser(true)
}
