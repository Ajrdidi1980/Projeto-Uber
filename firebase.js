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
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

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
const auth = getAuth(app);
const usuarioAtual = () => auth.currentUser;

const provider = new GoogleAuthProvider();

// ===== SALVAR RECEITA =====

window.salvarReceitaFirebase = async function (dados) {
  try {
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");

      return;
    }

    const docRef = await addDoc(
      collection(db, "usuarios", usuario.uid, "receitas"),

      dados,
    );

    console.log("✅ Receita salva");

    return docRef.id;
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
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");

      return [];
    }

    const q = query(
      collection(db, "usuarios", usuario.uid, "receitas"),

      orderBy("data", "desc"),
    );

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
  const usuario = usuarioAtual();

  if (!usuario) {
    console.log("❌ Usuário não logado");
    return;
  }

  const q = query(
    collection(db, "usuarios", usuario.uid, "receitas"),
    orderBy("data", "desc"),
  );

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
    const usuario = usuarioAtual();

    if (!usuario) {
      console.log("❌ Usuário não logado");

      return;
    }

    const docRef = await addDoc(
      collection(db, "usuarios", usuario.uid, "gastos"),

      dados,
    );

    console.log("✅ Gasto salvo");

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
  const usuario = usuarioAtual();

  if (!usuario) {
    console.log("❌ Usuário não logado");

    return;
  }

  const q = query(
    collection(db, "usuarios", usuario.uid, "gastos"),

    orderBy("data", "desc"),
  );

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
// ===== LOGIN GOOGLE =====

window.loginGoogle = async function () {
  console.log("🔥 clicou login");
  try {
    console.log("🔥 iniciando popup");
    const resultado = await signInWithPopup(auth, provider);

    const usuario = resultado.user;

    console.log("✅ Usuário logado:", usuario.displayName);
  } catch (erro) {
    console.error("❌ Erro login:", erro);
  }
};

// ===== LOGOUT =====

window.logoutGoogle = async function () {
  await signOut(auth);

  console.log("👋 Logout realizado");
};

// ===== OBSERVAR LOGIN =====

onAuthStateChanged(auth, (usuario) => {
  const nomeUsuario = document.getElementById("nome-usuario");

  const btnLogout = document.getElementById("btn-logout");

  const btnLogin = document.querySelector('button[onclick="loginGoogle()"]');

  if (usuario) {
    console.log("🔥 Logado:", usuario.displayName);

    if (nomeUsuario) {
      nomeUsuario.innerText = `Olá, ${usuario.displayName} 👋`;
    }

    btnLogin.style.display = "none";

    btnLogout.style.display = "block";
  } else {
    console.log("❌ Não logado");

    if (nomeUsuario) {
      nomeUsuario.innerText = "";
    }

    btnLogin.style.display = "block";

    btnLogout.style.display = "none";
  }
});

console.log("🔥 Firestore conectado");
