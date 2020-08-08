
var indexedDB = window.indexedDB || window.mozIndexedDB;
let db;
const request = indexedDB.open("transactionDatabase", 1);

request.onsuccess = ({ target }) => {
  db = target.result;
  console.log(db ,"onsuccess")
  //need to check our database to see if back online 

  if (navigator.onLine) {
    checkDatabase();
  }
  //function to check db and get info from db


};

request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  console.log(db, "onupgrade")
  db.createObjectStore("transaction", {
    autoIncrement: true,
    keyPath: "name"
  

  });


}

function addItem(entry) {
  var transaction = db.transaction(['transaction'], 'readwrite');
  var store = transaction.objectStore('transaction');
  store.add(entry);
  console.log(transaction, "transaction")
  console.log(store, "store")
  console.log(entry)
}


//fetch from url in api routes - use post request route

// fetch takes 2 arguments - route , and obj (post, body, get all result, headers - what to expect - a mongo - expect application.json)

//return response.json from that fetch 

// a way to clear out eh storage - store.clear()

function checkDatabase() {
  // open a transaction on your store db
  const transaction = db.transaction(["transaction"], "readwrite");
  // access your store object store
  const store = transaction.objectStore("transaction");
  // get all records from store and set to a variable
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          // if successful, open a transaction on your store db
          const transaction = db.transaction(["transaction"], "readwrite");

          // access your store object store
          const store = transaction.objectStore("transaction");

          // clear all items in your store
          store.clear();
        });
    }
  };
}
window.addEventListener("online", checkDatabase);

//if i submit number online - check there
//if i submit number offline = and get an error there - see what is happening at each step
//