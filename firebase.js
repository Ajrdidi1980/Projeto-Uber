import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
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

// ===== SALVAR RECEITA =====

window.salvarReceitaFirebase = async function (dados) {
  try {
    await addDoc(collection(db, "receitas"), dados);

    console.log("✅ Receita salva na nuvem");
  } catch (erro) {
    console.error("❌ Erro:", erro);
  }
};

// ===== CARREGAR RECEITAS =====

window.carregarReceitasFirebase = async function () {
  try {
    const consulta = await getDocs(collection(db, "receitas"));

    let receitasFirebase = [];

    consulta.forEach((doc) => {
      receitasFirebase.push(doc.data());
    });

    console.log("☁️ Receitas carregadas:", receitasFirebase);

    return receitasFirebase;
  } catch (erro) {
    console.error("❌ Erro:", erro);

    return [];
  }
};

console.log("🔥 Firestore conectado");
