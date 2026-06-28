import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxAd9aONVUtaMPiyPlrZtEJNserACJySs",
  authDomain: "controle-corridas-90795.firebaseapp.com",
  projectId: "controle-corridas-90795",
  storageBucket: "controle-corridas-90795.firebasestorage.app",
  messagingSenderId: "116752945231",
  appId: "1:116752945231:web:6477f51f338bd780a61a3a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

const auth = getAuth(app);

onAuthStateChanged(auth, (usuario) => {
  console.log("Usuário admin:", usuario);
});

async function listarUsuarios() {
  try {
    const snapshot = await getDocs(collection(db, "usuarios"));

    let html = "";

    snapshot.forEach((doc) => {
      const usuario = doc.data();

      html += `
        <div style="
          border:1px solid #ddd;
          padding:10px;
          margin:10px 0;
          border-radius:8px;
        ">
          <strong>${usuario.nome || "Sem nome"}</strong><br>
          📧 ${usuario.email || "Sem email"}<br>
          🏷️ Plano: ${usuario.plano || "gratis"}
        </div>
      `;
    });

    document.getElementById("lista-usuarios").innerHTML =
      html || "Nenhum usuário encontrado.";
  } catch (erro) {
    console.error("Erro ao listar usuários:", erro);
  }
}

listarUsuarios();
