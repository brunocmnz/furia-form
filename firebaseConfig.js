// firebaseConfig.js

const firebaseConfig = {
    apiKey: "AIzaSyBzeASdT3iyjzfbffavztJvCuw-SbUsylc",
    authDomain: "furia-form.firebaseapp.com",
    projectId: "furia-form",
    storageBucket: "furia-form.appspot.com", // Corrigido aqui
    messagingSenderId: "960503537717",
    appId: "1:960503537717:web:8605c7cf3edc6191b1917c",
  };
  
  // Carrega os módulos compat do Firebase
  import("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js")
    .then(() => import("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"))
    .then(() => {
      firebase.initializeApp(firebaseConfig);
      const db = firebase.firestore();
  
      // Armazena no window para usar no app.js
      window.db = db;
  
      // Agora que Firebase está pronto, carrega app.js
      const script = document.createElement("script");
      script.src = "js/app.js";
      document.body.appendChild(script);
    });
  