//some global variables we need for later
var template = document.querySelector('template').content;
var container = document.querySelector('#container');
var form = document.querySelector("form");
var formControl = document.querySelector('#formControl');
var loggedUser; // this will contain info about the user (later)
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBY44SW0hPuWhxjCyrGDjtA3XojYjdd5Hw",
    authDomain: "mcdba-4c236.firebaseapp.com",
    databaseURL: "https://mcdba-4c236.firebaseio.com",
    storageBucket: "mcdba-4c236.appspot.com",
    messagingSenderId: "1084583363332"
};
firebase.initializeApp(config);
//just give something shorter to write
var database = firebase.database();

//grab af reference to the items part of the JSON tree
var itemsRef = database.ref('items/');

//register two eventhandlers
itemsRef.on('child_added', showData);
itemsRef.on('child_removed', dataRemoved);

function dataRemoved(evt){
    //console.log(evt.key);
    //grab the key, fade out the element, and once that done, remove it
    var art = container.querySelector('article[data-key='+evt.key+']');
    art.classList.add('fadeOut');
    art.addEventListener('transitionend', function(e){
        container.removeChild(art);
       //art.style.display="none";
    });

}

//this function runs once per "row" in the database
function showData(snapshot){
    //console.log(snapshot.val(), snapshot.key);
    //clone the templates
    var x = template.cloneNode(true);
    //use that fance data-attribute :-)
    x.querySelector('article').dataset.key = snapshot.key;
    var price = x.querySelector('h2 span'),
        header = x.querySelector('.header'),
        description = x.querySelector('p'),
        name = x.querySelector('.name');

        price.innerHTML = snapshot.val().price;
        header.innerHTML = snapshot.val().header;
        description.innerHTML = snapshot.val().description;
        name.innerHTML = snapshot.val().author.name;
        x.querySelector('button').addEventListener('click', function(e){
           console.log(e.target.parentNode.dataset.key);
            //this is where we delete
            database.ref('items/'+e.target.parentNode.dataset.key).remove();
        });

    container.appendChild(x);
}

//slide the form in and out
formControl.addEventListener('click', function(){
    form.classList.toggle('inView');
});
//add new content
form.addEventListener('submit', function(evt){
    evt.preventDefault();

    var header = form.querySelector('input[name=header]').value;
    var description = form.querySelector('textarea').value;
    var price = parseInt(form.querySelector('input[name=price]').value);
    console.log(header, description, price)

    database.ref('items/').push(
        {
            "header": header,
            "price": price,
            "description": description,
            "author": {
                "name":loggedUser.displayName,
                "email": loggedUser.email
            }
        }
    );
    form.classList.remove('inView');
    //TODO clear the form elements
});


//login stuff comes here

document.querySelector("#logoutButton").addEventListener('click', function(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
    }, function(error) {
        // An error happened.
    });
});
var provider = new firebase.auth.GoogleAuthProvider();

document.querySelector("#loginButton").addEventListener('click', logIn);

//This is a callback, so it runs once the user is logged in, and not only on startup!!!
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        console.log("user is logged in");
        document.querySelector('#loginButton').classList.add("hidden");
        document.querySelector('#logoutButton').classList.remove("hidden");
        formControl.classList.remove("hidden");

        loggedUser=user;
    } else {
        // No user is signed in.
        document.querySelector('#loginButton').classList.remove("hidden");
        document.querySelector('#logoutButton').classList.add("hidden");
        formControl.classList.add("hidden");
        console.log("Not loged in");
    }
});

//lots of stuff in here, horrible
function logIn(){
    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        console.log(result);
        loggedUser = result.user;
        // ...
    }).catch(function(error) {
        console.log(error);
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
    });
}




