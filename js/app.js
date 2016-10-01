
//VARIABLES: ==============================================================================================

	// var state = {
	// 	favorites: []
	// }

	var favoritesCount = 0;
	var database = firebase.database();
    var itemName = "";
    var itemNo = 0;

//INITIALIZE FIREBASE: ====================================================================================





//EBAY: ====================================================================================================
var ebayResults = "";
// Callback for finding items by keyword, creating a table of results
// window._cb_findItemsByKeywords = 
function ebayParse(root) {
	var items = root.findItemsByKeywordsResponse[0].searchResult[0].item || [];
    $("#ebay-panel").empty();
    $("#ebay-panel").append($("<div class='shop-panel__header valign center-block'><img src='assets/images/ebaylogo.svg' /></div>"))
    var carousel = $("<div class='carousel shop-carousel'>");
	for (var i = 0; i < items.length; ++i) {
		var item     = items[i];
		var title    = item.title;
		var pic      = "https://crossorigin.me/"+item.galleryURL;
		var viewitem = item.viewItemURL;

		if (null != title && null != viewitem) {
        	var carouselItem = $("<a class='carousel-item'>");
        	var carouselCard = $("<div class='card hoverable'>");
            carouselCard.append("<div class='card-image'><a href='"+viewitem+"' target='_blank'><img class='responsive-img' src='"+pic+"'>")
            carouselCard.append("<div class='card-content'><a href='"+viewitem+"' target='_blank'><p>"+title+"<p>$"+item.sellingStatus[0].currentPrice[0].__value__+"<div class='fixed-action-btn add-ebay' style='bottom: 135px; right: 14px;'><a class='btn-floating btn-small pink'><i class='large material-icons'>mode_edit")
        	carouselItem.append(carouselCard);
            carousel.append(carouselItem);
		}
	}

	$("#ebay-panel").append(carousel);
	$('.carousel').carousel({
	    dist:0,
	    shift:0,
	    padding:20,
	});
  // html.push('</tbody></table>');
  // document.getElementById("ebay-panel").innerHTML = html.join("");
};


function ebaySearch(searchTerm, ebayParse) {
	var urlfilter = "";
	var keyword = searchTerm;

	// Appending the API script to the document
	var url = "https://crossorigin.me/http://svcs.ebay.com/services/search/FindingService/v1";
	    url += "?OPERATION-NAME=findItemsByKeywords";
	    url += "&SERVICE-VERSION=1.0.0";
	    url += "&SECURITY-APPNAME=DanielMi-projecto-PRD-c2f55bc58-2a0828cd";
	    url += "&GLOBAL-ID=EBAY-US";
	    url += "&RESPONSE-DATA-FORMAT=JSON";
	    url += "&REST-PAYLOAD";
	    url += "&keywords=" + keyword;
	    url += "&paginationInput.entriesPerPage=10";
	    url += urlfilter;

            $.ajax({url: url, method: "GET"}).done(function(response) {
                ebayResults = response;
                ebayParse(JSON.parse(response));
        });
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
    function displayData(data,i,j) {
        $("#amazon-panel").empty();
        $("#amazon-panel").append($("<div class='shop-panel__header valign center-block'><img src='assets/images/amazonlogo.svg' /></div>"))
        var carousel = $("<div class='carousel shop-carousel'>");
        for(i; i<j; i++) {
        	var carouselItem = $("<a class='carousel-item'>");
        	var carouselCard = $("<div class='card hoverable'>");
            carouselCard.append("<div class='card-image'><a href='"+$(data).find("DetailPageURL").eq(i).text()+"' target='_blank'><img src='https://crossorigin.me/"+$(data).find("MediumImage URL").eq(i).text()+"'>")
            carouselCard.append("<div class='card-content'><a href='"+$(data).find("DetailPageURL").eq(i).text()+"' target='_blank'><p id='item-name'>"+$(data).find("Title").eq(i).text()+"<p>"+$(data).find("FormattedPrice").eq(i).text()+"<div class='fixed-action-btn add-amazon' data-itemno='"+i+"'style='bottom: 135px; right: 13px;'><a class='btn-floating btn-small pink'><i class='large material-icons'>mode_edit");
        	carouselItem.append(carouselCard);
            carousel.append(carouselItem);
        }

        $("#amazon-panel").append(carousel);
        $('.carousel').carousel({
            dist:0,
            shift:0,
            padding:20,
      	});
    }
    function getData(amazonUrl, displayData) {
        var queryURL = "https://crossorigin.me/"+amazonUrl;
            $.ajax({url: queryURL, dataType: "xml", method: "GET"}).done(function(response) {
                results = response;
                displayData(results,i,j);
        });

    }

    function getAmazonItemInfo(keyword, getData) {
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
        getData(amazonUrl, displayData);
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
			// if ($("#search").val().trim().length !== 0) {
			// 	addFavorite();
			// }
			break;

		case 'submit-button':
			if ($("#search").val().trim().length == 0) {
				$(".direction-copy").addClass("red-text");
				$(".direction-copy").addClass("error-anim");
			} else {
                var searchterm = $('#search').val().trim();
                ebaySearch(searchterm, ebayParse);
                getAmazonItemInfo(searchterm, getData);
                $("#shop-panels").removeClass("hidden");
                $(".direction-copy").removeClass("red-text");
                $(".direction-copy").removeClass("error-anim");
                addMarkers();
               google.maps.event.trigger(map, 'resize');
			}
            break;
        case 'add-items':
            $('#add-items').openModal();
            console.log("opening add items modal");
            break;

		default:
			console.log('how did this happen!!');
	}
}

function addFavorite(){

	// var favoritesAddition = $('#search').val().trim();
	var favoritesDelete = $("<button>");
	var favoritesItem = $("<a href='#!' class='collection-item'>");

	// assigning a number to this favorite item to make it easily identifiable. 
    favoritesItem.attr("id", "item-" + favoritesCount);
    favoritesItem.append(" " + itemName);
    favoritesItem.append("<button id='add-item' data-itemno='"+itemNo+"'>Add Item");

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
$(document).ready(function(){


//EVENT LISTENERS: ========================================================================================

// Displays pop-over for username and password
$('#login').webuiPopover({url:'#login-form'});

// Opens My Favorites modal with search item
$('#favorites-click').on('click', function() {
	console.log("clicking")
	openDisplay("favorites-modal");
});


// Removes items from My Favorites list
$(document.body).on('click', '.close', function(){
    var favoriteNumber = $(this).data("favorite");
    $("#item-" + favoriteNumber).empty();
});




$("#search-bar").on('submit', function() {
    openDisplay("submit-button");

});

$(document).on("click", ".add-amazon", function() {
    openDisplay("favorites-modal");
    itemNo = $(this).data("itemno");
    itemName = $(results).find("Title").eq(itemNo).text();
    addFavorite();
});


$(document).on("click", "#add-item", function() {
    $("#item-description").val($(results).find("Title").eq(itemNo).text());
    $("#asin").val($(results).find("ASIN").eq(itemNo).text());
    openDisplay("add-items");
});


}); // END OF DOCUMENT READY FUNCTION
