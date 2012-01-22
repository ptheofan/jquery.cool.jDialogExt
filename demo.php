<html>
    <head>
        <link href="/css/jquery-ui-1.8.17.custom.css" type="text/css" rel="Stylesheet" />
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.8.16/jquery-ui.min.js"></script>
        
        <script type="text/javascript" src="/jdialog-extention.js"></script>
    </head>
    <body>
        <style type="text/css">
            .ui-dialog-spinner {
                background: URL(/images/ajax-loader.gif) center no-repeat;
            }
        </style>
        <div id="runDialog">Launch Dialog</div>
        <script type="text/javascript">
            $(function(){
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