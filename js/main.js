var template = document.querySelector('template').content;
var container = document.querySelector('#container');
var form = document.querySelector("form");

// Initialize Firebase
var config = {
    apiKey: "AIzaSyBY44SW0hPuWhxjCyrGDjtA3XojYjdd5Hw",
    authDomain: "mcdba-4c236.firebaseapp.com",
    databaseURL: "https://mcdba-4c236.firebaseio.com",
    storageBucket: "mcdba-4c236.appspot.com",
    messagingSenderId: "1084583363332"
};
firebase.initializeApp(config);

var database = firebase.database();

var itemsRef = database.ref('items/');

itemsRef.on('child_added', showData);
itemsRef.on('child_removed', dataRemoved);
function dataRemoved(evt){
    console.log(evt.key);
    var art = container.querySelector('article[data-key='+evt.key+']');
    art.classList.add('fadeOut');
    art.addEventListener('transitionend', function(e){
       art.style.display="none";
    });

}

function showData(snapshot){
    //console.log(snapshot.val(), snapshot.key);

    var x = template.cloneNode(true);
    //console.log();
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
            database.ref('items/'+e.target.parentNode.dataset.key).remove();
        });

    container.appendChild(x);
    //
}

//database.ref('items/').remove()


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
                "name":"Ralph",
                "email": "a@a.dk"
            }
        }
    )
});






