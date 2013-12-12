$(document).ready(function() {
	$('#search-input').on('input', function() {
    	search($('#search-input').val());
	});
	$("#search-button").click(OnClickAdd);
	
	loaded();
});
var loadedData;
function loaded() {
	$.get(document.location.protocol+"//"+document.location.host+"/queue", function( data ) {
		loadedData = data;
		
		reloadPlaylist();
	});
}

var added = false;
function OnClickAdd() {
	if(!added) {
		// expand
		added=true;
		$("#search-button").css("color", "#0099FF");
		$("#search-body").css("height", ($(window).height()-($("#current").height()+$("#search-button").height()))+"px");
		$("#search-body").css("top", ($("#current").height()+$("#search-button").height())+"px");
		$("#playlist").css("position","fixed");
		$("#search-content").css("position","relative");
		$("#search-content").css("overflow-y","visible");
		$("#search-body").css("visibility","visible");
		$("#search-input").css("visibility","visible");
		$("#search-input").focus();
		$("#search-content").html("");
		//$("#search-body").css("position","relative");
	} else {
		// unexpand
		added = false;
		$("#search-button").css("color", "#99CCFF");
		$("#search-body").css("top", ($(window).height())+"px");
		$("#playlist").css("position","relative");
		$("#search-content").css("position","fixed");
		$("#search-body").css("visibility","hidden");
		$("#search-input").css("visibility","hidden");
		$("#search-input").val("");
		$("#search-content").html("");
		//$("#search-body").css("position","fixed");
	}
	var marginTop = ($("#current").height());
	$("#search-button").css("margin-top", marginTop+"px");
}
var tracks;
function search(text) {
	$.get("https://ws.spotify.com/search/1/track.json?q="+text, function( data ) {
		var results = data.info.num_results;
		tracks = data.tracks;
		$("#search-content").html("");
		if(tracks.length <= 0) {
			return;
		}
		for(var i = 0; i < tracks[0].length; i++) {
			if(tracks[i]!==undefined) {
				var href = tracks[i].href;
				var name = tracks[i].name;
				var artist = tracks[i].artists[0].name;
				var add = "<p id=\""+i+"\" class=\"search-item\" style=\"height:24px;\">"+tracks[i].name+", "+tracks[i].artists[0].name+"</p>"
				$("#search-content").append(add);
				$("#"+i).click(function() {
					var i = $(this).attr('id');
					$(this).css("background-color", "#1F2933");
					console.log(tracks[i].name);
					var obj = {
						"name" :  encodeURIComponent(tracks[i].name),
						"artist" :  encodeURIComponent(tracks[i].artists[0].name),
						"uri" :  encodeURIComponent(tracks[i].href)
					};
					obj = JSON.stringify(obj);
					console.log(obj.name);
					$.post(document.location.protocol+"//"+document.location.host+"/queue?item="+obj);
					loaded();
					OnClickAdd();
				});
			}
		}
	});
}
function reloadPlaylist() {
	
	if(loadedData==undefined || loadedData.length <= 0) {
		var marginTop = ($("#current").height());
		$("#playlist").css("margin-top", (marginTop)+"px");
		$("#search-button").css("height", 32+"px");
		$("#search-button").css("width", 64+"px");
		$("#search-body").css("top", $(window).height()+"px");
		return;
	}
	var workableData = JSON.parse(loadedData[0]);
	$("#current_song_title").html(workableData.artist);
	$("#current_song_artist").html(workableData.name);
	$("#current_song_submit").html("~Anonymouse");
	$("#current_song_image").attr("src","assets/album art2.jpg");
	$("#current_song_image").load(function() {
		var marginTop = ($("#current").height());
		$("#playlist").css("margin-top", (marginTop)+"px");
		$("#search-button").css("height", 32+"px");
		$("#search-button").css("width", 64+"px");
		$("#search-button").css("margin-top", marginTop+"px");
		$("#search-body").css("top", $(window).height()+"px");
	});
	$("#playlist").html("");
	for(var i = 1; i < loadedData.length; i++) {
		console.log(loadedData[i]);
		workableData = JSON.parse(loadedData[i]);
		var artist = workableData.artist;
		var title = workableData.name;
		var album = undefined;
		var block = "<div class=\"row song-row\" style=\"background-color:#111111; margin-right:-15px; padding:4px;\">" + 
				"<div class=\"col-xs-2 song-queue\" style=\"color:#EEEEEE;\">"+(i)+"</div>"+
				"<div class=\"col-xs-10\" >"+	
					"<div class=\"row queuerow\" style=\"border-radius:5px; margin-right:-15px; padding:4px;\">"+
						"<div class=\"col-xs-4\" style=\"color:#DDDDDD;\">"+
							"<img src=\""+album+"\" class=\"img-rounded albumcover\">"+
						"</div>"+
						"<div class=\"col-xs-8\" style=\"color:#DDDDDD; text-	align:center;\">"+				
							"<div class=\"row\" style=\"margin-right:-15px;\">"+
								"<div class=\"col-xs-12 song-title\" style=\"	color:#DDDDDD;\">"+
									"<b>"+title+"</b>"+
								"</div>"+
							"</div>"+
							"<div class=\"row\" style=\"margin-right:-15px;\">"+
								"<div class=\"col-xs-12 song-artist\" style=\"color:#DDDDDD;\">"+artist+
								"</div>"+
							"</div>"+
						"</div>"+
					"</div>"+
				"</div>"+
			"</div>";
		$("#playlist").append(block);
	}

}

