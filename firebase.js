import { initializeApp } from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
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
    const docRef = await addDoc(collection(db, "receitas"), dados);

    return docRef.id;

    console.log("✅ Receita salva na nuvem");
  } catch (erro) {
    console.error("❌ Erro:", erro);
  }
};

// ===== CARREGAR RECEITAS =====

window.editarReceitaFirebase = async function (id, dados) {
  try {
    await updateDoc(doc(db, "receitas", id), dados);

    console.log("✏️ Receita atualizada");
  } catch (erro) {
    console.error(erro);
  }
};

window.excluirReceitaFirebase = async function (id) {
  try {
    console.log("🗑️ Excluindo ID:", id);

    await deleteDoc(doc(db, "receitas", id));

    console.log("✅ Receita excluída do Firebase");
  } catch (erro) {
    console.error("❌ Erro ao excluir:", erro);
  }
};

window.carregarReceitasFirebase = async function () {
  try {
    const q = query(collection(db, "receitas"), orderBy("data", "desc"));

    const consulta = await getDocs(q);

    let receitasFirebase = [];

    consulta.forEach((doc) => {
      receitasFirebase.push({
        id: doc.id,

        ...doc.data(),
      });
    });

    console.log("☁️ Receitas carregadas:", receitasFirebase);

    return receitasFirebase;
  } catch (erro) {
    console.error("❌ Erro:", erro);

    return [];
  }
};
window.escutarReceitasFirebase = function (callback) {
  const q = query(collection(db, "receitas"), orderBy("data", "desc"));

  onSnapshot(q, (snapshot) => {
    let receitasFirebase = [];

    snapshot.forEach((doc) => {
      receitasFirebase.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    callback(receitasFirebase);
  });
};
// ===== GASTOS =====

window.salvarGastoFirebase = async function (dados) {
  try {
    const docRef = await addDoc(collection(db, "gastos"), dados);

    return docRef.id;
  } catch (erro) {
    console.error("❌ Erro ao salvar gasto:", erro);
  }
};

window.editarGastoFirebase = async function (id, dados) {
  try {
    await updateDoc(doc(db, "gastos", id), dados);

    console.log("✏️ Gasto atualizado");
  } catch (erro) {
    console.error(erro);
  }
};

window.excluirGastoFirebase = async function (id) {
  try {
    await deleteDoc(doc(db, "gastos", id));

    console.log("🗑️ Gasto excluído");
  } catch (erro) {
    console.error(erro);
  }
};

window.escutarGastosFirebase = function (callback) {
  const q = query(collection(db, "gastos"), orderBy("data", "desc"));

  onSnapshot(q, (snapshot) => {
    let gastosFirebase = [];

    snapshot.forEach((doc) => {
      gastosFirebase.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    callback(gastosFirebase);
  });
};

console.log("🔥 Firestore conectado");
