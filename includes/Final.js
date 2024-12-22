const onLoad = () => {
    const addToCart = (departure, arrival, seats, total, image, i) =>{
        // Takes the fetched values as parameters and creates a card in the offcanvas cart
        let buttonId = `button${i}`;
        let cardId = `card${i}`;
        let removeCard = `remove${i}`;
      $("#cart-data").append(`
      <div id=${cardId}>
        <div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${image}" class="img-fluid rounded" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">From ${departure} to ${arrival}</h5>
                        <p class="card-text">Total: $${total.toFixed(2)}</p>
                        <p class="card-text"><small class="text-body-secondary">Seats Remain: ${seats}</small></p>
                        <button type="button" id=${buttonId} class="login btn btn-outline-secondary">Proceed to Checkout <i class="fa-regular fa-credit-card"></i></button>
                        <div class="py-1">
                            <button type="button" id=${removeCard} class="btn btn-outline-secondary"><i class="fa-sharp fa-solid fa-xmark"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
       </div>
      `);
      $(`#clear-cart`).html(`
        <button type="button" id="clear-items" class="btn btn-outline-secondary">Clear All<i class="fa-sharp fa-solid fa-xmark"></i></button>
      `);
      //An eventlistener for clearing the cart items when clicked on
      const removeWholeCart = document.getElementById('clear-items');
      removeWholeCart.addEventListener("click", function(){
        $(`#cart-data`).html(`
        `);
        $(`#clear-cart`).html(`
        `)
        });
        // Another eventListener to remove a item from a cart by deleting the whole card div
        const removeFromCart = document.getElementById(removeCard);
        removeFromCart.addEventListener("click", function(){
            
            $(`#${cardId}`).remove();
        });
        //When the checkout button is clicked a modal shows up to book seats and get the final price after validating the form filled by the user
        $(`#${buttonId}`).click(function(){
            let myModal = new bootstrap.Modal(document.getElementById('checkout'));
            myModal.show();
            $("#validator").click(function(){
                let errorCount = 0;
                let companyName = document.getElementById('company-name').value.trim();
                let errorElement = document.getElementById('errors');
            
                if (companyName === '') {
                    errorElement.innerHTML = "<p style='color: red; font-size: 24px;'> Name cannot be blank!</p>";
                    errorCount++;
                } else if (/^\s*$/.test(companyName)) {
                    errorElement.innerHTML = "<p style='color: red; font-size: 24px;'> Name cannot be only spaces!</p>";
                    errorCount++;
                } else if (/\s/.test(companyName)) {
                    errorElement.innerHTML = "<p style='color: red; font-size: 24px;'> Name cannot contain spaces between letters!</p>";
                    errorCount++;
                } else {
                    errorElement.innerHTML = "";
                }
                let numberOfSeats =  document.getElementById('numOfSeats').value;
            
                if (numberOfSeats <= 0 || numberOfSeats > seats || isNaN(numberOfSeats)) {
                    errorElement.innerHTML += `<p style='color: red; font-size: 24px;'>Please enter a valid number of seats</p>`;
                    errorCount++;
                }
            
                let emailInput = document.getElementById('mail').value;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput)) {
                    errorElement.innerHTML += `<p style='color: red; font-size: 24px;'>Please enter a valid email address!</p>`;
                    errorCount++;
                }
            
                let phoneInput = document.getElementById('Number').value;
                const phoneRegex = /^(\d{3}[-\s]?)?\d{3}[-\s]?\d{4}$/;
                if (!phoneRegex.test(phoneInput)) {
                    errorElement.innerHTML += `<p style='color: red; font-size: 24px;'>Please enter a valid phone number (e.g., 000-000-0000, 0000000000, or 000 000 0000)!</p>`;
                    errorCount++;
                }
            
                let postalCodeInput = document.getElementById('zipCode').value;
                const postalCodeRegex = /^[A-Za-z][0-9][A-Za-z] ?[0-9][A-Za-z][0-9]$/;;
                if (!postalCodeRegex.test(postalCodeInput)) {
                    errorElement.innerHTML += `<p style='color: red; font-size: 24px;'>Please enter a valid Canadian postal code (e.g., A1A 1A1 or A1A1A1)!</p>`;
                    errorCount++;
                }
                if (errorCount === 0) {
                    // If no errors then another modal pops up which confirms the bookings with the final price and empties the cart
                    $("#checkout-body").html(`
                    <p>Your flight has been booked.</p>
                    <p> Your total bill: $${(total*seats).toFixed(2)}</p>
                    <p>Click anywhere outside the modal to go back <i class="fa-solid fa-face-smile"></i></p>
                    `);
                    $("#cart-data").html(`<p>
                    Empty Cart </p>`);
                    $("#clear-cart").html(`
                    `);
                    $("#validator").remove();
                    $("#validator").click(function(){
                        let myModal = new bootstrap.Modal(document.getElementById('checkout'));
                        myModal.hide();
                    });
                }
            });
        });
    }

    const getFlights = (firstClickElevation, firstLocation, secondLocation, distance)=> {
        // After the user has clicked on 2 places on the map then this function is invoked
        // firstly the departure location which is the first click elevation is turned into kilometers to later compare with maxtakeoffaltitude
        $('#results').html(`  `);
        $('#results').append(`<h1> Flight Results </h1> `)
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        //fetching the data from JSON file fake_flights from my github
        fetch(proxyUrl + 'https://github.com/KiNgAbb/Final/raw/main/fake_flights.json')
            .then(response =>{
                if(!response.ok){
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(jsonData => {
                // iterates through all the objects in the JSON file 
                for( let i = 0; i<jsonData.length; i++){
                    // An if statement to confirm which plane is avaialble for a particular flight 
                    if(jsonData[i]["maxTakeOffAlt"]>+ firstClickElevation){
                        // creating card content
                        let buttonid = `addToCartButton${i}`;
                        let planeName = jsonData[i]["type_of_plane"];
                        let pricePerKM = jsonData[i]["price_per_km"];
                        let seatsRemain = jsonData[i]["seats_remaining"];
                        let speedOfPlane = jsonData[i]["speed_kph"];
                        let fuelCharge = jsonData[i]["extraFuelCharge"];
                        let planeImage = jsonData[i]["plane-image"];
                        let flightDuration = (distance/speedOfPlane) *60;
                        let finalPrice = ((distance*fuelCharge)) * (pricePerKM/100);
                        // showing results accordingly on the html page
                        $('#results').append(`
                        <div class="py-2">
                        <div class="flight-cards card mb-3">
                        <img src="${planeImage}" class="card-img-top" height="300" alt="...">
                        <div class="card-body">
                          <h5 class="card-title fs-3 fw-bold">From ${firstLocation} to ${secondLocation} via ${planeName}(Traveling: ${distance}Km)</h5>
                          <hr>
                          <p class="card-text">Duration: ${flightDuration.toFixed(2)} mins</p>
                          <p class="card-text">Seats Remain: ${seatsRemain}</p>
                          <p class="card-text">Price per kilometer: ${pricePerKM}<i class="fa-solid fa-cent-sign"></i></p>
                          <p class="card-text fw-bold">Final Price: $${finalPrice.toFixed(2)}</p>
                          <p class="card-text"><small class="text-body-secondary">Fuel Charges are included in the price: ${fuelCharge}</small></p>
                          <p class="card-text"><small class="text-body-secondary">Plane speed: ${speedOfPlane} kph</small></p>
                          <button id="${buttonid}" class="btn btn-outline-secondary">Add to Cart <i class="fa-solid fa-cart-shopping"></i></button>
                        </div>
                      </div>
                      </div>
                        `);
                        //Adding an eventListener which will call the addto cart function 
                        const addToCartButton = document.getElementById(buttonid);
                        addToCartButton.addEventListener("click", function(){
                            addToCart(firstLocation, secondLocation, seatsRemain, finalPrice, planeImage, i);
                        });
                    }
                    // If no flights are available then show the other result
                    else{
                        $('#results').append(`<h3>No Flights Available</h3>`);
                        break;
                    }
                }
            });
    }


    //A polyLine to show distance b/w two selected places
    let polyline = null;
    const haversine = (lat1, lon1, lat2, lon2) => {
        const R = 6371.0; // Radius of the Earth in kilometers
        const toRadians = degrees => degrees * Math.PI / 180;
        
        const lat1_rad = toRadians(lat1);
        const lon1_rad = toRadians(lon1);
        const lat2_rad = toRadians(lat2);
        const lon2_rad = toRadians(lon2);
        
        const dlon = lon2_rad - lon1_rad;
        const dlat = lat2_rad - lat1_rad;
        
        const a = Math.sin(dlat / 2) ** 2 + Math.cos(lat1_rad) * Math.cos(lat2_rad) * Math.sin(dlon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        const distance = R * c;
        
        return distance;
    };
    
    navigator.geolocation.getCurrentPosition((position) => {
        //custom icon
        const myIcon = L.icon({
            iconUrl: 'includes/images/myMarker.png',
        
            iconSize:     [36, 36], // size of the icon
            iconAnchor:   [22, 50], // point of the icon which will correspond to marker's location
            clickable: true,
            title: "My Location",
            zIndexOffset: 100,
            riseOnHover: true,
            popupAnchor:  [-3, -76], // point from which the popup should open relative to the iconAnchor
            riseOffset: 500,
        });
        // getting my location
        let myLat = position.coords.latitude;
        let myLong = position.coords.longitude;
        //Creating the map
        let map = L.map('map', { zoomControl: true }).setView([myLat, myLong], 16);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 15,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    
        L.control.scale().addTo(map);
        //Placing a marker of my location
        L.marker([myLat, myLong], {icon: myIcon}).addTo(map);
        // a function which first splits the GeoLocation into 2 and then further adds a decimal point to the divided string, then checks weather the value should have a negative sign or a positive sign infront of it and then parseFloat
        const getLatAndLong = (location)=> {
            let realLatitude;
            let realLongitude; 
            let spaceIndex = location.indexOf(" ")
            let dividedlatitude = location.substring(0, spaceIndex);
            let dividedlongitude = location.substring(spaceIndex+1);
            let latitudewithChar = dividedlatitude.substring(0,dividedlatitude.length-3) + "." + dividedlatitude.substring(dividedlatitude.length-3);
            let longitudewithChar = dividedlongitude.substring(0,dividedlongitude.length-3) + "." + dividedlongitude.substring(dividedlongitude.length-3);
            if (latitudewithChar.endsWith("S")) {
                realLatitude = "-" + latitudewithChar.slice(0, -1);
            } else if (latitudewithChar.endsWith("N")) {
                realLatitude = latitudewithChar.slice(0, -1);
            } 

            if (longitudewithChar.endsWith("W")) {
                realLongitude = "-" + longitudewithChar.slice(0, -1);
            } else if (longitudewithChar.endsWith("E")) {
                realLongitude = longitudewithChar.slice(0, -1);
            }

            realLatitude = parseFloat(realLatitude);
            realLongitude = parseFloat(realLongitude);
            return { lat: realLatitude, lng: realLongitude };
        }
        //proxy url so that data is fetched without issues
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        //fetching the data from JSON file mAirports from my github
        fetch(proxyUrl + 'https://github.com/KiNgAbb/Final/raw/main/mAirports.json')
            .then(response =>{
                if(!response.ok){
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then(jsonData => {
                //Declaring important varaible right now
                //Such as the first click to save the users first click location and also the second
                // also the first click elevation for later use of fake_flights 
                let firstClick = null;
                let secondClick = null;
                let firstClickLocation = null;
                let secondClickLocation = null;
                let firstClickelevation;
                // A loop which will run till the end of the JSON file
                for(let i = 0; i< jsonData.length; i++){
                    //Saving the location and calling the getLatandLng function
                    let location = jsonData[i]['Geographic Location']; 
                    const { lat, lng } = getLatAndLong(location);
                    // Using the lat and lng, getting the weather of all locations
                    let apiKey = `cd0a8044e59eec1c99a47b763c07235a`;
                    let weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}`;
                    let getWeather = async() => {
                        let response = await fetch(weatherURL);
                        let data = await response.json();
                        let weather = (data.main.temp -273.15).toFixed(2);
                        return weather;
                    }
                    //Using the lat and the long, adding a mark to my map
                    L.marker([lat, lng], {icon: myIcon}).addTo(map);
                    let destination = L.marker([lat, lng], {icon: myIcon}).addTo(map);


                    // 1.When the user clicks on any location, it saves the first click location's lat and long
                    // 2. Using these lat and lngs, a polyline is created and shown on the map
                    // 3. If the user clicks on any other location then the polyline disappears and all the saved lat and lngs are nullified including the polyline
                    // 4. When a user clicks on any location, the location name will popup as well as the location's weather using the getWeather function 
                    // 5. Add a way to show the distance in b/w these 2 places
                    destination.on("click",async function(e){
                        if(!firstClick){
                            firstClickLocation = jsonData[i]["City Name"];
                            firstClickelevation = jsonData[i]["elevationInFt"];
                            firstClick = {lat, lng}
                        }
                        else if(!secondClick){
                            secondClickLocation = jsonData[i]["City Name"];
                            secondClick = {lat,lng};
                            if(firstClick && secondClick){
                                if(polyline){
                                    map.removeLayer(polyline);
                                }
                                polyline = L.polyline([firstClick, secondClick], {color: `red`}).addTo(map);
                            }
                        }
                        else{
                            firstClick = null;
                            secondClick = null;
                            firstClickLocation = null;
                            secondClickLocation = null;
                            if(polyline){
                                map.removeLayer(polyline);
                                polyline = null;
                            }
                        }
                        let weather = await getWeather()
                        let popupcontent = jsonData[i]["City Name"] + " " + weather;
                        destination.bindPopup(popupcontent).openPopup();
                        const dist = haversine(firstClick.lat, firstClick.lng, secondClick.lat, secondClick.lng);

                        setTimeout(() =>{
                            const distancePopup = `Distance: ${dist.toFixed(2)} km`;
                            L.popup()
                            .setLatLng([(firstClick.lat + secondClick.lat) / 2, (firstClick.lng + secondClick.lng) / 2])
                            .setContent(distancePopup)
                            .openOn(map);

                            getFlights(firstClickelevation, firstClickLocation, secondClickLocation,dist.toFixed(2));

                        },1000);            
                    }); 
                }
            })
            .catch(error => {
                console.error('There was a problem fetching the data:', error);
            });
    });

}
onLoad();

