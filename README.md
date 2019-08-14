## [aadah.me](http://aadah.me/)

Welcome to my blog.

### Design

The design for the blog looked into some considerations.
Dynamic blog posts were unnecessary, so a static file serving
paradigm was best. All content on one page, with new
content loading with bloated AJAX requests, was unwanted.
The site should present material simply with each page
being a standalone entity.

The theme depends on the time of day. It automatically inverts every twelve
hours. The minimalism was ultimately appealing. Despite the simple look, it is
meticulously crafted.

Galleries expand their displayed images for better viewing
instead of revealing a new frame that obscures the view of
the page.

It should be possible to write an academic piece of work
in a presentable manner. Displaying code and LaTeX was
thus very important. CSS takes care of formatting when
printing or saving as a PDF.

### How It's Built

Along with the standard HTML/CSS/JS, the site uses:

- [Node.js](http://nodejs.org/) as the server.
- [Google's code syntax highligther](https://code.google.com/p/google-code-prettify/)
	for code.
- [MathJax](http://www.mathjax.org/) for LaTeX.
- Fonts from [Google Fonts](https://fonts.google.com). I use
	[Spectral](https://fonts.google.com/specimen/Spectral) as my primary font and
	[Inconsolata](http://levien.com/type/myfonts/inconsolata.html) for code.

### License

The blog is under the [GNU GPL v3.0 license](https://www.gnu.org/copyleft/gpl.html).
I enjoyed building it, and I hope anyone who sees the code can get an idea of how to
build their own from scratch.

### TODO

- <s>Switch from Apache to nginx</s>
- <s>Switch from nginx to node.js</s>
- <s>Create custom grammar for writing posts</s>
- Write a web GUI for writing posts
- <s>Setup SSL</s>
- <s>Make custom error pages</s>
- <s>Use lower resolution images on pages</s>
- <s>Setup media queries for RWD</s>
- <s>Create dynamic blog page</s>
- <s>Move all media (images, video, audio) out of repo into single media folder</s>
- <s>Fix gallery RWD bug with photo galleries.</s>
