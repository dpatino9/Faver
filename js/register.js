	var database = firebase.database();
	var uid = "";
	// Hide divs as necessary
	function hide(element) {
		element.removeClass("show");
		element.addClass("hide");
	}

	// Show divs as necessary
	function show(element) {
		element.removeClass("hide");
		element.addClass("show");	
	}
	function displayItems() {
		database.ref("users/"+uid+"/list").on("value", function(snapshot) {
			itemPositions = [];
			$("#display-items").empty();
			$("#display-items").append("<table><thead><tr><th>Item<th>Location Name<th>Location Address");
			snapshot.forEach(function(childSnapshot) {
				console.log(childSnapshot.val().location.address);
				var item = $("<tr><td>"+childSnapshot.val().itemName+"<td>"+childSnapshot.val().location.name+"<td>"+childSnapshot.val().location.address);
				$("table").append(item);
				var itemPosition = {"lat": childSnapshot.val().location.lat, "lng": childSnapshot.val().location.lng};
				itemPositions.push(itemPosition);
			});
		});
	}
	$(document).ready(function() {
	// Registration click event
	$(document).on("submit", "#register", function() {
		// variables for form inputs
		var remail = $("#register #email").val().trim();
		var rpassword = $("#register #password").val().trim();
		var rusername = $("#register #username").val().trim();
		// validate registration for blank fields
		if(remail != "" && rpassword != "" && remail != "") {
			$("#register")[0].reset();
			var createuser = firebase.auth().createUserWithEmailAndPassword(remail, rpassword);

			createuser.then(function() {
				// hide($("#register"));
				// hide($("#login"));
				// show($("#logout"));
				// show($("#add-items"));
				// show($("#display-items"));
				uid = firebase.auth().currentUser.uid;

				firebase.auth().onAuthStateChanged(function(user) {
					if (user) {
					    // User is signed in.
					    user.updateProfile({
					    	displayName: rusername
					    }).then(function() {
					    	console.log("username updated");
					        // Update successful.
					    }, function(error) {
					        // An error happened.
					    });

					} else {
					    // No user is signed in.
					}
				});
			}).catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;

			}); // Firebase create user function
		} // Registration field validation
	}); // Registration

	// Login click event
	$(document).on("submit", ".login-form", function() {
		var lemail = $("#login-form #email").val().trim();
		var lpassword = $("#login-form #password").val().trim();
		// Validate login fields
		if(lemail != "" && lpassword != "") {
		$("#login").webuiPopover("hide");
		$("#login").text("Sign Out");
		$("#login").attr("id","logout");
			var loginuser = firebase.auth().signInWithEmailAndPassword(lemail, lpassword);
			loginuser.then(function() {
				// $("#login")[0].reset();
				// hide($("#register"));
				// hide($("#login"));
				// show($("#logout"));
				// show($("#add-item"));
				// show($("#display-items"));
				uid = firebase.auth().currentUser.uid;
				// $("#greeting").html("<h1>Welcome "+firebase.auth().currentUser.displayName+"!");
				// show($("#geolocate"));
				// show($("#map"));
				addMarkers();
				google.maps.event.trigger(map, 'resize');
				displayItems();
			}).catch(function(error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log(errorCode, errorMessage);
			}); // Firebase login user function

		} // Login field validation
	}); // Login

	// Logout click event
	$(document).on("click", "#logout", function() {
		// Firebase signout
		var signout = firebase.auth().signOut();

		signout.then(function() {
			$("#logout").text("Sign In");
			$("#logout").attr("id","login");

			$('#login').webuiPopover({url:'#login-form'});

			// hide($("#logout"));
			// show($("#login"));
			// hide($("#map"));
			// hide($("#add-item"));
			// hide($("#display-items"));
			console.log(firebase.auth().currentUser);
		}).catch(function(error) {
			var errorCode = error.code;
			var errorMessage = error.message;

		}); // Firebase signout
	}); // Logout

	// Add item event
	$(document).on("submit", "#add-listitem", function() {
		var itemName = $("#item-description").val().trim();
		var itemASIN = $("#asin").val().trim();
		$("#add-listitem")[0].reset();

		if(itemName != "") {
			var updatenode = database.ref().child("users/"+uid+"/list");
			var newItem = updatenode.push();
			var user = {};
			user["itemName"] = itemName;
			user["asin"] = itemASIN;
			user["location/name"] = placeName;
			user["location/address"] = placeAddress;
			user["location/lat"] = placeLat;
			user["location/lng"] = placeLng;
			user["location/icon"] = placeIcon;
			newItem.update(user);
			addMarkers();
			google.maps.event.trigger(map, 'resize');
			$("#add-items").closeModal();
			// displayItems();
		}
	}); // Add item

});