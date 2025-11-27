
const request = indexedDB.open("BaseDatos", 1);

let db;

request.onupgradeneeded = function (event) {
  db = event.target.result;

  if (!db.objectStoreNames.contains("usuarios")) {
    db.createObjectStore("usuarios", { keyPath: "id", autoIncrement: true });
  }
};

request.onsuccess = function (event) {
  db = event.target.result;
  console.log("Base lista.");
};

request.onerror = function (event) {
  console.error("Error:", event.target.error);
};

function guardarDatos() {
  const nombre = document.getElementById("nombre").value;
  const contraseña = document.getElementById("contraseña").value;
  const año = document.getElementById("año").value;

  const tx = db.transaction("usuarios", "readwrite");
  const store = tx.objectStore("usuarios");

  const nuevoRegistro = { nombre, contraseña, año };
  store.add(nuevoRegistro);

  tx.oncomplete = () => console.log("Datos guardados.");
  tx.onerror = () => console.log("Error al guardar.");
}

document.getElementById("btnGuardar").addEventListener("click", guardarDatos);
