$(document).ready(function(){

//VARIABLES: ==============================================================================================

var state = {
	favorites: []
}

var favoritesCount = 0;



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
	openShopModal("favorites-modal");
});


// Removes items from My Favorites list
$(document.body).on('click', '.close', function(){
    var favoriteNumber = $(this).data("favorite");
    $("#item-" + favoriteNumber).empty();
});


// Displays shop panels div
$("#shop-toggle").on('click', function() {
	console.log("opening shop toggle");
	openDisplay("shop-toggle");
	$("#search").val("");

});









}) // END OF DOCUMENT READY FUNCTION
