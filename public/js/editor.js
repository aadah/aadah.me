var previewTimeout;
var hasPreviewError = false;

// Handle new post form submission
function handleNewPostSubmit(e) {
	e.preventDefault();

	var postId = $('#postId').val().trim();

	if (!postId) {
		showStatus('Please enter a post ID', 'error');
		return;
	}

	// Client-side validation
	if (!/^[a-zA-Z0-9-_]+$/.test(postId)) {
		showStatus('Post ID can only contain letters, numbers, hyphens, and underscores', 'error');
		return;
	}

	$('#create-btn').prop('disabled', true).text('Creating...');

	$.ajax({
		url: '/blog/edit/new',
		method: 'POST',
		data: { postId: postId },
		success: function (response) {
			showStatus('Post created successfully! Redirecting to editor...', 'success');
			setTimeout(function () {
				window.location.href = '/blog/edit/' + postId;
			}, 1500);
		},
		error: function (xhr) {
			var message = 'Failed to create post';
			if (xhr.responseJSON && xhr.responseJSON.error) {
				message = xhr.responseJSON.error;
			}
			showStatus(message, 'error');
			$('#create-btn').prop('disabled', false).text('Create');
		}
	});
}

// Handle post ID input formatting
function handlePostIdInput() {
	var value = $(this).val();
	// Convert to lowercase and replace spaces with hyphens
	var formatted = value.toLowerCase().replace(/\s+/g, '-');
	// Remove any invalid characters
	formatted = formatted.replace(/[^a-z0-9-_]/g, '');
	$(this).val(formatted);
}

// Helper function to ensure content ends with newline
function ensureNewlineEnding(content) {
	if (content && !content.endsWith('\n')) {
		return content + '\n';
	}
	return content;
}

// Monitor iframe load to check for preview errors
function handlePreviewLoad() {
	try {
		var iframe = this;
		var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
		var body = iframeDoc.body;

		// Check if the preview shows an error
		if (body && body.innerHTML.includes('Preview Error:')) {
			hasPreviewError = true;
			updatePublishButton();
		} else {
			hasPreviewError = false;
			updatePublishButton();
		}
	} catch (e) {
		// Cross-origin or other iframe access issues
		// Assume no error in this case
		hasPreviewError = false;
		updatePublishButton();
	}
}

function updatePublishButton() {
	var publishBtn = $('#publish-btn');
	if (publishBtn.length > 0) {
		if (hasPreviewError) {
			publishBtn.prop('disabled', true);
			publishBtn.attr('title', 'Cannot publish: Preview has errors. Fix content and try again.');
			publishBtn.css('opacity', '0.5');
		} else {
			publishBtn.prop('disabled', false);
			publishBtn.removeAttr('title');
			publishBtn.css('opacity', '1');
		}
	}
}

// Mobile view toggle functionality
function handleEditorToggle() {
	if (!$(this).hasClass('active')) {
		$(this).addClass('active');
		$('#preview-toggle').removeClass('active');
		$('.editor-pane').removeClass('hidden');
		$('.preview-pane').removeClass('active');
	}
}

function handlePreviewToggle() {
	if (!$(this).hasClass('active')) {
		$(this).addClass('active');
		$('#editor-toggle').removeClass('active');
		$('.editor-pane').addClass('hidden');
		$('.preview-pane').addClass('active');
		// Refresh preview when switching to it
		$('#preview-iframe')[0].contentWindow.location.reload();
	}
}

// Save button handler
function handleSave(postId, isDraft) {
	var content = ensureNewlineEnding($('#content').val());
	var saveUrl = `/blog/edit/${postId}${isDraft ? '/draft' : ''}/save`;

	$.ajax({
		url: saveUrl,
		method: 'POST',
		data: { content: content },
		success: function (response) {
			var message = isDraft ? 'Draft saved successfully!' : 'Post saved successfully!';
			showStatus(message, 'success');
		},
		error: function (xhr) {
			var message = isDraft ? 'Failed to save draft' : 'Failed to save post';
			if (xhr.responseJSON && xhr.responseJSON.error) {
				message = xhr.responseJSON.error;
			}
			showStatus(message, 'error');
		}
	});
}

// Publisher action handlers
function handleTweak(postId) {
	var content = ensureNewlineEnding($('#content').val());

	$.ajax({
		url: '/blog/edit/' + postId + '/tweak',
		method: 'POST',
		data: { content: content },
		success: function (response) {
			showStatus('Post tweaked successfully!', 'success');
			$('#preview-iframe')[0].contentWindow.location.reload();
		},
		error: function (xhr) {
			var message = 'Failed to tweak post';
			if (xhr.responseJSON && xhr.responseJSON.error) {
				message = xhr.responseJSON.error;
			}
			showStatus(message, 'error');
		}
	});
}

function handlePublish(postId) {
	// Check if button is disabled due to preview errors
	if ($(this).prop('disabled')) {
		showStatus('Cannot publish: Preview has errors. Fix your content and try again.', 'error');
		return;
	}

	var content = ensureNewlineEnding($('#content').val());

	if (confirm('Are you sure you want to publish this post? This will make it live on the site.')) {
		$.ajax({
			url: '/blog/edit/' + postId + '/draft/publish',
			method: 'POST',
			data: { content: content },
			success: function (response) {
				showStatus('Post published successfully! Redirecting...', 'success');
				// Redirect to the published post editor after 2 seconds
				setTimeout(function () {
					window.location.href = '/blog/edit/' + postId;
				}, 2000);
			},
			error: function (xhr) {
				var message = 'Failed to publish post';
				if (xhr.responseJSON && xhr.responseJSON.error) {
					message = xhr.responseJSON.error;
				}
				showStatus(message, 'error');
			}
		});
	}
}

function handleReveal(postId) {
	if (confirm('Are you sure you want to make this post visible on the blog?')) {
		$.ajax({
			url: '/blog/edit/' + postId + '/reveal',
			method: 'POST',
			success: function (response) {
				showStatus('Post revealed successfully!', 'success');
			},
			error: function (xhr) {
				var message = 'Failed to reveal post';
				if (xhr.responseJSON && xhr.responseJSON.error) {
					message = xhr.responseJSON.error;
				}
				showStatus(message, 'error');
			}
		});
	}
}

function handleHide(postId) {
	if (confirm('Are you sure you want to hide this post from the blog?')) {
		$.ajax({
			url: '/blog/edit/' + postId + '/hide',
			method: 'POST',
			success: function (response) {
				showStatus('Post hidden successfully!', 'success');
			},
			error: function (xhr) {
				var message = 'Failed to hide post';
				if (xhr.responseJSON && xhr.responseJSON.error) {
					message = xhr.responseJSON.error;
				}
				showStatus(message, 'error');
			}
		});
	}
}

function handleDelete(postId) {
	if (confirm('Are you sure you want to delete this post from the blog? It will be unpublished and moved back to drafts.')) {
		$.ajax({
			url: '/blog/edit/' + postId + '/delete',
			method: 'POST',
			success: function (response) {
				showStatus('Post deleted successfully and moved to drafts! Redirecting...', 'success');
				// Redirect to the draft editor after 2 seconds
				setTimeout(function () {
					window.location.href = '/blog/edit/' + postId;
				}, 2000);
			},
			error: function (xhr) {
				var message = 'Failed to delete post';
				if (xhr.responseJSON && xhr.responseJSON.error) {
					message = xhr.responseJSON.error;
				}
				showStatus(message, 'error');
			}
		});
	}
}

function handleRename(postId) {
	var currentPostId = postId;
	var newPostId = prompt('Enter new post ID (letters, numbers, hyphens, and underscores only):');

	if (newPostId === null) {
		// User cancelled
		return;
	}

	if (!newPostId || !newPostId.trim()) {
		showStatus('New post ID cannot be empty', 'error');
		return;
	}

	newPostId = newPostId.trim();

	// Basic validation
	if (!/^[a-zA-Z0-9-_]+$/.test(newPostId)) {
		showStatus('Post ID can only contain letters, numbers, hyphens, and underscores', 'error');
		return;
	}

	if (newPostId === currentPostId) {
		showStatus('New post ID must be different from current ID', 'error');
		return;
	}

	if (confirm('Are you sure you want to rename this draft to "' + newPostId + '"?')) {
		$.ajax({
			url: '/blog/edit/' + currentPostId + '/rename',
			method: 'POST',
			data: { newPostId: newPostId },
			success: function (response) {
				showStatus('Draft renamed successfully! Redirecting...', 'success');
				// Redirect to the new post ID after 2 seconds
				setTimeout(function () {
					window.location.href = '/blog/edit/' + response.newPostId;
				}, 2000);
			},
			error: function (xhr) {
				var message = 'Failed to rename draft';
				if (xhr.responseJSON && xhr.responseJSON.error) {
					message = xhr.responseJSON.error;
				}
				showStatus(message, 'error');
			}
		});
	}
}

function handleDeleteDraft(postId) {
	if (confirm('Are you sure you want to permanently delete this draft? This action cannot be undone.')) {
		$.ajax({
			url: '/blog/edit/' + postId + '/draft/delete',
			method: 'POST',
			success: function (response) {
				showStatus('Draft deleted successfully! Redirecting...', 'success');
				// Redirect to the edit index after 2 seconds
				setTimeout(function () {
					window.location.href = '/blog/edit/';
				}, 2000);
			},
			error: function (xhr) {
				var message = 'Failed to delete draft';
				if (xhr.responseJSON && xhr.responseJSON.error) {
					message = xhr.responseJSON.error;
				}
				showStatus(message, 'error');
			}
		});
	}
}

// Auto-save handler for drafts
function initializeAutoSave(postId) {
	setInterval(function () {
		var content = ensureNewlineEnding($('#content').val());

		$.ajax({
			url: '/blog/edit/' + postId + '/draft/save',
			method: 'POST',
			data: { content: content },
			success: function () {
				// Silent auto-save
			}
		});
	}, 30000);
}

// Keyboard shortcut handler for drafts
function handleKeyboardShortcut(postId) {
	return function(e) {
		if ((e.ctrlKey || e.metaKey) && e.which === 83) {
			e.preventDefault();
			var content = ensureNewlineEnding($('#content').val());

			$.ajax({
				url: '/blog/edit/' + postId + '/draft/save',
				method: 'POST',
				data: { content: content },
				success: function (response) {
					showStatus('Draft saved successfully!', 'success');
					// Refresh the iframe to show updated content
					$('#preview-iframe')[0].contentWindow.location.reload();
				},
				error: function (xhr) {
					var message = 'Failed to save draft';
					if (xhr.responseJSON && xhr.responseJSON.error) {
						message = xhr.responseJSON.error;
					}
					showStatus(message, 'error');
				}
			});
		}
	};
}

// Show status message
function showStatus(message, type) {
	var statusEl = $('#status-message');
	statusEl.removeClass('status-success status-error');
	statusEl.addClass('status-' + type);
	statusEl.text(message);
	statusEl.show();

	if (type === 'error') {
		setTimeout(function () {
			statusEl.fadeOut();
		}, 5000);
	} else {
		setTimeout(function () {
			statusEl.fadeOut();
		}, 3000);
	}
}