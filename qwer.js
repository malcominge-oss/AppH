
const DB_NAME = "MiBaseDatos";
const DB_VERSION = 1;
const STORE_NAME = "usuarios";

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function cargarUsuarios() {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const req = store.getAll();

    req.onsuccess = () => {
      const todos = req.result || [];
      const tbody = document.querySelector("#tabla tbody");
      tbody.innerHTML = "";

      if (!todos.length) {
        tbody.innerHTML = "<tr><td colspan='5'>No hay usuarios</td></tr>";
        return;
      }

      for (const u of todos) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${u.id ?? ""}</td>
          <td>${u.campo1 ?? ""}</td>
          <td>${u.campo2 ?? ""}</td>
          <td>${u.campo3 ?? ""}</td>
          <td>
            <button class="btnBorrar" data-id="${u.id}">Eliminar</button>
          </td>
        `;
        tbody.appendChild(tr);
      }

      tbody.addEventListener("click", async (e) => {
        if (e.target.classList.contains("btnBorrar")) {
          const id = Number(e.target.dataset.id);
          if (!Number.isInteger(id)) return;
          if (!confirm(`¿Eliminar usuario con ID ${id}?`)) return;
          await borrarUsuario(id);
          cargarUsuarios();
        }
      });
    };

    req.onerror = () => {
      console.error("Error al obtener usuarios:", req.error);
    };

  } catch (err) {
    console.error("Error abriendo DB:", err);
  }
}


async function borrarUsuario(id) {
  const db = await openDB();
  db.transaction(STORE_NAME, "readwrite").objectStore(STORE_NAME).delete(id);
}

document.getElementById("btnVolver").addEventListener("click", () => {
  window.location.href = "index.html";
});

cargarUsuarios();
