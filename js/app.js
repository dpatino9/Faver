$(document).ready(function(){

//VARIABLES: ==============================================================================================

	// var state = {
	// 	favorites: []
	// }

	var favoritesCount = 0;
	var database = firebase.database();



//INITIALIZE FIREBASE: ====================================================================================





//EBAY: ====================================================================================================

// Callback for finding items by keyword, creating a table of results
window._cb_findItemsByKeywords = function _cb_findItemsByKeywords(root) {
  var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
  var html = [];
  html.push('<table width="100%" border="0" cellspacing="0" cellpadding="3"><tbody>');
  for (var i = 0; i < items.length; ++i) {
    var item     = items[i];
    var title    = item.title;
    var pic      = item.galleryURL;
    var viewitem = item.viewItemURL;
    if (null != title && null != viewitem) {
      html.push('<tr><td>' + '<img src="' + pic + '" border="0">' + '</td>' + 
      '<td><a href="' + viewitem + '" target="_blank">' + title + '</a></td></tr>');
    }
  }
  html.push('</tbody></table>');
  document.getElementById("ebay-panel").innerHTML = html.join("");
};


function ebaySearch(searchTerm) {
	var urlfilter = "";
	var keyword = searchTerm;

	// Appending the API script to the document
	var url = "http://svcs.ebay.com/services/search/FindingService/v1";
	    url += "?OPERATION-NAME=findItemsByKeywords";
	    url += "&SERVICE-VERSION=1.0.0";
	    url += "&SECURITY-APPNAME=DanielMi-projecto-PRD-c2f55bc58-2a0828cd";
	    url += "&GLOBAL-ID=EBAY-US";
	    url += "&RESPONSE-DATA-FORMAT=JSON";
	    url += "&callback=_cb_findItemsByKeywords";
	    url += "&REST-PAYLOAD";
	    url += "&keywords=" + keyword;
	    url += "&paginationInput.entriesPerPage=10";
	    url += urlfilter;

	    s=document.createElement('script'); // create script element
	    s.src= url;
	    document.body.appendChild(s);
}





//AMAZON: =========================================================================================================
    var amazonUrl = "";
    var results = "";
    var totalResults = 10;
    var i = 0;
    var j = 10;
    function sha256(stringToSign, secretKey) {
      var hex = CryptoJS.HmacSHA256(stringToSign, secretKey);
      return hex.toString(CryptoJS.enc.Base64);
    } 

    function timestamp() {
        var date = new Date();
        var y = date.getUTCFullYear().toString();
        var m = (date.getUTCMonth() + 1).toString();
        var d = date.getUTCDate().toString();
        var h = date.getUTCHours().toString();
        var min = date.getUTCMinutes().toString();
        var s = date.getUTCSeconds().toString();

        if(m.length < 2) { m = "0" + m; }
        if(d.length < 2) { d = "0" + d; }
        if(h.length < 2) { h = "0" + h; }
        if(min.length < 2) { min = "0" + min; }
        if(s.length < 2) { s = "0" + s}

        var date = y + "-" + m + "-" + d;
        var time = h + ":" + min + ":" + s;
        return date + "T" + time + "Z";
    }

    function getAmazonItemInfo(keyword) {
        var PrivateKey = "/nmngLta6ifXG0RjOzoICN0cMqRlUp9m9LwlIrOj";
        var PublicKey = "AKIAIGNV6AJOIUYCURCA";
        var AssociateTag = "shopsmart093-20";

        var parameters = [];
        parameters.push("AWSAccessKeyId=" + PublicKey);
        parameters.push("SearchIndex=All");
        parameters.push("Keywords=" + encodeURIComponent(keyword));
        parameters.push("Operation=ItemSearch");
        parameters.push("ResponseGroup=Images%2CItemAttributes%2COffers");
        parameters.push("Service=AWSECommerceService");
        parameters.push("Timestamp=" + encodeURIComponent(timestamp()));
    	parameters.push("AssociateTag=" + AssociateTag);

        parameters.sort();
        var paramString = parameters.join('&');

        var signingKey = "GET\n" + "webservices.amazon.com\n" + "/onca/xml\n" + paramString
        console.log(signingKey);
        var signature = sha256(signingKey,PrivateKey);
            signature = encodeURIComponent(signature);

        amazonUrl =  "http://webservices.amazon.com/onca/xml?" + paramString + "&Signature=" + signature;
        console.log(amazonUrl);
    }
	function getData(amazonUrl) {
		var queryURL = "https://crossorigin.me/"+amazonUrl;
			$.ajax({url: queryURL, dataType: "xml", method: "GET"}).done(function(response) {
                results = response;
                displayData(results,i,j);
		});

	}

    function displayData(data,i,j) {
        $("#amazon-panel").empty();
        var carousel = $("<div class='carousel'>");
        for(i; i<j; i++) {
        	var carouselItem = $("<a class='carousel-item'><div class='card'>");
            carouselItem.append("<div class='card-image'><a href='"+$(data).find("DetailPageURL").eq(i).text()+"' target='_blank'><img src='"+$(data).find("MediumImage URL").eq(i).text()+"'>")
            carouselItem.append("<div class='card-content'><p>"+$(data).find("Title").eq(i).text()+"<p>"+$(data).find("FormattedPrice").eq(i).text())
            carousel.append(carouselItem);
        }
        $("#amazon-panel").append(carousel);
        $('.carousel').carousel({
            dist:0,
            shift:0,
            padding:20,
      	});
    }





//GENERAL FUNCTIONS: ==============================================================================================

// General function for opening modals
function openDisplay(id) {

	switch(id) {
		// case 'registration-modal': 
		// 	$('#registration-modal').openModal();
		// 	break;

		case 'favorites-modal':
			$('#favorites-modal').openModal();
			console.log("opening favorites modal");
			if ($("#search").val().trim().length !== 0) {
				addFavorite();
			}
			break;

		case 'shop-toggle':
			if ($("#search").val().trim().length == 0) {
				$(".direction-copy").addClass("red-text");
				$(".direction-copy").addClass("error-anim");
			} else {
				keyword = $('#search').val().trim();
				ebaySearch(keyword);
				getAmazonItemInfo(keyword);
				getData(amazonUrl);
				$(".shop-panels").removeClass("hidden");
				$(".direction-copy").removeClass("red-text");
				$(".direction-copy").removeClass("error-anim");
			}

		default:
			console.log('how did this happen!!');
	}
}

function addFavorite(){

	var favoritesAddition = $('#search').val().trim();
	var favoritesDelete = $("<button>");
	var favoritesItem = $("<p>");

	// assigning a number to this favorite item to make it easily identifiable. 
    favoritesItem.attr("id", "item-" + favoritesCount);
    favoritesItem.append(" " + favoritesAddition);

    favoritesDelete.attr("data-favorite", favoritesCount);
    favoritesDelete.addClass("close");
    favoritesDelete.append("X");

    favoritesItem = favoritesItem.prepend(favoritesDelete);

    $("#favorites-list").append(favoritesItem);


    // Clear the search box when done
    $("#search").val("");


    // Add to the favoritesCount
    favoritesCount++;
}


//EVENT LISTENERS: ========================================================================================

// Displays pop-over for username and password
$('#login').webuiPopover({url:'#login-form'});


// Opens My Favorites modal with search item
$('#favorites-toggle').on('click', function() {
	console.log("clicking")
	openDisplay("favorites-modal");
});


// Removes items from My Favorites list
$(document.body).on('click', '.close', function(){
    var favoriteNumber = $(this).data("favorite");
    $("#item-" + favoriteNumber).empty();
});


// Displays shop panels div
// $("#shop-toggle").on('click', function() {
// 	console.log("opening shop toggle");
// 	openDisplay("shop-toggle");
// 	$("#search").val("");

// });

// $("#search-bar").on('submit', function() {
// 	openDisplay("shop-panels");
// 	$("#search").val("");
// });








}) // END OF DOCUMENT READY FUNCTION
