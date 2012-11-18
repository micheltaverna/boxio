/**
 * Liste des require pour l'interface globale
 */

Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', './ux');

Ext.require([
            'Ext.button.*',
            'Ext.container.ButtonGroup',
         	'Ext.data.*',
			'Ext.form.*',
			'Ext.form.field.ComboBox',
			'Ext.form.FieldSet',
			'Ext.grid.*',
			'Ext.ModelManager',
            'Ext.panel.*',
			'Ext.tab.*',	
			'Ext.tip.*',
			'Ext.tip.QuickTipManager',
            'Ext.toolbar.*',
			'Ext.toolbar.Paging',
			'Ext.util.*',
			'Ext.ux.grid.FiltersFeature',
			'Ext.ux.grid.menu.ListMenu',
		    'Ext.ux.grid.menu.RangeMenu',
		    'Ext.ux.grid.filter.BooleanFilter',
		    'Ext.ux.grid.filter',
		    'Ext.ux.grid.filter.Filter',
		    'Ext.ux.grid.filter.DateFilter',
		    'Ext.ux.grid.filter.ListFilter',
		    'Ext.ux.grid.filter.NumericFilter',
		    'Ext.ux.grid.filter.StringFilter',
            'Ext.Viewport.*',
			'Ext.window.*',
			'Ext.window.MessageBox'
]);

