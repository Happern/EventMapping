function EventLayer(map) 
{
	this.map=map;
	this.mapLevel=0;
	this.list=new Array();
	this.colors={
		"entertainment":"#e47a36",
		"cultural":"#40b49d",
		"education":"#f1cb3f",
		"other":"#cccccc",
		};
}
EventLayer.prototype.init=function()
{
	_GLOBAL.socket.on('timelineSelectedValue', this.gotTimelineData);
	$("#datepicker-1").change(this.timeChanged);
	$("#datepicker-2").change(this.timeChanged);
}

EventLayer.prototype.setData=function(data)
{

	this.resetData();
	this.list=data;
	if(data==undefined) return;
	var i;
	var lat=41;
	var lng=29;
	var obj;
	var options;
	var marker;
	var markerDiv;
	
	
	for(i=0; i<this.list.length; i++)
	{
		//console.log(i, this.list[i]);
		this.list[i].attending=Math.random()*2+1;
		if(this.list[i].lat==0 || this.list[i].lng==0) continue;

		if (
			this.list[i].event_type == "Meetup" || 
			this.list[i].event_type == "Celebration" || 
			this.list[i].event_type == "Festival" ||
            this.list[i].event_type == "Party" || 
			this.list[i].event_type == "Concert" || 
			this.list[i].event_type == "Sports Event")
		{	
			this.list[i].type="entertainment";
		}
		else if (
			this.list[i].event_type == "Cinema" || 
			this.list[i].event_type == "Theater" || 
			this.list[i].event_type == "Show" ||
            this.list[i].event_type == "Exhibition")
		{
			this.list[i].type="cultural";
		}
		else if (
			this.list[i].event_type == "Conference" || 
			this.list[i].event_type == "Meeting" || 
			this.list[i].event_type == "Talk" ||
            this.list[i].event_type == "Workshop") 
		{
			this.list[i].type="education";
		}
		else
		{
			this.list[i].type="other";
		}
		this.list[i].icon=this.getIcon(this.list[i]);
		

		markerDiv = $("<div></div>");
		markerDiv.addClass('marker');
		markerDiv.addClass('markerPin');
		console.log(i, this.list[i].icon.url);
		markerDiv.css(
		
		{
			"background-image":"url("+this.list[i].icon.url+")",
			transform: "scale("+this.list[i].icon.scaledSize+","+ this.list[i].icon.scaledSize+")",
			"-webkit-transform": "scale("+this.list[i].icon.scaledSize+","+ this.list[i].icon.scaledSize+")",
			"-moz-transform": "scale("+this.list[i].icon.scaledSize+","+ this.list[i].icon.scaledSize+")",
			"-o-transform": "scale("+this.list[i].icon.scaledSize+","+ this.list[i].icon.scaledSize+")",
			"-ms-transform": "scale("+this.list[i].icon.scaledSize+","+ this.list[i].icon.scaledSize+")"
		});
		//console.log(markerDiv.css("background-image"));

		
		markerDiv.click(this.list[i], this.eventClicked);
		var obj=this.list[i];
		var content="<div class='eventInfo'><h1>"+obj.name+"</h1>";
		content+="<img class='thumb' style='background-image:url("+obj.photo+")'/>";
		content+="<div class='desc'>"+obj.description+"</div>";
		content+="<div class='venue'>"+obj.venue_name+"</div>";
		content+="<div class='start_time'>"+obj.start_time+"</div>";
		content+="</div>";
		
		// add marker to map
		marker=new mapboxgl.Marker(markerDiv[0])
			.setLngLat([this.list[i].lng, this.list[i].lat])
			.setPopup(new mapboxgl.Popup({ offset: 25 })
			.setHTML(content))
			.addTo(this.map);
		this.list[i].markerDiv=markerDiv;
		this.list[i].marker=marker;

	}
	

	this.applyFilter();
}


EventLayer.prototype.show=function()
{
	var i;
	this.applyFilter();
}
EventLayer.prototype.hide=function()
{
	$(".marker").hide();

}
EventLayer.prototype.resetData=function(data)
{
	var i;
	this.hide();
	for(i=0; i<this.list.length; i++)
	{
		if(this.list[i].marker==undefined)continue;
			this.list[i].marker.remove();
		
	}
	
}
EventLayer.prototype.getIcon=function(item)
{

		return this.getIconLevel0(item);

}
EventLayer.prototype.getIconLevel0=function(item)
{
	var r=item.attending*3;
	var path='M-'+r+',0a'+r+','+r+' 0 1,0 '+(r*2)+',0a'+r+','+r+' 0 1,0 -'+(r*2)+',0';
	var template = [
		'<?xml version="1.0" encoding="utf-8"?>',
		'<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">',
		//'<g transform="translate(200,200)">',
		//'<g transform="scale(20)">',
		'<path d="M15.9,32c0,0-9.9-14.1-9.9-20.1C6,0.1,15.9,0,15.9,0S26,0.1,26,11.9C26,18.1,15.9,32,15.9,32z" stroke="none"  fill="{{ color }}"/>',
		//'</g>',
		//'</g>',
		'</svg>'

	].join('\n');	
	var icon=
	{
		path: path,
		fillColor: this.colors[item.type],
		fillOpacity: 0.75,
		scale: 1,
		strokeColor: 'black',
		strokeWeight: 0
	};
	
	var svg = template.replace('{{ path }}', path);
	svg = svg.replace('{{ color }}', this.colors[item.type]);

	return { url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svg), scaledSize: 0.05 };
}

EventLayer.prototype.eventClicked=function(e, c)
{
	_GLOBAL.map.panTo(e.data.marker._lngLat);
}

EventLayer.prototype.applyFilter=function()
{
	var filter=_GLOBAL.event.getFilter();
	//console.log(filter);
	var i;
	var item;
	var ok;
	for(i=0; i<this.list.length; i++)
	{
		
		ok=true;
		item=this.list[i];
		if(item.marker==undefined) continue;
		if(filter.type.indexOf(item.event_type)<0) ok=false;
		//if(item.capacity<filter.crowd[0] || filter.crowd[1]<item.capacity) ok=false; // attending??
		if(filter.attending[0]!=1 || filter.attending[1]!=3)
			if(item.attending<filter.activity[0] || filter.activity[1]<item.attending) ok=false;
		
		if(filter.activity[0]!=1 || filter.activity[1]!=3)
			if(item.activity*2+1<filter.activity[0] || filter.activity[1]<item.activity*2+1) ok=false;
		
		if(filter.sound[0]!=1 || filter.sound[1]!=3)
			if(item.sound*2+1<filter.sound[0] || filter.sound[1]<item.sound*2+1) ok=false;
		
		if(filter.price[0]!=1 || filter.price[1]!=3)
			if(item.price/3<filter.price[0]-1 || filter.price[1]-1<item.price/3) ok=false;
			
		if(filter.crowd[0]!=1 || filter.crowd[1]!=3)
			if(item.people_density*2+1<filter.crowd[0] || filter.crowd[1]<item.people_density*2+1) ok=false;
		
		if(item.event_language!=undefined)
			if(item.event_language!=filter.lang) ok=false;
		
		//console.log(ok,item.price*2+1,"<" ,filter.price[0] , filter.price[1], "<", item.price*2+1, item.price	);
		//if(!ok) console.log(item);

		if(ok)
		{
		//	if(item.marker._map==null)
			item.markerDiv.show();
		}
		else 
		{
		//	if(item.marker._map!=null)
			item.markerDiv.hide();
		}
	}
}
EventLayer.prototype.getFilter=function()
{
	var type=new Array();
	$(".eventTypeFilter.selected").each(function(i, item){
		type.push($(item).attr("data-type"));
		});
	return {
		
		type:type,
		attending:$("#slider-range-1").slider("values"),
		crowd:$("#slider-range-5").slider("values"),
		sound:$("#slider-range-2").slider("values"),
		activity:$("#slider-range-3").slider("values"),
		price:$("#slider-range-4").slider("values"),
		lang:$(".eventLangButton.selected").attr("data-lang")
		};
}
EventLayer.prototype.gotTimelineData=function(data)
{
	//console.log("gotTimelineData", data);
	if(data.data==undefined) return;
	_GLOBAL.event.setData(data.data);
}
EventLayer.prototype.timeChanged=function()
{
	_GLOBAL.socket.emit("timelineSelected", {
		startDate: convertDate($("#datepicker-1").val()),
		endDate:  convertDate($("#datepicker-2").val())        //startDate and endDate should be received from the sliders
	});
}
EventLayer.prototype.updateMarkers=function()
{
	var i;
	var icon;
	for(i=0; i<this.list.length; i++)
	{
		if(this.list[i].markerDiv==undefined) continue;
		
		icon=this.getIcon(this.list[i]);
		this.list[i].markerDiv.css(
		
		{
			"background-image":"url("+icon.url+")",
			transform: "scale("+icon.scaledSize+","+ icon.scaledSize+")",
			"-webkit-transform": "scale("+icon.scaledSize+","+ icon.scaledSize+")",
			"-moz-transform": "scale("+icon.scaledSize+","+ icon.scaledSize+")",
			"-o-transform": "scale("+icon.scaledSize+","+ icon.scaledSize+")",
			"-ms-transform": "scale("+icon.scaledSize+","+ icon.scaledSize+")"
		});
	}
}