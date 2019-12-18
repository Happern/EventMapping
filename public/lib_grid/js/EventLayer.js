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
	this.infowindow = new google.maps.InfoWindow({content: "", maxWidth:500, width:500});
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
	
	
	for(i=0; i<this.list.length; i++)
	{
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
		
		options={
			position:new google.maps.LatLng(this.list[i].lat,this.list[i].lng),
			icon:this.list[i].icon,
			obj:this.list[i],
			layer:this,
			optimized:false
			};
		this.list[i].marker=new google.maps.Marker(options);
        this.list[i].eventListener=this.list[i].marker.addListener('click', this.eventClicked);

	}
	

	this.applyFilter();
}
EventLayer.prototype.resetData=function(data)
{
	var i;
	this.hide();
	for(i=0; i<this.list.length; i++)
	{
		if(this.list[i].marker==undefined)continue;
			google.maps.event.clearListeners(map, this.list[i].eventListener);
		
	}
	
}

EventLayer.prototype.show=function()
{
	var i;
	this.applyFilter();
}
EventLayer.prototype.hide=function()
{
	var i;
	for(i=0; i<this.list.length; i++)
	{
		if(this.list[i].marker!=undefined)
		this.list[i].marker.setMap(null);
	}
}
EventLayer.prototype.eventClicked=function(e, c)
{
	var content="<div class='eventInfo'><h1>"+this.obj.name+"</h1>";
	content+="<img class='thumb' style='background-image:url("+this.obj.photo+")'/>";
	content+="<div class='desc'>"+this.obj.description+"</div>";
	content+="<div class='venue'>"+this.obj.venue_name+"</div>";
	content+="<div class='start_time'>"+this.obj.start_time+"</div>";
	content+="</div>";
	this.layer.infowindow.setContent(content);
	this.layer.infowindow.open(this.layer.map, this.obj.marker);
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
			if(item.marker.map==null)
			item.marker.setMap(this.map);
		}
		else 
		{
			if(item.marker.map!=null)
			item.marker.setMap(null);
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
	for(i=0; i<this.list.length; i++)
	{
		if(this.list[i].marker==undefined) continue;
		this.list[i].marker.setIcon(this.getIcon(this.list[i]));
	}
}
EventLayer.prototype.getIcon=function(item)
{
	if(this.mapLevel==0)
		return this.getIconLevel0(item);
	else if(this.mapLevel==1)
		return this.getIconLevel1(item);
	else if(this.mapLevel==2)
		return this.getIconLevel2(item);
}
EventLayer.prototype.getIconLevel0=function(item)
{
	var r=item.attending*3;
	var path='M-'+r+',0a'+r+','+r+' 0 1,0 '+(r*2)+',0a'+r+','+r+' 0 1,0 -'+(r*2)+',0';
	var icon=
	{
		path: path,
		fillColor: this.colors[item.type],
		fillOpacity: 0.75,
		scale: 1,
		strokeColor: 'black',
		strokeWeight: 0
	};
	return icon;
}
EventLayer.prototype.getIconLevel1=function(item)
{
	var r0=20+item.attending*40;
	var r1=r0*item.people_density;
	var template = [
		'<?xml version="1.0"?>',
		'<svg width="400px" height="400px" version="1.1" xmlns="http://www.w3.org/2000/svg">',	// viewBox="0 0 250 250" 
		'<g transform="translate(10,10)">',
		'<g transform="scale(1.5)">',
		'<circle fill="{{ color }}" cx="125" cy="125" r="'+r1+'" style="fill-opacity:0.4"/>',
		'<circle fill="{{ color }}" cx="125" cy="125" r="'+r0+'" style="fill-opacity:0.5"/>',
		'</g>',
		'</g>',
		'</svg>'

	].join('\n');
	var svg = template.replace('{{ color }}', this.colors[item.type]);
	svg = svg.replace('{{ color }}', this.colors[item.type]);

	 //return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new google.maps.Size(20, 20) };
	 return { url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svg), scaledSize: new google.maps.Size(40, 40) };
}
EventLayer.prototype.getIconLevel2=function(item)
{
	var r1=7+7*item.people_density;
	var template =['<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve"><g transform="translate(0,0)"><g transform="scale(1)"><circle opacity="0.4" fill="{{ color }}" cx="14.805" cy="15.112" r="12"/><circle opacity="0.5" fill="{{ color }}" cx="14.805" cy="15.112" r="{{ r1 }}"/></g></g></svg>'].join('\n');
	
	if(item.sound>=0.5 && item.activity<0.5) 
	{
		template=['<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve"><g transform="translate(0,0)"><g transform="scale(1)"><circle opacity="1" fill="none" stroke-width="0.5" stroke="{{ color }}" cx="14.805" cy="15.112" r="14"/><circle opacity="0.4" fill="{{ color }}" cx="14.805" cy="15.112" r="12"/><circle opacity="0.5" fill="{{ color }}" cx="14.805" cy="15.112" r="{{ r1 }}"/></g></g></svg>'].join('\n');
	}
	else if(item.sound>=0.5 && item.activity>=0.5)
	{
	
	template =['<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve"><g transform="translate(0,0)"><g transform="scale(1)">	<g opacity="0.3">		<path fill="{{ color }}" d="M13.664,3.162c0.627-0.267,1.653-0.267,2.281,0c0.627,0.267,1.698,0.48,2.38,0.474			c0.681-0.007,1.629,0.386,2.106,0.873s1.386,1.093,2.018,1.348c0.632,0.254,1.358,0.98,1.612,1.612			c0.255,0.632,0.861,1.54,1.348,2.017c0.487,0.477,0.88,1.425,0.873,2.107s0.207,1.752,0.474,2.379s0.267,1.653,0,2.281			c-0.267,0.627-0.48,1.698-0.474,2.38c0.007,0.682-0.386,1.63-0.873,2.107c-0.486,0.477-1.093,1.385-1.348,2.017			c-0.254,0.632-0.98,1.357-1.612,1.612s-1.54,0.861-2.018,1.348s-1.426,0.879-2.106,0.873c-0.682-0.006-1.753,0.207-2.38,0.473			c-0.627,0.267-1.654,0.267-2.281,0s-1.698-0.479-2.379-0.473c-0.682,0.007-1.63-0.386-2.107-0.873			C8.7,25.23,7.792,24.624,7.16,24.369c-0.632-0.255-1.358-0.98-1.613-1.612c-0.255-0.632-0.861-1.54-1.348-2.017			c-0.486-0.477-0.879-1.425-0.872-2.107c0.006-0.682-0.207-1.753-0.474-2.38c-0.267-0.627-0.267-1.654,0-2.281			c0.267-0.627,0.48-1.698,0.474-2.379c-0.007-0.682,0.386-1.63,0.872-2.107c0.487-0.477,1.093-1.385,1.348-2.017			s0.98-1.358,1.613-1.612C7.792,5.602,8.7,4.995,9.177,4.508c0.478-0.487,1.426-0.879,2.107-0.873			C11.966,3.642,13.037,3.429,13.664,3.162z"/>		<path fill="none" stroke="{{ color }}" stroke-miterlimit="10" d="M13.664,3.162c0.627-0.267,1.653-0.267,2.281,0			c0.627,0.267,1.698,0.48,2.38,0.474c0.681-0.007,1.629,0.386,2.106,0.873s1.386,1.093,2.018,1.348			c0.632,0.254,1.358,0.98,1.612,1.612c0.255,0.632,0.861,1.54,1.348,2.017c0.487,0.477,0.88,1.425,0.873,2.107			s0.207,1.752,0.474,2.379s0.267,1.653,0,2.281c-0.267,0.627-0.48,1.698-0.474,2.38c0.007,0.682-0.386,1.63-0.873,2.107			c-0.486,0.477-1.093,1.385-1.348,2.017c-0.254,0.632-0.98,1.357-1.612,1.612s-1.54,0.861-2.018,1.348s-1.426,0.879-2.106,0.873			c-0.682-0.006-1.753,0.207-2.38,0.473c-0.627,0.267-1.654,0.267-2.281,0s-1.698-0.479-2.379-0.473			c-0.682,0.007-1.63-0.386-2.107-0.873C8.7,25.23,7.792,24.624,7.16,24.369c-0.632-0.255-1.358-0.98-1.613-1.612			c-0.255-0.632-0.861-1.54-1.348-2.017c-0.486-0.477-0.879-1.425-0.872-2.107c0.006-0.682-0.207-1.753-0.474-2.38			c-0.267-0.627-0.267-1.654,0-2.281c0.267-0.627,0.48-1.698,0.474-2.379c-0.007-0.682,0.386-1.63,0.872-2.107			c0.487-0.477,1.093-1.385,1.348-2.017s0.98-1.358,1.613-1.612C7.792,5.602,8.7,4.995,9.177,4.508			c0.478-0.487,1.426-0.879,2.107-0.873C11.966,3.642,13.037,3.429,13.664,3.162z"/>	</g>	<g>		<path fill="none" stroke="{{ color }}" stroke-width="0.75" stroke-miterlimit="10" d="M13.512,1.568c0.71-0.302,1.874-0.302,2.585,0			c0.711,0.303,1.925,0.544,2.697,0.537c0.772-0.008,1.847,0.438,2.388,0.989s1.569,1.239,2.286,1.528			c0.717,0.289,1.539,1.111,1.827,1.828c0.289,0.716,0.977,1.745,1.527,2.286c0.552,0.541,0.997,1.615,0.989,2.388			s0.234,1.986,0.536,2.697c0.303,0.71,0.303,1.874,0,2.585c-0.302,0.711-0.544,1.924-0.536,2.697s-0.438,1.847-0.989,2.388			c-0.551,0.541-1.238,1.569-1.527,2.286c-0.288,0.717-1.11,1.539-1.827,1.828c-0.717,0.289-1.745,0.976-2.286,1.527			c-0.541,0.552-1.615,0.997-2.388,0.989c-0.772-0.007-1.986,0.234-2.697,0.537s-1.875,0.302-2.585,0			c-0.711-0.302-1.924-0.544-2.697-0.537c-0.772,0.008-1.847-0.438-2.388-0.989c-0.541-0.551-1.57-1.239-2.286-1.527			c-0.716-0.289-1.539-1.111-1.828-1.828c-0.289-0.716-0.977-1.745-1.528-2.286c-0.551-0.541-0.996-1.615-0.989-2.388			s-0.234-1.986-0.537-2.697c-0.302-0.711-0.302-1.875,0-2.585c0.303-0.711,0.544-1.924,0.537-2.697s0.438-1.847,0.989-2.388			c0.552-0.541,1.239-1.57,1.528-2.286c0.289-0.716,1.111-1.539,1.828-1.828c0.716-0.289,1.745-0.977,2.286-1.528			s1.615-0.997,2.388-0.989C11.587,2.113,12.801,1.871,13.512,1.568z"/>	</g>	<circle opacity="0.5" fill="{{ color }}" cx="14.805" cy="15.112" r="{{ r1 }}"/></g></g></svg>'].join('\n');
	}
	else if(item.sound<0.5 && item.activity>=0.5)
	{
	
	template =['<?xml version="1.0" encoding="utf-8"?><svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"	 width="30px" height="30px" viewBox="0 0 30 30" enable-background="new 0 0 30 30" xml:space="preserve"><g transform="translate(0,0)"><g transform="scale(1)">	<g opacity="0.3">		<path fill="{{ color }}" d="M13.664,3.162c0.627-0.267,1.653-0.267,2.281,0c0.627,0.267,1.698,0.48,2.38,0.474			c0.681-0.007,1.629,0.386,2.106,0.873s1.386,1.093,2.018,1.348c0.632,0.254,1.358,0.98,1.612,1.612			c0.255,0.632,0.861,1.54,1.348,2.017c0.487,0.477,0.88,1.425,0.873,2.107s0.207,1.752,0.474,2.379s0.267,1.653,0,2.281			c-0.267,0.627-0.48,1.698-0.474,2.38c0.007,0.682-0.386,1.63-0.873,2.107c-0.486,0.477-1.093,1.385-1.348,2.017			c-0.254,0.632-0.98,1.357-1.612,1.612s-1.54,0.861-2.018,1.348s-1.426,0.879-2.106,0.873c-0.682-0.006-1.753,0.207-2.38,0.473			c-0.627,0.267-1.654,0.267-2.281,0s-1.698-0.479-2.379-0.473c-0.682,0.007-1.63-0.386-2.107-0.873			C8.7,25.23,7.792,24.624,7.16,24.369c-0.632-0.255-1.358-0.98-1.613-1.612c-0.255-0.632-0.861-1.54-1.348-2.017			c-0.486-0.477-0.879-1.425-0.872-2.107c0.006-0.682-0.207-1.753-0.474-2.38c-0.267-0.627-0.267-1.654,0-2.281			c0.267-0.627,0.48-1.698,0.474-2.379c-0.007-0.682,0.386-1.63,0.872-2.107c0.487-0.477,1.093-1.385,1.348-2.017			s0.98-1.358,1.613-1.612C7.792,5.602,8.7,4.995,9.177,4.508c0.478-0.487,1.426-0.879,2.107-0.873			C11.966,3.642,13.037,3.429,13.664,3.162z"/>			</g>	<circle opacity="0.5" fill="{{ color }}" cx="14.805" cy="15.112" r="{{ r1 }}"/></g></g></svg>'].join('\n');
	}
	var svg = template.replace('{{ color }}', this.colors[item.type]);
	svg = svg.replace('{{ color }}', this.colors[item.type]);
	svg = svg.replace('{{ color }}', this.colors[item.type]);
	svg = svg.replace('{{ color }}', this.colors[item.type]);
	svg = svg.replace('{{ r1 }}', r1);

	 //return { url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg), scaledSize: new google.maps.Size(20, 20) };
	 return { url: 'data:image/svg+xml;charset=UTF-8;base64,' + btoa(svg), scaledSize: new google.maps.Size(70, 70) };
}