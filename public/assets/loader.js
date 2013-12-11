$(document).ready(function() {
	// pull the current data from the server, this process 
	// will most likely be wicked fast and unnoticable
	$("#current_song_title").html("Take a Walk");
	$("#current_song_artist").html("Passion Pit");
	$("#current_song_submit").html("~Gabbie");
	$("#current_song_image").attr("src","assets/passionpit.jpg");
	$("#playlist").html("");

	$("#current_song_image").load(function() {
		var marginTop = ($("#current").height());
		$("#playlist").css("margin-top", (marginTop)+"px");
		$("#search-button").css("height", 32+"px");
		$("#search-button").css("width", 64+"px");
		$("#search-body").css("top", $(window).height()+"px");
	});
	/*$("#playlist").scroll(function() {
  		if(!added) {
			$("#search-button").css("color", "#0099FF");
			$("#search-button").css("top", ($("#current").height())+"px");
			$("#search-body").css("height", ($(window).height()-($("#current").height()+$("#search-button").height()))+"px");
			$("#search-body").css("top", ($("#current").height()+$("#search-button").height())+"px");
		} else {
			$("#search-button").css("color", "#99CCFF");
			$("#search-button").css("top", ($(window).height()-$("#search-button").height())+"px");
			$("#search-body").css("top", ($(window).height())+"px");
		}
	});*/
	$('#search-input').on('input', function() {
    	search($('#search-input').val());
	});
	$("#search-button").click(OnClickAdd);

	reloadPlaylist();
});

var added = false;
function OnClickAdd() {
	if(!added) {
		// expand
		added=true;
		$("#search-button").css("color", "#0099FF");
		$("#search-button").css("top", ($("#current").height())+"px");
		$("#search-body").css("height", ($(window).height()-($("#current").height()+$("#search-button").height()))+"px");
		$("#search-body").css("top", ($("#current").height()+$("#search-button").height())+"px");
		$("#playlist").css("position","fixed");
		//$("#search-body").css("position","relative");
	} else {
		// unexpand
		added = false;
		$("#search-button").css("color", "#99CCFF");
		$("#search-button").css("top", ($(window).height()-$("#search-button").height())+"px");
		$("#search-body").css("top", ($(window).height())+"px");
		$("#playlist").css("position","relative");
		//$("#search-body").css("position","fixed");
	}
	
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
					$(this).css("background-color", "#1F2933");
					var obj = {
						"name" : name,
						"artist" : artist,
						"uri" : href
					};
					JSON.stringify(obj);
					$.post("http://"+document.host+"/queue?item="+obj);
				});
			}
		}
	});
}
function reloadPlaylist() {
	var artists = ["Kanye", "Miley Cyrus", "The Outfield"];
	var titles = ["Bound 2", "Wrecking Ball", "Your Love"];
	var albums = ["assets/album art2.jpg", "assets/album art3.jpg", "assets/album art4.jpg"];

	for(var i = 0; i < 50; i++) {
		var artist = artists[i];
		var title = titles[i];
		var album = albums[i];
		var block = "<div class=\"row song-row\" style=\"background-color:#111111; margin-right:-15px; padding:4px;\">" + 
				"<div class=\"col-xs-2 song-queue\" style=\"color:#EEEEEE;\">"+(i+1)+"</div>"+
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

