<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Boring Club</title>
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <script src="js/jquery-2.2.1.min.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/main.js"></script>
    <link href="css/main.css" rel="stylesheet">
</head>
<body>
<div class="navbar navbar-default">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">62 Kirkwood</a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav navbar-right">
                <li class="dropdown">
                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Data
                        <span class="caret"></span></a>
                    <ul class="dropdown-menu" role="menu">
                        <li><a href="#" data-toggle="modal" data-target="#myModal">Show XML Sources</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
</div>
<div class="container">
    <div class="row">
        <div class="page-header">
            <h1>Movement</h1>
        </div>
        <div class="bs-component">
            <div id="movement">
            </div>
        </div>
    </div>
</div>
<div class="modal" id="myModal">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                <h4 class="modal-title">Project Details</h4>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="col-lg-2 control-label">Intel Edison</label>
                    <div class="col-lg-10">
                        <a href="http://www.intel.com/content/www/us/en/do-it-yourself/edison.html">Project Page</a>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
</body>
</html>