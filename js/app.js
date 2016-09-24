$(document).ready(function(){

//VARIABLES: ==============================================================================================




//INITIALIZE FIREBASE: ====================================================================================





//AJAX CALL FOR EBAY: =====================================================================================




//AJAX CALL FOR AMAZON: ===================================================================================





//FUNCTIONS: ==============================================================================================

// Displays shop modal if user has input search and selected shop
function displayModal(event){
	if ($("#search").val().trim().length !== 0) {
		var modal = event.currentTarget.id;

		console.log("value: " + $("#search").val());
		$(".direction-copy").removeClass("red-text");
		$(".direction-copy").removeClass("error-anim");

		openShopModal(modal);

	} else {
		console.log("empty search");
		// $(".direction-copy").addClass("waves-effect");
		$(".direction-copy").addClass("red-text");
		$(".direction-copy").addClass("error-anim");
	}
}

// General function for opening modals
function openShopModal(id) {
	switch(id) {
		case 'ebay-toggle': 
			$('#ebay-modal').openModal();
			break;
		case 'amazon-toggle':
			$('#amazon-modal').openModal();
			break;
		default:
			console.log('how did this happen!!');
	}
}


//EVENT LISTENERS: ========================================================================================

// Displays pop-over for username and password
$('#login').webuiPopover({url:'#login-form'});

// Opens modals on click
$(".modal-trigger").on("click", displayModal);













}) // END OF DOCUMENT READY FUNCTION
