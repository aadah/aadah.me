var express = require('express')
var models = require('../utils/models')
var publisher = require('../utils/publisher')
var parser = require('../utils/parser')
var fs = require('fs')
var path = require('path')

var router = express.Router()

var DRAFTS_DIR = path.join(__dirname, '../manuscripts/blog/drafts')
var PUBLISHED_DIR = path.join(__dirname, '../manuscripts/blog')
var TEMPLATE_PATH = path.join(__dirname, '../grammars/new.txt')

// Edit routes for drafts and published posts
router.get('/new', function (req, res, next) {
  res.status(200).render('blog/edit-new')
})

router.post('/new', function (req, res, next) {
  const postId = req.body.postId

  if (!postId) {
    return res.status(400).json({ error: 'Post ID is required' })
  }

  // Validate postId (basic sanitization)
  if (!/^[a-zA-Z0-9-_]+$/.test(postId)) {
    return res.status(400).json({ error: 'Post ID can only contain letters, numbers, hyphens, and underscores' })
  }

  const draftPath = path.join(DRAFTS_DIR, `${postId}.txt`)

  // Check if draft file already exists
  fs.access(draftPath, fs.constants.F_OK, function (err) {
    if (!err) {
      // Draft file exists
      return res.status(409).json({ error: 'A draft with this ID already exists' })
    }

    // Check if post already exists in database (published)
    models.Post.findById(postId, function (err, existingPost) {
      if (err) {
        return res.status(500).json({ error: 'Failed to check existing posts' })
      }

      if (existingPost) {
        return res.status(409).json({ error: 'A published post with this ID already exists' })
      }

      // Copy template file to new draft
      fs.copyFile(TEMPLATE_PATH, draftPath, function (err) {
        if (err) {
          res.status(500).json({ error: 'Failed to create draft file' })
        } else {
          res.status(200).json({ success: true, postId: postId, message: 'Draft created successfully' })
        }
      })
    })
  })
})

router.get('/', function (req, res, next) {
  // Get drafts from file system
  fs.readdir(DRAFTS_DIR, function (err, files) {
    if (err) {
      res.status(500).render('error/500')
      return
    }

    const drafts = files
      .filter(file => file.endsWith('.txt'))
      .map(file => ({
        id: file.replace('.txt', ''),
        filename: file,
        type: 'draft'
      }))

    // Get published posts from database
    models.Post.find({})
      .select('_id title subtitle author posted updated public')
      .sort({ updated: 'desc' })
      .exec(function (err, publishedPosts) {
        if (err) {
          res.status(500).render('error/500')
        } else {
          const published = publishedPosts.map(post => ({
            id: post._id,
            title: post.title,
            subtitle: post.subtitle,
            author: post.author,
            posted: post.posted,
            updated: post.updated,
            public: post.public,
            type: 'published'
          }))

          res.locals.createBlogPost = (post => parser.web.createBlogPost(post))
          res.status(200).render('blog/edit', {
            drafts: drafts,
            published: published
          })
        }
      })
  })
})

router.get('/:postId', function (req, res, next) {
  const postId = req.params.postId
  const draftPath = path.join(DRAFTS_DIR, `${postId}.txt`)
  const publishedPath = path.join(PUBLISHED_DIR, `${postId}.txt`)

  // First try to read from drafts folder
  fs.readFile(draftPath, 'utf8', function (err, draftContent) {
    if (!err) {
      // Found in drafts - this is a draft post
      res.status(200).render('blog/edit-post', {
        postId: postId,
        content: draftContent,
        isDraft: true
      })
    } else {
      // Not in drafts, try published folder
      fs.readFile(publishedPath, 'utf8', function (err, publishedContent) {
        if (!err) {
          // Found in published - this is a published post
          res.status(200).render('blog/edit-post', {
            postId: postId,
            content: publishedContent,
            isDraft: false
          })
        } else {
          // Not found in either location
          res.status(404).render('error/404')
        }
      })
    }
  })
})

router.post('/:postId/draft/save', function (req, res, next) {
  const postId = req.params.postId
  const draftPath = path.join(DRAFTS_DIR, `${postId}.txt`)
  const content = req.body.content || ''

  fs.writeFile(draftPath, content, 'utf8', function (err) {
    if (err) {
      res.status(500).json({ error: 'Failed to save file' })
    } else {
      res.status(200).json({ success: true, message: 'Draft saved successfully' })
    }
  })
})

router.post('/:postId/draft/publish', function (req, res, next) {
  const postId = req.params.postId
  const draftPath = path.join(DRAFTS_DIR, `${postId}.txt`)
  const publishedPath = path.join(PUBLISHED_DIR, `${postId}.txt`)
  const content = req.body.content || ''

  // First save the current content to the draft
  fs.writeFile(draftPath, content, 'utf8', function (err) {
    if (err) {
      res.status(500).json({ error: 'Failed to save draft before publishing' })
      return
    }

    // Read the draft content
    fs.readFile(draftPath, 'utf8', function (err, manuscript) {
      if (err) {
        res.status(500).json({ error: 'Failed to read draft file' })
        return
      }

      // Move file to published location
      fs.rename(draftPath, publishedPath, function (err) {
        if (err) {
          res.status(500).json({ error: 'Failed to move file to published location' })
          return
        }

        // Call publisher.publish to create/update database entry
        publisher.publish(postId, function (err, result) {
          if (err) {
            // If publish fails, try to move file back to drafts
            fs.rename(publishedPath, draftPath, function () {
              res.status(500).json({ error: 'Failed to publish to database: ' + err.message })
            })
          } else {
            res.status(200).json({ success: true, message: 'Post published successfully' })
          }
        }, manuscript)
      })
    })
  })
})

// Routes for published post management
router.post('/:postId/save', function (req, res, next) {
  const postId = req.params.postId
  const publishedPath = path.join(PUBLISHED_DIR, `${postId}.txt`)
  const content = req.body.content || ''

  // Save content to published file
  fs.writeFile(publishedPath, content, 'utf8', function (err) {
    if (err) {
      res.status(500).json({ error: 'Failed to save file' })
      return
    }

    // Update database entry
    publisher.save(postId, function (err, result) {
      if (err) {
        res.status(500).json({ error: 'Failed to save to database: ' + err.message })
      } else {
        res.status(200).json({ success: true, message: 'Post saved successfully' })
      }
    }, content)
  })
})

router.post('/:postId/tweak', function (req, res, next) {
  const postId = req.params.postId
  const publishedPath = path.join(PUBLISHED_DIR, `${postId}.txt`)
  const content = req.body.content || ''

  // Save content to published file
  fs.writeFile(publishedPath, content, 'utf8', function (err) {
    if (err) {
      res.status(500).json({ error: 'Failed to save file' })
      return
    }

    // Update database entry without changing timestamp
    publisher.tweak(postId, function (err, result) {
      if (err) {
        res.status(500).json({ error: 'Failed to tweak post in database: ' + err.message })
      } else {
        res.status(200).json({ success: true, message: 'Post tweaked successfully' })
      }
    }, content)
  })
})

router.post('/:postId/reveal', function (req, res, next) {
  const postId = req.params.postId

  publisher.reveal(postId, function (err, result) {
    if (err) {
      res.status(500).json({ error: 'Failed to reveal post: ' + err.message })
    } else {
      res.status(200).json({ success: true, message: 'Post revealed successfully' })
    }
  })
})

router.post('/:postId/hide', function (req, res, next) {
  const postId = req.params.postId

  publisher.hide(postId, function (err, result) {
    if (err) {
      res.status(500).json({ error: 'Failed to hide post: ' + err.message })
    } else {
      res.status(200).json({ success: true, message: 'Post hidden successfully' })
    }
  })
})

router.post('/:postId/delete', function (req, res, next) {
  const postId = req.params.postId
  const publishedPath = path.join(PUBLISHED_DIR, `${postId}.txt`)
  const draftPath = path.join(DRAFTS_DIR, `${postId}.txt`)

  // First move file safely back to drafts
  fs.rename(publishedPath, draftPath, function (err) {
    if (err) {
      res.status(500).json({ error: 'Failed to move file to drafts: ' + err.message })
      return
    }

    // Then delete from database
    publisher.delete(postId, function (err, result) {
      if (err) {
        // If database deletion fails, try to move file back to published
        fs.rename(draftPath, publishedPath, function () {
          res.status(500).json({ error: 'Failed to delete post from database: ' + err.message })
        })
      } else {
        res.status(200).json({ success: true, message: 'Post deleted successfully and moved back to drafts' })
      }
    })
  })
})

router.post('/:postId/rename', function (req, res, next) {
  const currentPostId = req.params.postId
  const newPostId = req.body.newPostId

  if (!newPostId) {
    return res.status(400).json({ error: 'New post ID is required' })
  }

  // Validate newPostId (basic sanitization)
  if (!/^[a-zA-Z0-9-_]+$/.test(newPostId)) {
    return res.status(400).json({ error: 'Post ID can only contain letters, numbers, hyphens, and underscores' })
  }

  // Only allow renaming of drafts
  const currentDraftPath = path.join(DRAFTS_DIR, `${currentPostId}.txt`)
  const newDraftPath = path.join(DRAFTS_DIR, `${newPostId}.txt`)

  // Check if current draft exists
  fs.access(currentDraftPath, fs.constants.F_OK, function (err) {
    if (err) {
      return res.status(404).json({ error: 'Draft not found' })
    }

    // Check if new draft name already exists
    fs.access(newDraftPath, fs.constants.F_OK, function (err) {
      if (!err) {
        return res.status(409).json({ error: 'A draft with this ID already exists' })
      }

      // Check if published post with new ID exists
      models.Post.findById(newPostId, function (err, existingPost) {
        if (err) {
          return res.status(500).json({ error: 'Failed to check existing posts' })
        }

        if (existingPost) {
          return res.status(409).json({ error: 'A published post with this ID already exists' })
        }

        // Rename the file
        fs.rename(currentDraftPath, newDraftPath, function (err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to rename draft file' })
          }

          res.status(200).json({ 
            success: true, 
            message: 'Draft renamed successfully',
            newPostId: newPostId 
          })
        })
      })
    })
  })
})

router.post('/:postId/draft/delete', function (req, res, next) {
  const postId = req.params.postId
  const draftPath = path.join(DRAFTS_DIR, `${postId}.txt`)

  // Check if draft exists
  fs.access(draftPath, fs.constants.F_OK, function (err) {
    if (err) {
      return res.status(404).json({ error: 'Draft not found' })
    }

    // Delete the draft file
    fs.unlink(draftPath, function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to delete draft file' })
      }

      res.status(200).json({ 
        success: true, 
        message: 'Draft deleted successfully'
      })
    })
  })
})

router.post('/:postId/preview', function (req, res, next) {
  const content = req.body.content || ''
  const postId = req.params.postId

  try {
    const mockPost = {
      title: postId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      posted: new Date(),
      updated: new Date()
    }
    const path = `/blog/edit/${postId}/preview`
    const result = parser.web.parse(path, content, mockPost)
    res.status(200).json({ html: result.html })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Failed to parse content', details: err.message })
  }
})

router.get('/:postId/preview', function (req, res, next) {
  const postId = req.params.postId
  const draftPath = path.join(DRAFTS_DIR, `${postId}.txt`)
  const publishedPath = path.join(PUBLISHED_DIR, `${postId}.txt`)

  // First try to read from drafts folder
  fs.readFile(draftPath, 'utf8', function (err, draftContent) {
    let content = ''

    if (!err) {
      content = draftContent
      renderPreview()
    } else {
      // Not in drafts, try published folder
      fs.readFile(publishedPath, 'utf8', function (err, publishedContent) {
        if (!err) {
          content = publishedContent
        }
        renderPreview()
      })
    }

    function renderPreview() {
      try {
        const mockPost = {
          title: postId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          posted: new Date(),
          updated: new Date()
        }
        const path = `/blog/edit/${postId}/preview`
        const result = parser.web.parse(path, content, mockPost)
        res.status(200).type('text/html').send(result.html)
      } catch (err) {
        console.log(err)
        res.status(500).send(`<html><body style="color: red; padding: 1em;"><strong>Preview Error:</strong><br>${err.message}</body></html>`)
      }
    }
  })
})

module.exports = router
