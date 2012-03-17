<html>
    <head>
        <link href="/css/jquery-ui-1.8.17.custom.css" type="text/css" rel="Stylesheet" />
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>

        <script type="text/javascript" src="/jquery-ui-source/ui/jquery.ui.dialog.js"></script>
        
        <script type="text/javascript" src="/jquery.cool.jDialogExt.js"></script>
    </head>
    <body>
        <style type="text/css">
            .ui-dialog-spinner {
                background: URL(/images/ajax-loader.gif) center no-repeat;
            }
        </style>
        <div id="runDialog">Launch Dialog</div>
		<div id="runDialog2">Test Positioning</div>
		<div id="runDialog3">doNotFollowWindow = true</div>
		
        <script type="text/javascript">
            $(function(){
				$("#runDialog3").button().click(function() {
					var dlg = $('<div><input type="radio"/> whatever 1<input type="radio"/>whateve 2</div>').dialog({
						autoShow: true,
						title: 'Whatever',
						modal: true,
						resizable: false,
						draggable: false,
						width: 'auto',
						height: 'auto',
						doNotFollowWindow: true,
						close: function(event) { $(this).dialog('widget').remove(); }
					});
				});
	
				$("#runDialog2").button().click(function() {
					var dlg = $('<div><input type="radio"/> whatever 1<input type="radio"/>whateve 2</div>').dialog({
						autoShow: true,
						title: 'Whatever',
						modal: true,
						resizable: false,
						draggable: false,
						width: 'auto',
						height: 'auto',
						close: function(event) { $(this).dialog('widget').remove(); }
					});
				});
				
                $("#runDialog").button().click(function(){
                    var dlg = $('<div>').dialog({
                        autoShow: true,
                        title: 'My Demo Dlg',
                        modal: true,
                        resizable: false,
                        draggable: false,
                        width: 'auto',
                        height: 'auto',
                        spinnerOnAjax: true,
                        autoSpinnerAllAjax: true,
                        close: function(event, ui) { $(this).dialog('widget').remove(); }
                    });
                    
                    dlg.dialog('ajax', {
                        url: "/ajax-response.php",
                        //success: function(r) { dlg.dialog('content', r); },
                        error: function(r) { dlg.dialog('content', 'Something went awfully wrong!<br/>' + r); }
                    });
                });
            });
        </script>
    </body>
</html>
