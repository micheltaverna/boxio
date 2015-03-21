<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
	
		<!-- FORCE LES GRIDS MULTILINE -->
		<style type="text/css">
		    .x-grid-row .x-grid-cell-inner {
		        white-space: normal;
		    }
		    .x-grid-row-over .x-grid-cell-inner {
		        font-weight: bold;
		        white-space: normal;
		    }
		</style>
   		<!-- LISTE DES FICHIERS EXTJS -->
        <link rel="stylesheet" type="text/css" href="ext-4.1.1a/resources/css/ext-all.css">
        <script type="text/javascript" src="ext-4.1.1a/ext-all-debug-w-comments.js"></script>

        <!-- LISTE DES FICHIERS EXTJS EXTENTION --> 
        <link rel="stylesheet" type="text/css" href="ux/grid/css/GridFilters.css" />
        <link rel="stylesheet" type="text/css" href="ux/grid/css/RangeMenu.css" />
        <script type="text/javascript" src="ux/grid/FiltersFeature.js"></script>
        <script type="text/javascript" src="ux/grid/filter/Filter.js"></script>
        <script type="text/javascript" src="ux/grid/filter/StringFilter.js"></script>
        <script type="text/javascript" src="ux/grid/filter/ListFilter.js"></script>
        <script type="text/javascript" src="ux/grid/filter/BooleanFilter.js"></script>
        <script type="text/javascript" src="ux/grid/filter/NumericFilter.js"></script>
        <script type="text/javascript" src="ux/grid/filter/DateFilter.js"></script>
        <script type="text/javascript" src="ux/grid/menu/RangeMenu.js"></script>

		<!-- LISTE DES FICHIERS INTERNE -->
        <link rel="stylesheet" type="text/css" href="myMsg.css" />
        <link rel="stylesheet" type="text/css" href="cron.css" />
        <link rel="stylesheet" type="text/css" href="equipements.css" />
        <link rel="stylesheet" type="text/css" href="server.css" />
		<link rel="stylesheet" type="text/css" href="update.css" />
		<script type="text/javascript" src="sha512.js"></script>
		<script type="text/javascript" src="ux/ext-lang-fr.js"></script>
        <script type="text/javascript" src="require.js"></script>
        <script type="text/javascript" src="define.js"></script>
        <script type="text/javascript" src="data.js"></script>
        <script type="text/javascript" src="request.js"></script>
        <script type="text/javascript" src="myMsg.js"></script>
        <script type="text/javascript" src="own_scripts.js"></script>
        <script type="text/javascript" src="layout.js"></script>
        <script type="text/javascript" src="menu.js"></script>
        <script type="text/javascript" src="trame.js"></script>
        <script type="text/javascript" src="favoris.js"></script>
        <script type="text/javascript" src="cron.js"></script>
        <script type="text/javascript" src="macros.js"></script>
        <script type="text/javascript" src="equipements.js"></script>
        <script type="text/javascript" src="commande.js"></script>
        <script type="text/javascript" src="status.js"></script>
        <script type="text/javascript" src="references.js"></script>
        <script type="text/javascript" src="scenarios.js"></script>
        <script type="text/javascript" src="author.js"></script>
        <script type="text/javascript" src="version.js"></script>
        <script type="text/javascript" src="server.js"></script>
        <script type="text/javascript" src="trigger.js"></script>
        <script type="text/javascript" src="user.js"></script>
        <script type="text/javascript" src="doc.js"></script>
        <script type="text/javascript" src="update.js"></script>
        <script type="text/javascript" src="login.js"></script>
        <script type="text/javascript">
			var version = "Beta 1.5";
			var auteur = "Michel Taverna";
			layout.func.init();
			login.func.checkLogin(function(status) {
				if (status == 'false') {
					login.win.login();
				}
			});
		</script>
        
    </head>
    <body>
    </body>
</html> 
