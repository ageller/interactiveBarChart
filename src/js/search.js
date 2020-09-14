//search through the input object for names that match
function checkSearchInput(event = null){
	var value = document.getElementById('searchInput').value;
	//console.log("Searching", value)

	//is there a faster way to do this? (maybe but this seems fast enough)
	var funds;
	if (value.length > 0){
		funds = [];
		params.inputData.forEach(function(d){
			if (d['institutionname'].substring(0,value.length).toUpperCase() == value.toUpperCase()){
				if ( (!params.isTypeA && !params.isTypeB) ||
				(params.isTypeA && d['institution_type2'] == 'Type A') ||
				(params.isTypeB && d['institution_type2'] == 'Type B') ) {
					funds.push(d);
				}
			} 
		})
	} else {
		funds = null;
	}
	showNames(funds);

}

//show a list of names in the div below the search box
function showNames(funds = null){
	d3.select('#searchList').selectAll('.listNames').remove();
	d3.select('#searchList').selectAll('.fundInfo').remove();

	if (funds){
		if (funds.length > 0){
			d3.select('#searchList').selectAll('.listNames')
				.data(funds).enter()
				.append('div')
					.attr('class','listNames')
					.classed('listNamesHover', true)
					.attr('id',function(d) {return 'listNames' + d['institutionname'].replace(/[^a-zA-Z0-9]/g, "");})
					.on('click', function(d) {
						showNameInfo(d);
						highlightBar(d);
					})
					.text(function(d){return d['institutionname'];})
		} else {
			d3.select('#searchList').append('div')
				.attr('class','fundInfo')
				.style('color','gray')
				.style('font-size','16px')
				.text('No results')
		}
	}
}


//show the type of fund for a given name (could add more info if desired)
function showNameInfo(fund){
	var id = fund['institutionname'].replace(/[^a-zA-Z0-9]/g, "")
	var elm = d3.select('#listNames' + id);
	var posElm = getPosition(elm.node());
	var posContainer = getPosition(params.container.node());
	var posY = Math.max(posElm.y - params.buttonHeight - posContainer.y - 3, 0);  //-3 for the borders
	//clear the funds
	showNames(); 

	//add back this fund to the 
	d3.select('#searchList').append('div')
		.attr('id','listNames' + id)
		.attr('class','listNames')
		.classed('listNamesHover', false)
		.style('margin-top', posY  + 'px') 
		.text(fund['institutionname'])

	var dur = 0;
	if (posY > 0) {
		d3.select('#listNames' + id).style('border-top', '1px solid black')
		dur = params.duration;
	}

	//move it to the top of the div
	d3.select('#listNames' + id).transition().duration(dur)
		.style('margin-top',0 + 'px')
		.style('border-top',0 + 'px')
		.style('border-bottom', 0 + 'px')
		.on('end', function(){
			var tp = fund['institution_type2'];
			if (tp[tp.length - 1] == 's') tp = tp.substring(0, tp.length - 1);
			d3.select(this).append('div')
				.attr('class','fundInfo')
				.text(tp)
		})
}

function clearSearch(event){
	if (!event.target.id.includes('search')) document.getElementById('searchInput').value = null;
}