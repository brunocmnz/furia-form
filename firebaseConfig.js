// firebaseConfig.js

const firebaseConfig = {
  apiKey: "AIzaSyBzeASdT3iyjzfbffavztJvCuw-SbUsylc",
  authDomain: "furia-form.firebaseapp.com",
  projectId: "furia-form",
  storageBucket: "furia-form.appspot.com",
  messagingSenderId: "960503537717",
  appId: "1:960503537717:web:8605c7cf3edc6191b1917c",
};

Promise.all([
  import("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"),
  import("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"),
  import("https://www.gstatic.com/firebasejs/9.22.0/firebase-storage-compat.js"),
])
  .then(([firebaseApp, firestore, storage]) => {
    const firebase = window.firebase;
    firebase.initializeApp(firebaseConfig);

    window.firebase = firebase;
    window.db = firebase.firestore();
    window.storage = firebase.storage();
  })
  .catch((err) => {
    console.error("Erro ao carregar Firebase:", err);
  });
