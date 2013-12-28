$(document).ready(function() {
	// set up search callbacks
	$('#search-input').on('input', function() {
    	search($('#search-input').val());
	});
	$("#search-button").click(OnClickAdd);
	$( window ).resize(function() {
  		//InitializeLayouts();
  		//LayoutSearch();
	});
	// set up initial layouts
	InitializeLayouts();

	// load the current playlist
	
	loaded();
});
function InitializeLayouts() {
	var width = $(window).width()
	var height = $(window).height();
	if(height > width) {
		$("#current").css("height", (width/2)+"px");
		$("#current").css("width", (width)+"px");
		$("#current-song-image").css("height", (width/2)+"px");
		$("#current-song-image").css("width", (width/2)+"px");
		$("#current-song-image").css("padding", "16px");
		$("#current-info").css("height", (width/2)+"px");
		$("#current-info").css("width", (width/2)+"px");
		$("#current-info").css("padding", "16px");
		$("#rating").css("top", (width/2)+"px");
	} else {
		$("#current").css("height", (width/8)+"px");
		$("#current").css("width", (width)+"px");
		$("#current-song-image").css("height", (width/8)+"px");
		$("#current-song-image").css("width", (width/8)+"px");
		$("#current-song-image").css("padding", "16px");
		$("#current-info").css("height", (width/8)+"px");
		$("#current-info").css("width", (width/2)+"px");
		$("#current-info").css("padding", "16px");
		$("#rating").css("top", (width/8)+"px");
	}
	var marginTop = ($("#current").height());
	$("#playlist").css("margin-top", marginTop+"px");
	$("#search-button").css("margin-top", (marginTop+4)+"px");
	$("#search-body").css("height", ($(window).height()-($("#current").height()+$("#search-button").height()))+"px");
}
var uriList;
var newUriList;
var loadedBlocks;
// load the data from the server. one array has the data to be added to html, the other has the unique uri links
// when you first launch the app, load everything then dump all the blocks to html
// after that every second, load the data then check the uri list to the old list. and differences are added to the html
var loadedData;
function loaded() {
	$.get(document.location.protocol+"//"+document.location.host+"/queue", function( data ) {
		loadedData = data;
		if(uriList == undefined) {
			$("#playlist").html("");
			var text = loadPlaylist();
			$("#playlist").append(text);
		} else {
			loadPlaylist();
			var l = uriList.length;
			console.log(l+", "+newUriList.length);
			if(l > newUriList.length) {
				l = newUriList.length;
			} else if(l == newUriList.length) {
				setTimeout(loaded, 3000);
				return;
			}
			// gonna need some special casses for i = 0 the current song

			for(var i = 1; i < l; i++) {
				var loadedUri = newUriList[i];
				var currentUri = uriList[i];
				console.log("lu = "+loadedUri+", cu = "+currentUri);
				if(loadedUri != currentUri) {
					$("#"+i).html(loadedBlocks(i));
				}
			}
			l = uriList.length;
			if(l > newUriList.length) {
				// more in current list than loaded one
				var difference = l-newUriList.length;
				for(var i = difference; i<l; i++) {
					$("#"+i).remove();
				}
			} else if(l < newUriList.length) {
				l = newUriList.length;
				var difference = l-uriList.length;
				for(var i = uriList.length; i<l; i++) {
					$("#playlist").append(loadedBlocks[i]);
				}
			}
		}
		uriList = newUriList;
		setTimeout(loaded, 3000);
	});

}

var added = false;
function OnClickAdd() {
	if(!added) {
		// expand
		added=true;
	} else {
		// unexpand
		added = false;
	}
	LayoutSearch();
}
function LayoutSearch() {
	var marginTop = ($("#current").height());
	
	if(added) {
		// expand
		$("#search-button").css("margin-top", "0px");
		$("#search-button").css("color", "#0099FF");
		$("#search-body").css("top", 0+"px");
		$("#search-body").css("height",  ($(window).height()-$("#search-button").height())+"px");
		$("#search-body").css("min-height",  ($(window).height()-$("#search-button").height())+"px");
		$("#playlist").css("position","fixed");
		$("#search-content").css("position","relative");
		$("#search-body").css("margin-top", ($("#search-button").height())+"px");
		$("#search-body").css("position","relative");
		//$("#search-content").css("overflow-y","visible");
		$("#search-body").css("visibility","visible");
		$("#search-input").css("visibility","visible");
		$("#search-input").val("");
		$("#search-input").focus();
		$("#search-content").html("");
		//$("#current").css("visibility","hidden");
		//$("#rating").css("visibility","hidden");
		//$("#search-body").css("position","relative");
	} else {
		// unexpand
		$("#search-button").css("margin-top", (marginTop+4)+"px"); // the 4 is because the height of the ratings bar is 4 px
		$("#search-button").css("color", "#99CCFF");
		$("#search-body").css("top", ($(window).height())+"px");
		$("#playlist").css("position","relative");
		$("#search-content").css("position","fixed");
		$("#search-body").css("position","fixed");
		$("#search-body").css("visibility","hidden");
		$("#search-input").css("visibility","hidden");
		//$("#current").css("visibility","visible");
		//$("#rating").css("visibility","visible");
		//$("#search-input").val("");
		//$("#search-content").html("");
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
		var count = 0;
		for(var i = 0; i < tracks[0].length; i++) {
			if(tracks[i]!==undefined) {
				count+=1;
				var href = tracks[i].href;
				var name = tracks[i].name;
				var artist = tracks[i].artists[0].name;
				var add = "<p id=\"s"+i+"\" class=\"search-item\" style=\"height:24px;\">"+tracks[i].name+", "+tracks[i].artists[0].name+"</p>"
				$("#search-content").append(add);
				$("#s"+i).click(function() {
					var i = $(this).attr('id').substring(1);
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
		$("#search-body").css("height", "auto");
	});
}
function loadPlaylist() {
	
	if(loadedData==undefined || loadedData.length <= 0) {
		InitializeLayouts();
		return;
	}
	var workableData = JSON.parse(loadedData[0]);
	$("#current-song-title").html(workableData.artist);
	$("#current-song-artist").html(workableData.name);
	$("#current-song-submit").html("~Anonymous");
	$.ajax({
        url: "https://embed.spotify.com/oembed/?url="+workableData.uri+"&callback=?nope",
        type: 'GET',
        dataType: 'jsonp',
        error: function(xhr, status, error) {
               
        },
        success: function(data) {
            $("#current-song-image").attr("src",data.thumbnail_url);
			$("#current-song-image").load(function() {
				InitializeLayouts();
			});
        }
    });
	
	var totalList = "";
	newUriList = new Array();
	loadedBlocks = new Array();

	for(var i = 1; i < loadedData.length; i++) {
		workableData = JSON.parse(loadedData[i]);
		var block = getPlaylistBlock(workableData, i);
		loadedBlocks.push(block);
		totalList+=block;	
	}
	return totalList;
}
function getPlaylistBlock(jsonData, i) {
	var artist = jsonData.artist;
	var title = jsonData.name;
	newUriList.push(jsonData.uri);
	var album = undefined;
	var block = "	<div id=\"+i+\" class=\"song-row\">"+ 
						"<div class=\"song-queue\">"+i+"</div>"+
						"<div style=\"background-color: #211637; width:90%; margin-left:10%;height:100%;padding:6px;\">"+
						"<div class=\"song-album\">"+
							"<img id=\"album-"+i+"\" src=\"undefined\" class=\"img-rounded albumcover\">"+
						"</div>"+
						"<div class=\"song-details\">"+
							"<div classs\"song-title\">"+
								"<b>"+title+"</b>"+
							"</div>"+
							"<div class=\"song-artist\">"+
								artist+
							"</div>"+

						"<div style=\"clear:both\"></div>"+
						"</div>"+
						"</div>"+
						"<div style=\"width:95%; margin-left:5%; margin-top:8px; background-color:#444444; border-top-left-radius:2px;border-bottom-left-radius:2px; height:2px;\"></div>"+
					"</div>";
	$.ajax({
        url: "https://embed.spotify.com/oembed/?url="+jsonData.uri+"&callback=?nope",
        type: 'GET',
        dataType: 'jsonp',
        error: function(xhr, status, error) {
               
        },
        success: function(data) {
            $("#album-"+i).attr("src",data.thumbnail_url);
			$("#album-"+i).load(function() {
				InitializeLayouts();
			});
        }
    });
	return block;
}
