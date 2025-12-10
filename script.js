import { db } from "./firebase.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const buttonSave = document.getElementById("salva");
const output = document.getElementById("output");

// Salva esempio
buttonSave.onclick = async () => {
  await addDoc(collection(db, "paesi"), {
    nome: "Italia",
    soldi: 1000,
    truppe: 10
  });
  carica();
};

// Legge dati
async function carica() {
  output.innerHTML = "";
  const snap = await getDocs(collection(db, "paesi"));
  snap.forEach(doc => {
    const d = doc.data();
    output.innerHTML += `<p>${d.nome} – soldi: ${d.soldi}, truppe: ${d.truppe}</p>`;
  });
}

// Carica subito
carica();
