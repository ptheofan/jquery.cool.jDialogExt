/**
 * jDialog extention
 *
 * 1. jDialog will reposition itself when user scrolls over the page
 *
 * 2. Change the contents of the dialog easily
 * $(selector).dialog('content', newContent) will replace current contents with
 * the new contents
 *
 * 3. Display a loading spinner easily
 * $(selector).dialog('loading');
 *
 * 4. Populate the dialog via ajax easily
 * $(selector).dialog('ajax', ajaxArgs);
 *
 * 5. options.doNotFollowWindow
 * Setting this to true will result in the dialog not following the window when it resizes/scrolls
 *
 * FYI: Setting width/height to auto when creating the jDialog will automatically
 * handle dialog resize as per CSS standards
 *
 * @author Paris Theofanidis (ptheofan@gmail.com)
 * https://github.com/ptheofan/jDialog-Extention
 */
$.fn.extend($.ui.dialog.prototype, {
    _parentInit: $.ui.dialog.prototype._init,

    uiDialogExtClasses: {
        spinner: 'ui-dialog-spinner'
    },

    /**
     * Constructor
     */
    _init: function() {
        this._parentInit();
        
        // Replace jDialog position.using function with our own
        // FIX: 'Causes trouble to prerendered jDialogs from Yii
	this.options.position.using = this.repositionDlg()

        this.element.bind('DOMSubtreeModified', $(this.uiDialog), this.repositionDlg);

	if(typeof(this.options.doNotFollowWindow) === 'undefined' || this.options.doNotFollowWindow === false) {	
        	$(window).scroll($(this.uiDialog), this.repositionDlg);
        	$(window).resize($(this.uiDialog), this.repositionDlg);
	}

        if (typeof(this.options.spinnerOnAjax) == 'undefined') this.options.spinnerOnAjax = true;
    },

    /**
     * Position the dialog on screen
     * Callback function for a few events -- see _init function for details
     */
    repositionDlg: function(evt) {
        // Get a reference to the dialog div (ui-dialog)
        var dlg = evt.data ? evt.data : this.uiDialog;

        // Compute top/left coords of the dialog
        var top = (($(window).height() - dlg.height()) / 2) + $(window).scrollTop();
        var left = (($(window).width() - dlg.width()) / 2) + $(window).scrollLeft();

        // Ensure our dialog never gets out of user viewport
        if (top < 0) top = 0;
        if (left < 0) left = 0;

        // Terminate any dialog related animation
        $(dlg).clearQueue();

        // Reposition the dialog
        if (evt.originalEvent.type === 'scroll' || evt.originalEvent.type === 'resize') {
            // Animate ONLY if dialog is smaller than the viewport - otherwise user needs to scroll to have access
            // over the entire dialog ;)
            if (dlg.width() < $(window).width() && dlg.height() < $(window).height()) {
                $(dlg).animate({
                    'top': top,
                    'left': left
                }, 200);
            }
        } else {
            // If contents changed reposition instantly - handy for dialog position reset (critical for dialog flow)
            // If dialog height is greater than viewport height then top = 0
            if (dlg.height() > $(window).height()) top = 0;

            // If dialog width is greater than viewport width the left = 0
            if (dlg.width() > $(window).width()) left = 0;

            // Apply computed left/top
            dlg.css({
                'top': top + 'px',
                'left': left + 'px'
            });
        }
    },


    /**
     * Modify the contents of jDialog post initialization
     * how to:
     *  $(htmlEntityUsedtoCreateThedialog).dialog('content', htmlOrJQueryObject)
     */
    content: function(content) {
        // Replace current content (dialog.element.html) with new content
        $(this.element).html(content);

        // Update the dialog title -- if applicable
        var title = $(content).attr('title');
        if (typeof title !== 'undefined' && title !== false) this.uiDialogTitlebar.children('.ui-dialog-title').html(title);

        var w = $(content).innerWidth();
        var h = $(content).innerHeight();

        if(w < this.options.minWidth) w = this.options.minWidth - $(this.element).css('padding');
        if(h < this.options.minHeight) h = this.options.minHeight;
        $(this.element).css({
            'min-width': w + 'px',
            'min-height': h + 'px'
        });
    },

    /**
     * Modify the title of the jDialog post initialization
     * how to:
     *  $(htmlEntityUsedtoCreateThedialog).dialog('title', htmlOrJQueryObject)
     */
    title: function(title) {
        $(this.uiDialogTitlebar).children('.ui-dialog-title').html(title);
    },


    /**
     * Place a loading overlay over the dialog
     * opts: {
     *  spinnerClass: 'ui-dialog-spinner',
     *  title: 'Loading...'
     * }
     *
     * Info:
     * Will create two divs absolutely positioned over the
     * contents of the dialog.
     */
    loading: function(opts) {
        var l = $(this.element).css('padding-left');
        var t = $(this.element).css('padding-top');
        var w = $(this.element).innerWidth();
        var h = $(this.element).innerHeight();
        
        if(w < this.options.minWidth) w = this.options.minWidth;
        if(w < this.options.width) w = this.options.width;
        if(h < this.options.minWidth) h = this.options.minHeight;
        if(h < this.options.width) h = this.options.height;

        opts = $.extend({}, {title: 'Loading', spinnerClass: this.uiDialogExtClasses.spinner}, opts);

        if (this.options.spinnerOnAjax) {
            var spinner = $("<div title='Loading...'><div class='" + opts.spinnerClass + "' style='min-width: " + w + "px; min-height: " + h + "px;'></div></div>");
            $(this.element).dialog('content', spinner);
        }
    },


    /**
     * Fetch the contents of the dialog via ajax
     * ajaxArgs are the very same arguments you would use on $.ajax.
     * Actually I call $.ajax(ajaxArgs)
     */
    ajax: function(ajaxArgs) {
        var content = $(this.element)

        content.dialog('loading');

        var origSuccess = ajaxArgs.success ? ajaxArgs.success : null;
        var origError = ajaxArgs.error ? ajaxArgs.error : null;

        // Register our own function for success - we call user supplied function in the end
        ajaxArgs.success = function(r) {
            try{
                $.parseJSON(r);
            } catch (ex) {
                // Not json, just set it as html ;)
                content.dialog('content', r);
            }
            if(origSuccess)
                origSuccess(r);
        }

        // Register our own function for error - we call user supplied function in the end
        ajaxArgs.error = function(r) {
            try{
                if(typeof(r) == 'object') {
                    content.dialog('content', r.responseText);
                } else {
                    var json = $.parseJSON(r);
                    content.dialog('content', json.responseText);
                }
            } catch (ex) {
                if(typeof(r) !== object)
                    content.dialog('content', r);
            }
            if(origError)
                origError(r);
        }

        $.ajax(ajaxArgs);
    }
});