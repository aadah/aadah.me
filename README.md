# [aadah.me](http://aadah.me/)

This is my blog.

### Design

The design for the blog looked into some considerations.
Dynamic pages were unnecessary, so a static file serving
paradigm was best. All content on one page, with new
content loading with bloated AJAX requests, was unwanted.
The site should present material simply with each page
being a standalone entity.

The default theme is a dim one, white text on dark grey.
There is a way to toggle the theme for lighter/darker
ambiance. The minimalism was ultimately appealing.

Galleries expand their displayed images for better viewing
instead of revealing a new frame that obscures the view of
the page.

It should be possible to write an academic piece of work
in a presentable manner. Displaying code and LaTeX was
thus very important. Printing modifies the CSS to format
it for a physical medium.

### How It's Built

Along with the standard HTML/CSS/JS, the site uses:

* [Google's code syntax highligther](https://code.google.com/p/google-code-prettify/) for coloring code
    directly inserted into the page.
* [MathJax](http://www.mathjax.org/) for writing LaTeX code in HTML files.
* An [nginx](http://nginx.org/) server for handling routing and the
    serving of static files. (The config file is not included
    in the repo.)
* A proxied [Node.js](http://nodejs.org/) for server-side operations like
    logging unique users and views, using Express and
    MongoDB modules.
* [MongoDB](http://www.mongodb.org/) for database storage.

### License

The blog is under the [GPLv3 license](https://www.gnu.org/copyleft/gpl.html).

### TODO

* ~~Switch from Apache to nginx~~
* Write a GUI for writing posts with JavaFX
* ~~Make custom error pages~~
* Setup an email server
* Port to mobile (?)