const API_URL = 'http://localhost:3001/clients';

const clientsTableBody = document.querySelector('#clientsTable tbody');
const clientForm = document.getElementById('clientForm');
const clientIdInput = document.getElementById('clientId');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const phoneInput = document.getElementById('phone');
const addressInput = document.getElementById('address');
const genreSelect = document.getElementById('genre');
const cancelEditBtn = document.getElementById('cancelEdit');

let editMode = false;

// Cargar y mostrar clientes
async function loadClients() {
  try {
    const res = await fetch(API_URL);
    const clients = await res.json();

    clientsTableBody.innerHTML = '';

    clients.forEach(client => {
      // Ejemplo simple de creación de fila con botones
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${client.id}</td>
        <td>${client.name}</td>
        <td>${client.email}</td>
        <td>${client.phone}</td>
        <td>${client.address}</td>
        <td>${client.genre}</td>
        <td>
            <button class="edit" data-id="${client.id}">Editar</button>
            <button class="delete" data-id="${client.id}">Borrar</button>
        </td>
      `;
      clientsTableBody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error cargando clientes:', error);
  }
}

// Enviar formulario para crear o actualizar
clientForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const clientData = {
    name: nameInput.value,
    email: emailInput.value,
    password: passwordInput.value,
    phone: phoneInput.value,
    address: addressInput.value,
    genre: genreSelect.value,
  };

  try {
    if (editMode) {
      // Actualizar
      const id = clientIdInput.value;
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      alert('Cliente actualizado');
    } else {
      // Crear
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
      });
      alert('Cliente creado');
    }
    resetForm();
    loadClients();
  } catch (error) {
    console.error('Error guardando cliente:', error);
  }
});

// Cargar datos del cliente para editar
window.editClient = async function(id) {
  try {
    const res = await fetch(`${API_URL}`);
    const clients = await res.json();
    const client = clients.find(c => c.id === id);

    if (!client) return alert('Cliente no encontrado');

    clientIdInput.value = client.id;
    nameInput.value = client.name;
    emailInput.value = client.email;
    passwordInput.value = client.password || '';
    phoneInput.value = client.phone || '';
    addressInput.value = client.address || '';
    genreSelect.value = client.genre || '';

    editMode = true;
    cancelEditBtn.style.display = 'inline';
  } catch (error) {
    console.error('Error cargando cliente:', error);
  }
};

// Cancelar edición
cancelEditBtn.addEventListener('click', () => {
  resetForm();
});

// Resetear formulario y modo edición
function resetForm() {
  clientForm.reset();
  clientIdInput.value = '';
  editMode = false;
  cancelEditBtn.style.display = 'none';
}

// Borrar cliente
window.deleteClient = async function(id) {
  if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

  try {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    alert('Cliente eliminado');
    loadClients();
  } catch (error) {
    console.error('Error eliminando cliente:', error);
  }
};

// Cargar la lista al inicio
loadClients();
