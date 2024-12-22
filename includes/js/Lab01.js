alert ("Hello World!");

let name = prompt("What is your name");
document.getElementById("hello").innerHTML = `Hello ${name} How many Rooms do you want to book?!`;

let amount = prompt("What is the amount");
document.getElementById("amount").innerHTML = `$${amount}`;

let taxRate = prompt("what is the tax rate");
document.getElementById("tax").innerHTML = `${taxRate}%`;

let numRooms = prompt("How many rooms do you want");
document.getElementById("rooms").innerHTML = `${numRooms}`;

amount = parseInt(amount);
taxRate = parseInt(taxRate);
numRooms = parseInt(numRooms);

let total = amount *(1+ taxRate/100) * numRooms;
document.getElementById("subtotal").innerHTML = `$${total.toFixed(2)}`;