(function($) {
    $.fn.vis = function(options) {
		var defaults = {
			data: undefined,
			height: 1300,
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
		       .domain([80,opts.data.max_avg])
		       .nice();
		chart = d3.select('#vis')
			.append('svg')
			.attr('class','drawArea')
			.attr('width', opts.width)
			.attr('height', opts.height);
		
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
		.attr('height',20)
		.attr('width',function (datum,index) {
			return xRating(datum.average);
		});
            
		
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
		.attr('x',650)
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
		.attr('x',640)
		.attr('height',30)
		.attr('width', 380)
		.attr('style', 'fill:none; stroke: black;');


        });
    };
})(jQuery);
