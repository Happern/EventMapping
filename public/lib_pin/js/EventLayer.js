function EventLayer(map) 
{
	this.map=map;
	
	this.list=new Array();
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

		if(this.list[i].lat==0 || this.list[i].lng==0) continue;

		if (this.list[i].event_type == "Meetup" || this.list[i].event_type == "Celebration" || this.list[i].event_type == "Festival" ||
                this.list[i].event_type == "Party" || this.list[i].event_type == "Concert" || this.list[i].event_type == "Sports Event")
			this.list[i].icon="/lib_pin/img/pin_event_entertainment.svg";
		else if (this.list[i].event_type == "Cinema" || this.list[i].event_type == "Theater" || this.list[i].event_type == "Show" ||
                this.list[i].event_type == "Exhibition")
			this.list[i].icon="/lib_pin/img/pin_event_cultural.svg";
		else if (this.list[i].event_type == "Conference" || this.list[i].event_type == "Meeting" || this.list[i].event_type == "Talk" ||
                this.list[i].event_type == "Workshop") 
			this.list[i].icon="/lib_pin/img/pin_event_education.svg";
		else
			this.list[i].icon="/lib_pin/img/pin_event_other.svg";
		
		options={
			position:new google.maps.LatLng(this.list[i].lat,this.list[i].lng),
			icon:this.list[i].icon,
			obj:this.list[i],
			layer:this
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
		if(ok) item.marker.setMap(this.map);
		else item.marker.setMap(null);
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