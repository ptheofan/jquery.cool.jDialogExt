/**
 * jDialog extention
 * 
 * 1. jDialog will reposition itself when user scrolls over the page
 * 
 * 2. Change the contents of the dialog easily
 * $(selector).dialog('setContents', newContent) will replace current contents with
 * the new contents
 * 
 * 3. Display a loading spinner easily
 * $(selector).dialog('loading', {overlayClass: 'someClass', spinnerClass: 'someClass});
 * 
 * FYI: Setting width/height to auto when creating the jDialog will automatically
 * handle dialog resize as per CSS standards
 * 
 * @author Paris Theofanidis (ptheofan@gmail.com)
 */
$.fn.extend($.ui.dialog.prototype, {
    _parentInit: $.ui.dialog.prototype._init,
    
    _init: function() {
        this._parentInit();
        this.element.bind('DOMSubtreeModified', $(this.uiDialog), this._repositionDlg);
        $(window).scroll($(this.uiDialog), this._repositionDlg);
        $(window).resize($(this.uiDialog), this._repositionDlg);
    },
    
    
    /**
     * Adjust the dialogs position
     * This is the function we register with DOMSubtreeModified, window.scroll
     * and window.resize.
     * 
     * This function is not meant to be used from the outside
     */
    _repositionDlg: function(evt) {
        // Get a reference to the dialog div (ui-dialog)
        var dlg = evt.data;

        // Compute top/left coords of the dialog
        var top = (($(window).height() - dlg.height()) / 2) + $(window).scrollTop();
        var left = (($(window).width() - dlg.width()) / 2) + $(window).scrollLeft();
        
        // Ensure our dialog never gets out of user viewport
        if(top < 0) top = 0;
        if(left < 0) left = 0;

        // Terminate any dialog related animation
        $(dlg).clearQueue();
        
        // Reposition the dialog
        if(evt.originalEvent.type === 'scroll' || evt.originalEvent.type === 'resize') {
            // Animate ONLY if dialog is smaller than the viewport - otherwise user needs to scroll to have access
            // over the entire dialog ;)
            if(dlg.width() < $(window).width() && dlg.height() < $(window).height()) {
                $(dlg).animate({
                    'top': top,
                    'left': left
                }, 200);
            }
        } else {
            // If contents changed reposition instantly - handy for dialog position reset (critical for dialog flow)
            
            // If dialog height is greater than viewport height then top = 0
            if(dlg.height() > $(window).height()) top = 0;
            
            // If dialog width is greater than viewport width the left = 0
            if(dlg.width() > $(window).width()) left = 0;
            
            // Apply computed left/top
            dlg.css({'top': top + 'px', 'left': left + 'px'});
        }
    },


    /**
     * Modify the contents of jDialog post initialization
     * how to:
     *  $(htmlEntityUsedtoCreateThedialog).dialog('setContent', htmlOrJQueryObject)
     */
    setContent: function(content) {
        // Replace current content (dialog.element.html) with new content
        $(this.element).html(content);
        
        // Update the dialog title -- if applicable
        var title = $(content).attr('title');
        if (typeof title !== 'undefined' && title !== false)
            this.uiDialogTitlebar.children('.ui-dialog-title').html(title);
        
        
        // Unfortunatelly _setSize nor dialog('resize') will properly set
        // min-width. Thus we do it manually. A little TODO here is that
        // in jDialog minWidth/minHeight specify outter size (uiDialog).
        // Apply correction to set minWidth/minHeight of dialog.element
        // to the remaining size so outter size is correct. At the moment
        // we set content to minWidth/minHeight
        var w = $(content).width();
        var h = $(content).height();
        
        if(w < this.options.minWidth) w = this.options.minWidth;
        if(h < this.options.minHeight) h = this.options.minHeight;
        
        this.element.css({'min-width': w+'px', 'min-height': h+'px'});
    },


    /**
     * Place a loading overlay over the dialog
     * options.overlayClass
     * options.spinnerClass
     * 
     * Info:
     * Will create two divs absolutely positioned over the
     * contents of the dialog and over the current contents.
     * 
     * Ideally you could also use block (ui plugin) but
     * let's not add dependencies - overlay is simple enough
     */
    loading: function(options) {
        var l = $(this.element).css('padding-left');
        var t = $(this.element).css('padding-top');
        var w = $(this.element).width();
        var h = $(this.element).height();

        
        var overlay = $("<div class='ui-dialog-overlay' style='position: absolute; width: "+w+"px; height: "+h+"px; left: "+l+"; top: "+t+"; z-index: 1002'></div>");
        var spinner = $("<div class='ui-dialog-spinner' style='position: absolute; width: "+w+"px; height: "+h+"px; left: "+l+"; top: "+t+"; z-index: 1003'></div>");

        if(options.overlayClass)
            overlay.addClass(options.overlayClass);
        
        if(options.spinnerClass)
            spinner.addClass(options.spinnerClass);
        
        this.element.append(overlay);
        this.element.append(spinner);
    }
});