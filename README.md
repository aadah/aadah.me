# [aadah.me](https://aadah.me/)

Resources for hosting my site.

## Design

I had some desirable features when I was making the site:

- Minimal design. Text is principal.
- Any page could be printed legibly.
- Posts could be written in plain text but I could extend the syntax to enable extra display elements as desired.
- I could embed math and code easily.
- Media elements (video/audio/images) are simple to display.
- With respect to images, a way to display a gallery without taking too much space.

## Details

The site uses:

- [Node.js](http://nodejs.org/) as the server.
- [MongoDB](https://www.mongodb.com/) for backend storage.
  - Uses MongoDB's [images](https://hub.docker.com/_/mongo/) with external volume for persistent storage.
- [PEG.js](pegjs.org/) for designing custom blog syntax and parsing to HTML.
- [Google's code syntax highligther](https://code.google.com/p/google-code-prettify/) for code.
- [MathJax](http://www.mathjax.org/) for LaTeX.
- Fonts from [Google Fonts](https://fonts.google.com).
	- [Spectral](https://fonts.google.com/specimen/Spectral) as primary font.
	- [Inconsolata](http://levien.com/type/myfonts/inconsolata.html) for code.
