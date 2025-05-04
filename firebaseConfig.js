// firebaseConfig.js
const firebaseConfig = {
  apiKey: "AIzaSyBzeASdT3iyjzfbffavztJvCuw-SbUsylc",
  authDomain: "furia-form.firebaseapp.com",
  projectId: "furia-form",
  storageBucket: "furia-form.appspot.com", // CORRIGIDO AQUI
  messagingSenderId: "960503537717",
  appId: "1:960503537717:web:8605c7cf3edc6191b1917c"
};

// Inicialização compatível com firebase-compat
firebase.initializeApp(firebaseConfig);

// Tornar global para acesso via window
window.firebase = firebase;
window.db = firebase.firestore();
