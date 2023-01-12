// Initialize //////////////////////////////////////////////////////////////////

{
    var path = require('path');

    var parser_path = path.join(process.cwd(), 'utils/parser')
    var parser = require(parser_path);

    var title;
    var subtitle;
    var author;
}

////////////////////////////////////////////////////////////////////////////////

start 'start'
    = HTML

HTML 'HTML'
    = vBody:Body {
        var vHead = parser.createHead(title, subtitle, author);

        return {
            html: parser.createHTML(vHead, vBody),
            title: title,
            subtitle: subtitle,
            author: author
        };
    }

Body 'Body'
    = vHeader:Header vMain:Main vFooter:Footer? {
        return parser.createBody(vHeader, vMain, vFooter);
    }

Main 'Main'
    = vComponents:Component+ {
        return parser.createMain(vComponents);
    }

Component 'Component'
    = !Footer
    vComponent:(
        Comment /
        SectionTitle /
        Code /
        Output /
        Embed /
        Gallery /
        Image /
        Video /
        Audio /
        PullQuote /
        Blockquote /
        Statement /
        Table /
        List /
        HorizontalLine /
        Paragraph
    ) {
        return vComponent;
    }

////////////////////////////////////////////////////////////////////////////////

Header 'Header'
    = vTitle:TitleLine vSubtitle:SubtitleLine vAuthor:AuthorLine? Blankline* {
        title = vTitle;
        subtitle = vSubtitle;
        author = vAuthor;
        return parser.createHeader(vTitle, vSubtitle, vAuthor);
    }

TitleLine 'TitleLine'
    = TitleFlag Colon InlineWhitespace+ vTitle:NonBlankline {
        return vTitle;
    }

SubtitleLine 'SubtitleLine'
    = SubtitleFlag Colon InlineWhitespace+ vSubtitle:NonBlankline {
        return vSubtitle;
    }

AuthorLine 'AuthorLine'
    = AuthorFlag Colon InlineWhitespace+ vAuthor:NonBlankline {
        return vAuthor;
    }

TitleFlag 'TitleFlag'
    = '@TITLE'

SubtitleFlag 'SubtitleFlag'
    = '@SUBTITLE'

AuthorFlag 'AuthorFlag'
    = '@AUTHOR'

////////////////////////////////////////////////////////////////////////////////

Image 'Image'
    = vImage:ImageLine Blankline* {
        return vImage;
    }

ImageLine 'ImageLine'
    = ImageFlag LeftArgDelimiter vPath:NotArgDelimiter* RightArgDelimiter
    LeftDelimiter vCaption:(InlineElement / NotDelimiter)* RightDelimiter Newline {
        var path = vPath.join('');
        var caption = vCaption.join('');
        return parser.createMedia('image', path, caption);
    }

ImageFlag 'ImageFlag'
    = '@IMG'

////////////////////////////////////////////////////////////////////////////////

Video 'Video'
    = VideoFlag LeftArgDelimiter vPath:NotArgDelimiter* RightArgDelimiter
    LeftDelimiter vCaption:(InlineElement / NotDelimiter)* RightDelimiter Newline Blankline* {
        var path = vPath.join('');
        var caption = vCaption.join('');
        return parser.createMedia('video', path, caption);
    }

VideoFlag 'VideoFlag'
    = '@VID'

////////////////////////////////////////////////////////////////////////////////

Audio 'Audio'
    = AudioFlag LeftArgDelimiter vPath:NotArgDelimiter* RightArgDelimiter
    LeftDelimiter vCaption:(InlineElement / NotDelimiter)* RightDelimiter Newline Blankline* {
        var path = vPath.join('');
        var caption = vCaption.join('');
        return parser.createMedia('audio', path, caption);
    }

AudioFlag 'AudioFlag'
    = '@AUD'

////////////////////////////////////////////////////////////////////////////////

Code 'Code'
    = CodeStartFlag LeftArgDelimiter vLang:NotArgDelimiter* RightArgDelimiter Newline
    vLines:CodeChar+ CodeEnd Blankline* {
        var lang = vLang.join('');
        var code = vLines.join('');
        return parser.createCode(lang, code);
    }

CodeChar 'CodeChar'
    = !CodeEnd vChar:(Whitespace / NonWhitespace) {
        return vChar;
    }

CodeEnd 'CodeEnd'
    = CodeEndFlag Newline

CodeStartFlag 'CodeStartFlag'
    = '@CODE'

CodeEndFlag 'CodeEndFlag'
    = '@EDOC'

////////////////////////////////////////////////////////////////////////////////

Output 'Output'
    = OutputStart vLines:OutputLine+ OutputEnd Blankline* {
        var samp = vLines.join('\n');
        return parser.createSample(samp);
    }

OutputLine 'OutputLine'
    = !OutputEnd vLine:(NonBlankline / Blankline) {
        return vLine;
    }

OutputStart 'OutputStart'
    = OutputStartFlag Newline

OutputEnd 'OutputEnd'
    = OutputEndFlag Newline

OutputStartFlag 'OutputStartFlag'
    = '@OUT'

OutputEndFlag 'OutputEndFlag'
    = '@TUO'

////////////////////////////////////////////////////////////////////////////////

Embed 'Embed'
= EmbedStartFlag Newline vLines:EmbedChar+ EmbedEnd Blankline* {
    var html = vLines.join('');
    return html;
}

EmbedChar 'EmbedChar'
= !EmbedEnd vChar:(Whitespace / NonWhitespaceNoEscape) {
    return vChar;
}

EmbedEnd 'EmbedEnd'
= EmbedEndFlag Newline

EmbedStartFlag 'EmbedStartFlag'
= '@EMBED'

EmbedEndFlag 'EmbedEndFlag'
= '@DEBME'

////////////////////////////////////////////////////////////////////////////////

Gallery 'Gallery'
    = vImage:ImageLine vImages:ImageLine+ Blankline* {
        vImages.unshift(vImage);
        return parser.createGallery(vImages);
    }

////////////////////////////////////////////////////////////////////////////////

Footer 'Footer'
    = FooterStart vParagraphs:Paragraph+ Blankline* {
        return parser.createFooter(vParagraphs);
    }

FooterStart 'FooterStart'
    = FooterFlag Newline Blankline*

FooterFlag 'FooterFlag'
    = '@FOOTER'

////////////////////////////////////////////////////////////////////////////////

InlineElement 'InlineElement'
    = Bold /
    Italic /
    Strikethrough /
    Quote /
    Input /
    Footnote /
    SmallCaps /
    Measurement /
    Salutation /
    Link /
    EmDash

Bold 'Bold'
    = BoldTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createStrong(vElements.join(''));
    }

BoldTag 'BoldTag'
    = '@B'

Italic 'Italic'
    = ItalicTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createEmphasis(vElements.join(''));
    }

ItalicTag 'ItalicTag'
    = '@I'

Strikethrough 'Strikethrough'
    = StrikethroughTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createStrikethrough(vElements.join(''));
    }

StrikethroughTag 'StrikethroughTag'
    = '@S'

Quote 'Quote'
    = QuoteTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createQuote(vElements.join(''));
    }

QuoteTag 'QuoteTag'
    = '@QUOTE'

Input 'Input'
    = InputTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createKeyboard(vElements.join(''));
    }

InputTag 'InputTag'
    = '@IN'

Footnote 'Footnote'
    = FootnoteTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createFootnote(vElements.join(''));
    }

FootnoteTag 'FootnoteTag'
    = '@FN'

SmallCaps 'SmallCaps'
    = SmallCapsTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createSmallCaps(vElements.join(''));
    }

SmallCapsTag 'SmallCapsTag'
    = '@SC'

Measurement 'Measurement'
    = MeasurementTag LeftArgDelimiter vUnit:NotArgDelimiter* RightArgDelimiter
    LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createMeasurement(vElements.join(''), vUnit.join(''));
    }

MeasurementTag 'MeasurementTag'
    = '@MEAS'

Salutation 'Salutation'
    = SalutationTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createSalutation(vElements.join(''));
    }

SalutationTag 'SalutationTag'
    = '@SALU'

EmDash 'EmDash'
    = '---' {
      return '—';
    }

////////////////////////////////////////////////////////////////////////////////

Link 'Link'
    = InLink / OutLink

InLink 'InLink'
    = InLinkTag LeftArgDelimiter vLink:NotArgDelimiter* RightArgDelimiter
    LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createLink('in', vLink.join(''), vElements.join(''));
    }

InLinkTag 'InLinkTag'
    = '@ILINK'

OutLink 'OutLink'
    = OutLinkTag LeftArgDelimiter vLink:NotArgDelimiter* RightArgDelimiter
    LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createLink('out', vLink.join(''), vElements.join(''));
    }

OutLinkTag 'OutLinkTag'
    = '@OLINK'

////////////////////////////////////////////////////////////////////////////////

SectionTitle 'SectionTitle'
    = vSection:(Section / SuperSection / SubSection) Blankline+ {
        return vSection;
    }

Section 'Section'
    = SectionTag vLevel:(LeftArgDelimiter SectionLevel RightArgDelimiter)? LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        if (vLevel) {
            // We increment by 1 because `h1` is only for title. Use
            // @SUPERSECTION if you want `h1` in the body.
            level = parseInt(vLevel[1]) + 1
            return parser.createSection(level, vElements.join(''));
        }
        return parser.createSection(2, vElements.join(''));
    }

SectionTag 'SectionTag'
    = '@SECTION'

SuperSection 'SuperSection'
    = SuperSectionTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createSection(1, vElements.join(''));
    }

SuperSectionTag 'SuperSectionTag'
    = '@SUPERSECTION'

SubSection 'SubSection'
    = SubSectionTag LeftDelimiter vElements:(InlineElement / NotDelimiter)+ RightDelimiter {
        return parser.createSection(3, vElements.join(''));
    }

SectionLevel 'SectionLevel'
    = [1-3]

SubSectionTag 'SubSectionTag'
    = '@SUBSECTION'

////////////////////////////////////////////////////////////////////////////////

Table 'Table'
    = vCaption:TableHeader vRows:TableRow+ Blankline* {
        return parser.createTable(vCaption, vRows);
    }

TableHeader 'TableHeader'
    = TableFlag vCaption:(LeftDelimiter (InlineElement / NotDelimiter)* RightDelimiter)? Newline {
        if (vCaption) {
            return parser.createTableCaption(vCaption[1].join(''));
        }
        return '';
    }

TableFlag 'TableFlag'
    = '@TABLE'

TableRow 'TableRow'
    = vCells:Cell+ Newline {
        return parser.createTableRow(vCells);
    }

Cell 'Cell'
    = HeaderCell / StandardCell

HeaderCell 'HeaderCell'
= HeaderCellTag LeftDelimiter vElements:(InlineElement / NotDelimiter)* RightDelimiter InlineWhitespace* {
    return parser.createHeaderCell(vElements.join(''));
}

HeaderCellTag 'HeaderCellTag'
= '@HCELL'

StandardCell 'StandardCell'
= StandardCellTag LeftDelimiter vElements:(InlineElement / NotDelimiter)* RightDelimiter InlineWhitespace* {
    return parser.createStandardCell(vElements.join(''));
}

StandardCellTag 'StandardCellTag'
= '@SCELL'

////////////////////////////////////////////////////////////////////////////////

Blockquote 'Blockquote'
    = vParagraphs:BlockquoteParagraph+ Blankline* {
        return parser.createBlockquote(vParagraphs);
    }

BlockquoteParagraph 'BlockquoteParagraph'
    = vLines:BlockquoteNonBlankline+ BlockquoteBlankline* {
        return parser.createParagraph(vLines);
    }

BlockquoteNonBlankline 'BlockquoteNonBlankline'
    = BlockquoteLineStart InlineWhitespace+ vLine:NonBlankline {
        return vLine;
    }

BlockquoteBlankline 'BlockquoteLine'
    = BlockquoteLineStart Blankline

BlockquoteLineStart 'BlockquoteLineStart'
    = '|'

////////////////////////////////////////////////////////////////////////////////

Statement 'Statement'
    = vParagraphs:StatementParagraph+ Blankline* {
        return parser.createStatement(vParagraphs);
    }

StatementParagraph 'StatementParagraph'
    = vLines:StatementNonBlankline+ StatementBlankline* {
        return parser.createParagraph(vLines);
    }

StatementNonBlankline 'StatementNonBlankline'
    = StatementLineStart InlineWhitespace+ vLine:NonBlankline {
        return vLine;
    }

StatementBlankline 'StatementLine'
    = StatementLineStart Blankline

StatementLineStart 'StatementLineStart'
    = '*'

////////////////////////////////////////////////////////////////////////////////

PullQuote 'PullQuote'
    = LeftPullQuote / RightPullQuote

LeftPullQuote 'LeftPullQuote'
    = vLines:LeftPullQuoteLine+ Blankline* {
        return parser.createPullQuote('left', vLines);
    }

LeftPullQuoteLine 'LeftPullQuoteLine'
    = LeftPullQuoteLineStart InlineWhitespace+ vLine:NonBlankline {
        return vLine;
    }

LeftPullQuoteLineStart 'LeftPullQuoteLineStart'
    = '<'

RightPullQuote 'RightPullQuote'
    = vLines:RightPullQuoteLine+ Blankline* {
        return parser.createPullQuote('right', vLines);
    }

RightPullQuoteLine 'RightPullQuoteLine'
    = RightPullQuoteLineStart InlineWhitespace+ vLine:NonBlankline {
        return vLine;
    }

RightPullQuoteLineStart 'RightPullQuoteLineStart'
    = '>'

////////////////////////////////////////////////////////////////////////////////

List 'List'
    = OrderedList / UnorderedList

OrderedList 'OrderedList'
    = vLines:OrderedLine+ Blankline* {
        return parser.createList('ol', vLines);
    }

OrderedLine 'OrderedLine'
    = tabs:Tab* OrderedStart InlineWhitespace+ vLine:NonBlankline {
        return {
            level: tabs.length,
            content: vLine
        };
    }

OrderedStart 'OrderedStart'
    = [0-9]+ '.'

UnorderedList 'UnorderedList'
    = vLines:UnorderedLine+ Blankline* {
        return parser.createList('ul', vLines);
    }

UnorderedLine 'UnorderedLine'
    = tabs:Tab* UnorderedStart InlineWhitespace+ vLine:NonBlankline {
        return {
            level: tabs.length,
            content: vLine
        };
    }

UnorderedStart 'UnorderedStart'
    = '-'

////////////////////////////////////////////////////////////////////////////////

HorizontalLine 'HorizontalLine'
    = Hyphen Hyphen Hyphen+ Blankline+ {
        return parser.createSeparator();
    }

////////////////////////////////////////////////////////////////////////////////

Comment 'Comment'
    = vLines:CommentLine+ Blankline* {
        return '';
    }

CommentLine 'CommentLine'
    = CommentStart NonBlankline?

CommentStart 'CommentStart'
    = '#' InlineWhitespace*

////////////////////////////////////////////////////////////////////////////////

Paragraph 'Paragraph'
    = vLines:NonBlankline+ Blankline* {
        return parser.createParagraph(vLines);
    }

////////////////////////////////////////////////////////////////////////////////

NonBlankline 'NonBlankline'
    = vLine:(InlineElement / NonWhitespace / InlineWhitespace)+ Newline {
        return vLine.join('');
    }

Blankline 'Blankline'
    = vLine:InlineWhitespace* Newline

NonWhitespace 'NonWhitespace'
    = !Whitespace vNonWhitespace:. {
        return parser.escapeHTML(vNonWhitespace);
    }

NonWhitespaceNoEscape 'NonWhitespaceNoEscape'
    = !Whitespace vNonWhitespaceNoEscape:. {
        return vNonWhitespaceNoEscape;
    }

Whitespace 'Whitespace'
    = InlineWhitespace / Newline

InlineWhitespace 'InlineWhitespace'
    = Tab / Space

NotArgDelimiter 'NotArgDelimiter'
    = !LeftArgDelimiter !RightArgDelimiter vChar:. {
        return vChar;
    }

NotDelimiter 'NotDelimiter'
    = !LeftDelimiter !RightDelimiter vChar:. {
        return vChar;
    }

LeftDelimiter 'LeftDelimiter'
    = '<('

RightDelimiter 'RightDelimiter'
    = ')>'

LeftArgDelimiter 'LeftArgDelimiter'
    = '<['

RightArgDelimiter 'RightArgDelimiter'
    = ']>'

Colon 'Colon'
    = ':'

Hyphen 'Hyphen'
    = '-'

Space 'Space'
    = '\u0020' / '\u3000' // latin and CJK

Tab 'Tab'
    = '\t' / '    '

Newline 'Newline'
    = '\n'
    / '\r' '\n'?
