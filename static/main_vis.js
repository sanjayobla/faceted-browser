(function($) {
	$.fn.scrollView = function () {
	    return this.each(function () {
		$('html, body').animate({
		    scrollTop: $(this).offset().top
		}, 1000);
	    });
	}
    $.fn.vis = function(options) {
		var defaults = {
			data: undefined,
			height: 2300,
			width: 1300
		}, opts = $.extend(true, {}, defaults, options);

		 /** Code from where the execution starts **/
        this.each(function() {
		$('.drawArea').remove();
		var xCount = d3.scale.log()
			.range([5,130])
			.domain([1,opts.data.max_count])
			.nice();

		var xRating = d3.scale.linear()
		       .range([1,130])
		       .domain([50,opts.data.max_avg])
		       .nice();
		chart = d3.select('#vis')
			.append('svg')
			.attr('class','drawArea')
			.attr('width', opts.width)
			.attr('height', opts.height);
		
		chart
		.append('text')
		.attr('class','categoryTitle')
		.text($('#category').val())
		.attr('text-anchor','start')
		.attr('font-size', '20px')
		.attr('y',28)
		.attr('x',550-500)
		.attr('style', 'fill:#000000');

		chart
		.append('text')
		.attr('class','ratingTitle')
		.text('Avg. Rating')
		.attr('text-anchor','start')
		.attr('font-size', '20px')
		.attr('y',28)
		.attr('x',550-300)
		.attr('style', 'fill:#000000');
		
		chart
		.append('text')
		.attr('class','countTitle')
		.text('Count')
		.attr('text-anchor','start')
		.attr('font-size', '20px')
		.attr('y',28)
		.attr('x',550-100)
		.attr('style', 'fill:#000000');
		
		chart
		.append('text')
		.attr('class','descriptorTitle')
		.text('Descriptors')
		.attr('text-anchor','start')
		.attr('font-size', '20px')
		.attr('y',28)
		.attr('x',650)
		.attr('style', 'fill:#000000');
		
		chart.selectAll('.category')
		.data(opts.data.rows)
		.enter()
		.append('text')
		.attr('class', function (datum,index) {
			return 'category row'+index;
		})
		.attr('x', 550-500)
		.attr('y', function (datum,index) {
			return 50*index+50+15;
		})
		.html(function (datum,index) {
			return datum._id;
		});

		chart.selectAll('.countBar')
		.data(opts.data.rows)
		.enter()
		.append('rect')
		.attr('class',function (datum,index) {
			return 'countBar row'+index;
		})
		.attr('x', 550-100)
		.attr('y', function (datum,index) {
			return 50*index+50;
		})
		.attr('style', 'fill:#3182bd')
		.attr('height',20)
		.attr('width',function (datum,index) {
			return xCount(datum.count);
		});

		chart.selectAll('.countText')
		.data(opts.data.rows)
		.enter()
		.append('text')
		.attr('class','countText')
		.text(function(datum,index) { return parseInt(datum.count);})
		.attr('text-anchor','end')
		.attr('y',function(datum,index) { return 50*index+50+15; })
		.attr('x',function(datum,index) { return 550-100+xCount(datum.count)-5; })
		.attr('style', 'fill:#000000')
		
		chart.selectAll('.ratingBar')
		.data(opts.data.rows)
		.enter()
		.append('rect')
		.attr('class', function (datum,index) {
			return 'ratingBar row'+index;
		})
		.attr('x', 550-300)
		.attr('y', function (datum,index) {
			return 50*index+50;
		})
		.attr('style', function (datum, index) {
			if (datum.average >=85) return 'fill:#91cf60';
			if (datum.average >= 75) return 'fill:#fc8d59';
			else return 'fill:#FF7878';
		})
		.attr('height',20)
		.attr('width',function (datum,index) {
			return xRating(datum.average);
		});
            
		chart.selectAll('.ratingText')
		.data(opts.data.rows)
		.enter()
		.append('text')
		.attr('class','ratingText')
		.text(function(datum,index) { return parseInt(datum.average);})
		.attr('text-anchor','end')
		.attr('y',function(datum,index) { return 50*index+50+15; })
		.attr('x',function(datum,index) { return 550-300+xRating(datum.average)-5; })
		.attr('style', 'fill:#000000')
		
		chart.selectAll('.descText')
		.data(opts.data.Descriptors)
		.enter()
		.append('text')
		.attr('class', function (datum,index) {
			return 'descText row'+index;
		})
		.attr('class','descText')
		.html(function(datum, index) {
			sub_array = datum.splice(0,5);
			top_desc = [];
			for (descriptor in sub_array) {
				console.log(sub_array[descriptor]);
				top_desc.push(sub_array[descriptor][0]);
			}
			return top_desc.join(',');
		})
		.attr('y',function(datum,index) { return 50*index+50+15; })
		.attr('x',660)
		.attr('style', 'fill:#000000');

		chart.selectAll('.descBorder')
		.data(opts.data.rows)
		.enter()
		.append('rect')
		.attr('class','descBorder')
		.attr('class', function (datum,index) {
			return 'descBorder row'+index;
		})
		.attr('y',function(datum,index) { return 50*index+50-5; })
		.attr('x',650)
		.attr('height',30)
		.attr('width', 380)
		.attr('style', 'fill:none; stroke: black;');


        });
    };
})(jQuery);
