/*
if (typeof jQuery === 'undefined') {
    document.write('<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>');
	document.write('<script type="text/javascript">jQuery.noConflict();<\/script>');
}
if (typeof jQuery.ui === 'undefined') {
    document.write('<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min.js"></script>');
}
*/

var BowBuilder = {
	
	container:null,
	
	config: {
	},
	
	init: function () {
		
		var _this = this;
		$(document).ready(function(){
			_this.load();
		});
		
	},
	
	load: function () {
		this.container = $('#bowbuilder');
		this.initFilterBowList('large-bows');
		this.initFilterBowList('small-bows');
		this.initFilterBowList('toppings');
		this.initBowDetail('large-bows');
		this.initBowDetail('small-bows');
		this.initBowDetail('toppings');
		this.initWizard();
	},
	
	initFilterBowList: function (size) {
		
		var $section = this.container.find('[data-section='+size+']'),
		    $filter = $section.find('.filter'),
			$filterButtons = $filter.find('button'),
			$list = $section.find('ul.product-list');	
		
		$list.isotope({
			itemSelector : 'li',
			layoutMode : 'fitRows'
		});

		$list.isotope({ filter: '.none' });
	
		$filterButtons.click($.proxy(function(e){
			
			var $this = $(e.currentTarget),
				selector;
			
			e.preventDefault();

			if ( $this.hasClass('visible') ) {
				return false;
			}

			this.hideBowDetail($list.find('li'));
			
			$filterButtons.removeClass('visible')
			$this.addClass('visible');

			selector = $this.attr('data-filter');
			$list.isotope({ filter: selector });

		},this));
		
	},
	
	initBowDetail: function (size) {
		
		var $section = this.container.find('[data-section='+size+']'),
			$list = $section.find('ul.product-list'),
			$products = $list.find('li');
		
		/*
		$products.find('.product-image-wrap a').click($.proxy(function(e){
			e.preventDefault();
			var $li = $(e.currentTarget).closest('li');
			this.showBowDetail($li);
		},this));
		*/
		
		$products.find('.product-image-wrap a').fancybox({
			title: 'Title',
			content: 'Content',
			autoSize: false,
			width: 910,
			height: 370,
			beforeLoad: this.showBowDetail,
			afterShow: $.proxy(function () { this.activateBowDetail() }, this)
		});
		
	},
	
	showBowDetail: function () {
		
		var $a = $(this.element),
			$li = $a.closest('li.product-list-item'),
			$list = $li.closest('ul.product-list'),
			$img_link = $li.find('.product-image-wrap a'),
			$img = $img_link.find('img'),
			$info = $li.find('.product-info'),
			detailClass;
				
		var source = $("#product-detail-template").html(),
			template = Handlebars.compile(source),
			data = {
				id:    $li.attr('data-variant_id'),
				size:  $li.attr('data-collection'),
				image: $img.attr('src'),
				title: $info.find('h1').text(),
				price: $info.find('.price').text(),
				description: $info.find('.description').html(),
			},
			html = template(data);
		this.title = $info.find('h1').text();
		this.content = html;
		
	},
	
	activateBowDetail: function () {
		
		var $overlay = $('.fancybox-inner');
		
		$overlay.find('button.product-detail-select-btn').click($.proxy(function(e){
			
			var step = $overlay.find('meta[name=step]').attr('value'),
				id = $overlay.find('meta[name=id]').attr('value');
			
			this.selectBow(e.currentTarget,step,id);
			
		},this));

	},
	
	hideBowDetail: function ($li) {
		
		$li.removeClass('detail');
	},
	
	selectBow: function (el,step,id) {
		
		var $select = this.container.find('select[data-section="'+step+'"]'),
			$button = $(el),
			$step = $('section.step[data-section="'+step+'"]');//$select.closest('.step');
		
		$select.val(String(id));
		
		$.fancybox.close();
		
		console.log($step.find('.next-button'));
		
		$step.find('.next-button').click(); // DIRTY DIRTY HACK!
		
	},
	
	initWizard: function () {
		
		this.container.find('.next-button,.back-button').click(function(e){
			e.preventDefault();
		});
		
		this.container.psteps({
			traverse_titles: 'visited',
			//shrink_step_names: false,
			//check_marks: false,
			validation_rule: function() {
				var current_step = $(this);
				var select = current_step.find('select');
				return (select.val() != '');
			},
			before_next: 'Please choose a bow before moving on to the next step.',
			before_submit: 'Please complete all steps before submitting.'
		});
		
	}
	
};

BowBuilder.init();
