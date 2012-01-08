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
        this.element.bind('DOMSubtreeModified', $(this.uiDialog), this.repositionDlg);
        $(window).scroll($(this.uiDialog), this.repositionDlg);
        $(window).resize($(this.uiDialog), this.repositionDlg);
    },
    
    repositionDlg: function(evt) {
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
            dlg.css('top', top + 'px');
            dlg.css('left', left + 'px');
        }
    },


    /**
     * Modify the contents of jDialog post initialization
     * how to:
     *  $(htmlEntityUsedtoCreateThedialog).dialog('setContent', htmlOrJQueryObject)
     */
    setContent: function(content) {
        $(this.element).html(content);
    },


    /**
     * Place a loading overlay over the dialog
     * options.overlayClass
     * options.spinnerClass
     * 
     * Info:
     * Will create two divs absolutely positioned over the
     * contents of the dialog and over the current contents.
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