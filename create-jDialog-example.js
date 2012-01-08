/**
 * How to properly instantiate a jDialog multiple times and face no issues
 *
 * Assume the initial content of our dialog is $("#c1")
 * We create a div element (runtime) and start a dialog over it as below
 *
 * create: function(....): this function will set our initial contents (same as if contents
 * 							where placed directly in the <div></div>.)
 * close: function(....): we want to destroy the instance (unless we want to reuse the very same instance).
 */
$("<div></div>").dialog({
    autoShow: true,
    title: 'My Demo Dlg',
    modal: true,
    resizable: false,
    draggable: false,
    width: 'auto',
    height: 'auto',
    create: function(event, ui) {  $(this).dialog('setContent', $("#c1").clone()); },
    close: function(event, ui) { $(this).destroy(); }
});