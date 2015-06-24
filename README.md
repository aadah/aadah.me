# [aadah.me](http://aadah.me/)

Welcome to my blog.

### Design

The design for the blog looked into some considerations.
Dynamic pages were unnecessary, so a static file serving
paradigm was best. All content on one page, with new
content loading with bloated AJAX requests, was unwanted.
The site should present material simply with each page
being a standalone entity.

The default theme is a dim one, white text on dark grey.
There is a way to toggle the theme for lighter/darker
ambiance. The minimalism was ultimately appealing. Despite
the simple look, it is meticulously crafted.

Galleries expand their displayed images for better viewing
instead of revealing a new frame that obscures the view of
the page.

It should be possible to write an academic piece of work
in a presentable manner. Displaying code and LaTeX was
thus very important. Printing modifies the CSS to format
it for a physical medium.

### How It's Built

Along with the standard HTML/CSS/JS, the site uses:

- [Node.js](http://nodejs.org/) as the server.
- [Google's code syntax highligther](https://code.google.com/p/google-code-prettify/)
	for coloring code on the page.
- [MathJax](http://www.mathjax.org/) for writing LaTeX code in HTML files.
- [MongoDB](http://www.mongodb.org/) for database storage.
- Fonts from [Google Fonts](https://www.google.com/fonts). I use
	[Tinos](https://www.google.com/fonts/specimen/Tinos) (serif) as my primary font and
	[Inconsolata](http://levien.com/type/myfonts/inconsolata.html)
	(monospace) for code snippets.

### License

The blog is under the [GNU GPL v3.0 license](https://www.gnu.org/copyleft/gpl.html).

### TODO

- <s>Switch from Apache to nginx</s>
- <s>Switch from nginx to node.js</s>
- Create custom grammar for writing posts
- Write a GUI for writing posts (in HTML/CSS/JS)
- <s>Make custom error pages</s>
- <s>Use lower resolution images on pages</s>
- Setup an email server
- <s>Setup media queries for RWD</s>
- Create dynamic blog page
- <s>Move all media (images, video, audio) out of repo into single media folder</s>
- Fix gallery RWD bug with photo galleries.
