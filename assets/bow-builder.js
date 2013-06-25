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
		
		this.initBowSelect(size);
		
		var $section = $('#bowbuilder-'+size),
		    $filter = $section.find('.bowbuilder-filter'),
			$filterButtons = $filter.find('button'),
			$list = $section.find('ul.bowbuilder-product-list');	
		
		$list.isotope({
			itemSelector : 'li',
			layoutMode : 'fitRows'
		});

		$list.isotope({ filter: '.none' });
	
		$filterButtons.click(function(e){
			
			var $this = $(this),
				selector;
			
			e.preventDefault();

			if ( $this.hasClass('selected') ) {
				return false;
			}
			
			$filterButtons.removeClass('selected')
			$this.addClass('selected');

			selector = $this.attr('data-filter');
			$list.isotope({ filter: selector });

		});
		
	},
	
	initBowDetail: function (size) {
		
		var $section = $('#bowbuilder-'+size),
			$list = $section.find('ul.bowbuilder-product-list'),
			$products = $list.find('li');
		
		$products.find('.product-image-wrap a').fancybox({
			title: 'Title',
			content: 'Content',
			autoSize: false,
			width: 910,
			height: 370,
			beforeLoad: function () {
				
				var $li = $(this.element).closest('li'),
					$img_link = $li.find('.product-image-wrap a'),
					$img = $img_link.find('img'),
					$info = $li.find('.product-info');
				
				var source   = $("#product-detail-template").html(),
					template = Handlebars.compile(source),
					data = {
						image: $img.attr('src'),
						title: $info.find('h1').text(),
						price: $info.find('.price').text(),
						description: $info.find('.description').html()
					},
					html = template(data)
				;
				
				console.log(data);
				
				this.title = $info.find('h1').text();
				this.content = html;
				
			}
			//afterLoad: showBowDetail
		});

		function showBowDetail (current) {
	
			var $a = $(current),
				$product = $a.closest('li')
				$image_wrap = $product.find('.product-image-wrap'),
				$info = $product.find('.product-info'),
				title = $info.find('h1').text()
			;
		
			$('<div>Balls!</div>').appendTo(current.content);
	
			console.log(current);
		
		}
	
	},
	
	initBowSelect: function (size) {
		
		/*
		var self = this,
		    $section = $('#bowbuilder-'+size),
			$list = $section.find('ul.bowbuilder-product-list'),
			$listItems = $list.find('li'),
			$listLinks = $list.find('a');
				
		$listLinks.click(function(e){
			
			var $this = $(this),
				$thisListItem = $this.closest('li');
		
			e.preventDefault();

			if ( $thisListItem.hasClass('selected') ) {
				
				$listItems.removeClass('selected');
				self.selectBow(size,'');

			} else {
				
				$listItems.removeClass('selected')
				$thisListItem.addClass('selected');				
				self.selectBow(size,$thisListItem.attr('data-product_id'));

    			$list.isotope({ filter: '.selected' });

                $thisListItem.css({ width: 960 });
                $thisListItem.find('.wrapper').animate({ width: 960 },{
                    complete: function () {
                        $thisListItem.css({ height: 360 });
                        $thisListItem.find('.wrapper').animate({ height: 360 });
                    }
                });

                $list.isotope( 'reLayout' );
				
			}
			
			//self.container.trigger('validate_psteps');
			
		});
		*/
		
	},
	
	selectBow: function (size,value) {
		
		var $select = $('#bowbuilder-select-'+size);		
		$select.val(String(value));
		
	},
	
	initWizard: function () {
		
		this.container.psteps({
			traverse_titles: 'visited',
			shrink_step_names: false,
			check_marks: false,
			validation_rule: function() {
				var current_step = $(this);
				var select = current_step.find('select.bowbuilder-select');
				return (select.val() != '');
			},
			before_next: 'Please choose the correct box before moving on to the next step.',
			before_submit: 'Please complete all steps before submitting.'
		});
		
	}
	
};

BowBuilder.init();
