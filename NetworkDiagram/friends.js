var source = [{"nodeA":"Betty","nodeB":"Sue","count":1},
{"nodeA":"Sue","nodeB":"Alice","count":1},
{"nodeA":"Sue","nodeB":"Dale","count":1},
{"nodeA":"Sue","nodeB":"Pam","count":1},
{"nodeA":"Sue","nodeB":"Betty","count":1},
{"nodeA":"Pam","nodeB":"Sue","count":1},
{"nodeA":"Pam","nodeB":"Alice","count":1},
{"nodeA":"Pam","nodeB":"Carol","count":1},
{"nodeA":"Carol","nodeB":"Pam","count":1},
{"nodeA":"Carol","nodeB":"Tina","count":1},
{"nodeA":"Tina","nodeB":"Carol","count":1},
{"nodeA":"Dale","nodeB":"Sue","count":1},
{"nodeA":"Dale","nodeB":"Alice","count":1},
{"nodeA":"Dale","nodeB":"Jane","count":1},
{"nodeA":"Jane","nodeB":"Alice","count":1},
{"nodeA":"Jane","nodeB":"Dale","count":1},
{"nodeA":"Alice","nodeB":"Sue","count":1},
{"nodeA":"Alice","nodeB":"Pam","count":1},
{"nodeA":"Alice","nodeB":"Dale","count":1},
{"nodeA":"Alice","nodeB":"Jane","count":1},
];

// unique list of nodes + sum of edges
var source_B=sumEdges(source);
// list of edges + sum of edges + sum of neighors edges + source index + target index
var source_C=sumEdgesofEdges(source,source_B);
// unique list of nodes + sum of edges + average of neighbors sum of edges
var source_D=sumEdgesAvg(source_C,source_B,"edgeSum");
// distinct list of edges
var source_E=distinctEdges(source_C);


// Visualization //

var width = 400;
var height = 400;
var margin = {"top":91,"right":0};


var node_red = "#F79E9E";
var node_green = "#A8E0B3";
var node_litered = "#FAD7D7";
var node_litegreen = "#E5F6E8";
var node_darkblue = "#2166AC";
var node_liteblue = "#D1E5F0";
var node_blue = "#92C5DE";
var link_grey = "#D4D4D4";
var node_stroke = "grey";
var node_inactive_fill = "#F5F5F5";
var node_inactive_stroke = "#DEDEDE";
var link_inactive = "#DEDEDE";
var link_hover = "blue";

var force = d3.layout.force()
    .charge(-1000)
    .linkDistance(60)
    .size([width-margin.right,height-margin.top]);

var node_drag = d3.behavior.drag()
        .on("drag", dragmove);

var dragmove = function() {
	div.style("opacity",0);
	force.tick();
};

var header_div = d3.select("body").append("div")
    .style("height",margin.top + "px")
    .style("width",width + "px");

var header_div_svg = header_div.append("svg");

var legend_rect = header_div_svg.append("circle")
    .attr("id","legend_rect")
    .attr("cx",27)
    .attr("cy",10)
    .attr("r",7.5)
    .attr("fill",node_blue);
    

var legend_rect_text = header_div_svg.append("text")
    .attr("class","friendslabel")
    .attr("x",40)
    .attr("y",14)
    .attr("text-anchor","left")
    .text("People with more friends than their friends on average");
    
var legend_first_line = header_div_svg.append("line")
    .attr("x1",20)
    .attr("x2",35)
    .attr("y1",33)
    .attr("y2",33)
    .attr("stroke",link_hover)
    .attr("stroke-width",2);
    
var legend_first_line_text = header_div_svg.append("text")
    .attr("class","friendslabel")
    .attr("x",40)
    .attr("y",37)
    .attr("text-anchor","left")
    .text("Direct friends");
    
var legend_second_line = header_div_svg.append("line")
    .attr("x1",20)
    .attr("x2",35)
    .attr("y1",56)
    .attr("y2",56)
    .attr("stroke",link_hover)
    .attr("stroke-width",2)
    .attr("stroke-dasharray","5,5");
    
var legend_second_line_text = header_div_svg.append("text")
    .attr("class","friendslabel")
    .attr("x",40)
    .attr("y",60)
    .attr("text-anchor","left")
    .text("Mutual friends");
    
var legend_div = header_div.append("div")
    .attr("class","tooltip")
	.attr("opacity",1)
	.text("Name, # of Friends (Avg Friends' # of Friends)")
	.style("left",30 + 'px')
	.style("top",80 + 'px');

var chart_div = d3.select("body").append("div")
	.style("height",height+"px")
	.style("width",(width-margin.right) + "px");
    
var chart = chart_div.append("svg");
    
var svg = chart.append("svg")
    .attr("width",width-margin.right)
    .attr("height",height).append("g")
    .attr("transform","translate(0,40)");  

var friends_circle = chart.append("circle")
    .attr("r",7)
    .style("fill",node_blue)
    .attr("cx",width-margin.right+7)
    .attr("cy",100);

var friends_label = chart.append("text")
    .attr("class","friendslabel")
    .attr("x",width-margin.right+7*3)
    .attr("y",105)
    .text("# of friends > friends' avg # of friends");

force
    .nodes(source_D)
    .links(source_E)
    .start();
    
var div = d3.select("body").append("div")
    .attr("class","tooltip")
    .style("opacity",0);
    
var link = svg.selectAll(".link")
    .data(source_E)
    .enter().append("line")
    .attr("class","link")
    .style("stroke-width",2);

var node = svg.selectAll(".node")
    .data(source_D)
    .enter().append("circle")
    .attr("class","node")
    .attr("r",function(d) {return 5+2*d.sum;})
    .style("fill",function(d) { 
    	    if(d.sum>d.avg) {
    	    	return node_blue;
    	    }
    	    else {
    	    	return node_red;
    	    }
    	})
    .call(force.drag);

node
	.on("mouseover", function(d,i){
		
		// Tooltip
		div
		    .style("opacity",1);
		div.html(d.nodeA + " " + d.sum + " (" + Math.round(d.avg*100)/100 + ")")
		    .style("left",(d3.event.pageX)+"px")
		    .style("top",(d3.event.pageY-28)+"px");
		
		// Current node
		d3.select(this)
		    .style("fill","blue")
		    .style("stroke","blue");
		    
		    
		// Store indices of neighboring nodes
		var nodeNeighbors = source_E.filter(function(p) {return d.nodeA == p.source.nodeA || d.nodeA == p.target.nodeA;})
		    //.style("stroke-width",10)
		    .map(function(p){
		    	return p.source.nodeA === d.nodeA ? p.target.index : p.source.index;
		    });
		 // Style neighboring nodes
		 node.filter(function(k) {
                        // I filter the selection of all circles to only those that hold a node with an
                        // index in my listg of neighbors
                        return nodeNeighbors.indexOf(k.index) > -1;
                    })
                    .style('stroke', 'blue')
                    .style('stroke-width',2);
         
         // Store indices of second-degree nodes
         var nodeNeighborsNeighbors = source_E.filter(function(p) {return nodeNeighbors.indexOf(p.source.index)>-1 || nodeNeighbors.indexOf(p.target.index)>-1 ;})
             .map(function(p){
             	if (nodeNeighbors.indexOf(p.source.index)>-1 && d.index != p.target.index){
             		return p.target.index;
             	}
             	else if (nodeNeighbors.indexOf(p.target.index)>-1 && d.index != p.source.index){
             		return p.source.index;
             	}
             });
         
         // Select and style second-degree nodes
         node.filter(function(k){
         	return nodeNeighborsNeighbors.indexOf(k.index) > -1 && nodeNeighbors.indexOf(k.index)==-1;
         })
         .style('stroke',"blue")
         .style('stroke-width',2)
         .style("fill",function(k){
         	if(k.sum>k.avg){
         		return node_liteblue;
         	}
         	else {
         		return node_litered;
         	}
         })
         .attr("stroke-dasharray","5,5");
         
         // Select and style non-applicable nodes
         node.filter(function(k){
         	return nodeNeighborsNeighbors.indexOf(k.index) == -1 && nodeNeighbors.indexOf(k.index) == -1 && k.index!=d.index;
         })
         .style("fill",node_inactive_fill)
         .style("stroke",node_inactive_stroke);
         
         // Select and style non-applicable links
         link.filter(function(k){
         	return nodeNeighbors.indexOf(k.source.index) == -1 && nodeNeighbors.indexOf(k.target.index) ==-1;
         })
         .style("stroke",link_inactive)
         .style("stroke-width",1);
         
         // Select and style direct links
         link.filter(function(k){
         	return (k.source.index==d.index || k.target.index==d.index);// || (nodeNeighbors.indexOf(k.source.index)>-1 && nodeNeighbors.indexOf(k.target.index)>-1);
         })
         .style("stroke","blue");
         
         // Select and style mutual friends links
         link.filter(function(k){
         	return k.source.index!=d.index && k.target.index!=d.index && (nodeNeighbors.indexOf(k.source.index)>-1 || nodeNeighbors.indexOf(k.target.index)>-1);// && !(nodeNeighbors.indexOf(k.source.index)>-1 && nodeNeighbors.indexOf(k.target.index)>-1);
         })
         .attr("stroke-dasharray","5,5")
         .style("stroke","blue");
         
	});
node
    .on("mouseout", function(d){
    	
    	div
    	    .style("opacity",0);
    	    
    	d3.selectAll('.node')
    	    .style("fill", function(d) {
    	        if(d.sum>d.avg) {
    	        	return node_blue;
    	        }
    	        else {
    	        	return node_red;
    	        }
    	    })
    	    .style("stroke",node_stroke)
    	    .style("stroke-width",1)
    	    .attr("stroke-dasharray","none");
    	    
    	d3.selectAll('.link')
    	    .attr("class","link")
    	    .style("stroke",link_grey)
            .style("stroke-width",2)
            .attr("stroke-dasharray","none");
    });

node
    .on("mousedown", function(d){
    	div
    	    .style("opacity",0);
    });

force.on("tick", function() {
	link.attr("x1",function(d) { return d.source.x;})
	    .attr("y1",function(d) { return d.source.y;})
	    .attr("x2",function(d) { return d.target.x;})
	    .attr("y2",function(d) { return d.target.y;});
	    
	    node.attr("cx",function(d) {return d.x;})
	        .attr("cy", function(d) { return d.y; });
});
    
// FUNCTIONS //

function distinctEdges(source_data) {
	// this will only work if each edge is defined in both directions; otherwise, it will miss edges
	var source_edges = [];
	for (i=0;i<source_data.length;i++){
		var source_index = source_data[i].source;
		var target_index = source_data[i].target;
		if(source_index>target_index){
			source_edges.push(source_data[i]);
		}
	}
	return source_edges;
}

function sumEdges(source_data) {
	var source_sum=[];
	for (i=0;i<source_data.length;i++){
		var curr_node = source_data[i].nodeA;
		var node_exists = 0;
		for (j=0;j<source_sum.length;j++){
			var check_node = source_sum[j].nodeA;
			if(curr_node==check_node){
				node_exists=1;
				source_sum[j].sum+=1;
			}
		}
		if(node_exists==0) {
			source_sum.push({"nodeA":curr_node, "sum":1});
		}
		
	}
	return source_sum;
}

function sumEdgesAvg(source_data,source_sum,prop) {
	var source_avg=clone(source_sum);
	for (i=0;i<source_data.length;i++){
		var curr_node = source_data[i].nodeA;
		var node_exists = 0;
		for (j=0;j<source_avg.length;j++){
			if(source_avg[j].hasOwnProperty(prop)){
				
			}
			else {
				source_avg[j][prop]=0;
			}
			var check_node = source_avg[j].nodeA;
			if(curr_node==check_node){
				source_avg[j][prop]+=source_data[i][prop];
				source_avg[j].sum=source_sum[j].sum;
				source_avg[j].avg=source_avg[j][prop]/source_avg[j].sum;
			}
		}
	}
	return source_avg;
}

function sumEdgesofEdges(source_data,source_sum){
	
	var source_edge_sum = clone(source_data);
	
	for (i=0;i<source_sum.length;i++){
		var curr_node = source_sum[i].nodeA;
		for (j=0;j<source_edge_sum.length;j++){
			if(source_edge_sum[j].nodeA==curr_node){
				source_edge_sum[j].sum = source_sum[i].sum;
				source_edge_sum[j].source = i;
			}
			if(source_edge_sum[j].nodeB==curr_node){
				source_edge_sum[j].edgeSum = source_sum[i].sum;
				source_edge_sum[j].target = i;
			}
		}
	}
	
	return source_edge_sum;
}


function clone(src) {
	function mixin(dest, source, copyFunc) {
		var name, s, i, empty = {};
		for(name in source){
			// the (!(name in empty) || empty[name] !== s) condition avoids copying properties in "source"
			// inherited from Object.prototype.	 For example, if dest has a custom toString() method,
			// don't overwrite it with the toString() method that source inherited from Object.prototype
			s = source[name];
			if(!(name in dest) || (dest[name] !== s && (!(name in empty) || empty[name] !== s))){
				dest[name] = copyFunc ? copyFunc(s) : s;
			}
		}
		return dest;
	}

	if(!src || typeof src != "object" || Object.prototype.toString.call(src) === "[object Function]"){
		// null, undefined, any non-object, or function
		return src;	// anything
	}
	if(src.nodeType && "cloneNode" in src){
		// DOM Node
		return src.cloneNode(true); // Node
	}
	if(src instanceof Date){
		// Date
		return new Date(src.getTime());	// Date
	}
	if(src instanceof RegExp){
		// RegExp
		return new RegExp(src);   // RegExp
	}
	var r, i, l;
	if(src instanceof Array){
		// array
		r = [];
		for(i = 0, l = src.length; i < l; ++i){
			if(i in src){
				r.push(clone(src[i]));
			}
		}
		// we don't clone functions for performance reasons
		//		}else if(d.isFunction(src)){
		//			// function
		//			r = function(){ return src.apply(this, arguments); };
	}else{
		// generic objects
		r = src.constructor ? new src.constructor() : {};
	}
	return mixin(r, src, clone);

}
