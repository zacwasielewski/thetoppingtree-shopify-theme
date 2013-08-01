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

  config: {
    sections: ['large-bows','small-bows','toppings']
  },
  
  global: {
    $container: null,
    $sections: null,
    $preview: null
  },
  
  init: function () {
    
		$(document).ready($.proxy(function(){
			this.load();
		},this));

  },
  
  load: function () {
    
    this.global.$container = $('#bow-builder');
    this.global.$sections  = this.global.$container.find('li[data-section]');
    this.global.$preview   = $('.bow-builder-preview');
    
    $.each(this.config.sections,$.proxy(function(n,section){
      this.init_section(section);
      this.init_product_info(section);
    },this));
    
  },
  
  init_section: function (section) {
    
    var $section = this._get_$section(section),
        $toggle = $section.find('.step-name a');
    
    $section.find('ul').hide();

    $toggle.click($.proxy(function(e){
      
      var $toggle = $(e.currentTarget),
          toggle_state = $toggle.data('toggle-state');
      
      e.preventDefault();
      
      if (toggle_state=='open') {
      
        this.hide_section(section,$.proxy(function(){
          this.show_preview();
        },this));
        
      } else {
      
        this.hide_preview($.proxy(function(){
                    
          this.global.$sections.each($.proxy(function(n,el){
            
            var tmp_section = $(el).data('section');
            if (tmp_section != section) {
              this.hide_section(tmp_section);
            }
            
          },this));
          
          this.show_section(section);

        },this));
        
      }
      
    },this));
    
  },
  
  show_section: function (section,callback) {
    
    var $section = this._get_$section(section),
        $toggle = $section.find('.step-name a'),
        $sections = this.global.$sections,
        $toggles = this.global.$sections.find('.step-name a');
        
    $section.find('ul').slideDown({
      duration: 400,
      done: callback
    });
    
    $toggle.data('toggle-state','open');

  },
  
  hide_section: function (section,callback) {

    var $section = this._get_$section(section),
        $toggle = $section.find('.step-name a');

    $section.find('ul:visible').slideUp({
      duration: 400,
      done: callback
    });
    
    $toggle.data('toggle-state',null);
    
  },
  
  show_preview: function (callback) {
    this.global.$preview.fadeIn({
      duration: 400,
      done: callback
    });
  },
  
  hide_preview: function (callback) {
    this.global.$preview.fadeOut({
      duration: 400,
      done: callback
    });
  },
  
  init_product_info: function (section) {

		var $section = this._get_$section(section),
        $list = $section.find('ul.product-list'),
        $products = $list.find('li.product-list-item');
		
		$products.find('.product-image-wrap a').click($.proxy(function(e){
		
		  var product, value;
		  
		  e.preventDefault();
		  product = $(e.currentTarget).closest('li.product-list-item').get(0);
		  this.show_product_info(section,product);
		  
		},this));

  },
  
  show_product_info: function (section,product) {
    
    var title, content;
    
		var $product = $(product),
        $img_link = $product.find('.product-image-wrap a'),
        $img = $img_link.find('img'),
        $info = $product.find('.product-info');
				
		var source = $("#product-detail-template").html(),
        template = Handlebars.compile(source),
        data = {
          id:    $product.attr('data-variant_id'),
          size:  $product.attr('data-collection'),
          image: $img.attr('src'),
          title: $info.find('h1').text(),
          price: $info.find('.price').text(),
          description: $info.find('.description').html(),
        },
        html = template(data);
    
		title = $info.find('h1').text();
		$content = this.activate_product_info_html(section,product,html);
		
		this.preload_preview_image(product);
		
    $.fancybox.open({
      title: title,
      content: $content,
      autoSize: false,
      width: 910,
      height: 455,
      beforeShow: function () {}
    });
    
  },
  
  get_product_info: function (product) {

		var $product = $(product),
        $img_link = $product.find('.product-image-wrap a'),
        $img = $img_link.find('img'),
        $info = $product.find('.product-info');
				
    return {
      id:    $product.attr('data-variant_id'),
      size:  $product.attr('data-collection'),
      image: $img.attr('src'),
      title: $info.find('h1').text(),
      price: $info.find('.price').text(),
      description: $info.find('.description').html(),
    };

  },
  
  hide_product_info: function () {
  },
  
  activate_product_info_html: function (section,product,html) {

    var $html = $(html);
    
    $html.find('button').click($.proxy(function(e){
      
      e.preventDefault();
      
		  var value = $(product).data('variant_id');

		  this.set_section_product(section,product,value);
      this.update_preview_image();

      this.hide_section(section,$.proxy(function(){
        this.show_preview();
      },this));

      $.fancybox.close(true);
      
    },this));
    
    return $html;
    
  },
  
  set_section_product: function (section,product,value) {
    
    var $section = this._get_$section(section)
        $step_title = $section.find('.step-title'),
        info = this.get_product_info(product);
    
    this.unset_section_product(section);
    
    // change the value of the master <select>
    $section.find('select').val(value);
    
    // insert selected product title into HTML view
    $product_title = $('<span class="step-selected-product">&mdash; ' + info.title + '</span>');
    $remove_btn = $('<button class="accent-text btn action-btn small remove">x</button></span>');
    $remove_btn.click($.proxy(function(e){
      e.preventDefault();
      this.unset_section_product(section);
      this.update_preview_image();
    },this));
    $product_title.append($remove_btn);
    
    $step_title.append($product_title);
    
    // remove 'selected' mark from all product elements
    $section.find('li.product-list-item').removeClass('selected');
    
    // mark product element as 'selected'
    $(product).addClass('selected');
    
  },
  
  unset_section_product: function (section) {

    var $section = this._get_$section(section)
        $step_title = $section.find('.step-title');

    $section.find('select').val('');
    
    $step_title.find('.step-selected-product').remove();

    // remove 'selected' mark from all product elements
    $section.find('li.product-list-item').removeClass('selected');
    
  },
  
  preload_preview_image: function (product) {
    
    var src = $(product).find('.product-image-wrap img').data('bow-builder-img-src');
    if (src) {
      $('<img/>')[0].src = src;
    }
    
  },
  
  update_preview_image: function () {
    
    this.global.$preview.empty();
    
    this.global.$sections.each($.proxy(function(n,section){
      
      var src = $(section).find('li.product-list-item.selected .product-image-wrap img').data('bow-builder-img-src');
      if (src) {
        var img = '<img src="'+src+'">';
        this.global.$preview.append(img);
      }
    
    },this));
    
  },
  
  _get_$section: function (section) {
    return (section)
      ? this.global.$sections.filter('[data-section='+section+']')
      : this.global.$sections;
  }

};

/*
var BowBuilder2 = {
	
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
		
		$filterButtons.filter('[data-filter="*"]').click();
		
	},
	
	initBowDetail: function (size) {
		
		var $section = this.container.find('[data-section='+size+']'),
			$list = $section.find('ul.product-list'),
			$products = $list.find('li');
		
		$products.find('.product-image-wrap a').fancybox({
			title: 'Title',
			content: 'Content',
			autoSize: false,
			width: 910,
			height: 455,
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
			$item = $('li[data-variant_id='+id+']'),
			$step = $('section.step[data-section="'+step+'"]');
		
		$select.val(String(id));
    
		$step.find('li').removeClass('selected');
		$item.addClass('selected');
		
		$.fancybox.close();
		
		$step.find('.next-button').click(); // DIRTY DIRTY HACK!
		
	},
	
	initWizard: function () {
		
		this.container.find('.next-button,.back-button').click(function(e){
			e.preventDefault();
		});
		
		this.container.psteps({
			traverse_titles: 'visited',
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
*/

BowBuilder.init();
