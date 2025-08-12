Proyecto CRUD Clientes con Express + MySQL + Frontend
====================================================

1. Backend (Express + MySQL)
----------------------------

- Conexión a MySQL:
  Usa `mysql2` para conectar y ejecutar queries.

- Variables sensibles:
  Guarda host, usuario, contraseña y DB en `.env` y carga con `dotenv`.

- Rutas CRUD:
  - GET /clients: Listar clientes.
  - POST /clients: Crear cliente (lee JSON del body).
  - PUT /clients/:id: Actualizar cliente.
  - DELETE /clients/:id: Borrar cliente.

- Middleware:
  Usa `cors` para permitir peticiones cross-origin.

- Archivos estáticos:
  Sirve frontend con `express.static()`.

- Carga CSV:
  Con `multer` recibe archivo, `csv-parser` lo procesa y carga datos a DB.

- Manejo de errores:
  Implementa middleware para errores 404 y genéricos.


2. Frontend (HTML + JS + CSS)
-----------------------------

- Estructura HTML:
  Tabla para mostrar clientes, formulario para agregar/editar, formulario para subir CSV.

- Fetch API:
  Consumir backend para listar, crear, actualizar y borrar clientes.

- Subida CSV:
  Formulario con input tipo file que envía el archivo al backend para procesar.

- Estilos CSS:
  Diseño moderno, responsivo y claro para tablas, formularios y botones.

- UX:
  Alertas y validaciones para mejorar experiencia.


3. Configuración del proyecto
-----------------------------

- package.json:
  Definir dependencias y scripts (start, dev).

- .env:
  Guardar credenciales y configuración sensible, nunca subirlo a Git.

- .gitignore:
  Ignorar node_modules/, .env y carpetas temporales (uploads/).

- npm scripts:
  Facilitar ejecución con npm start y npm run dev (usando nodemon).


4. Buenas prácticas
-------------------

- Validar variables de entorno para evitar fallos.

- Manejar errores de base y rutas no encontradas.

- Controlar CORS adecuadamente en producción.

- Limpiar archivos temporales (uploads) para evitar saturación.

- Documentar API y estructura para mantenimiento futuro.


Cómo usar el proyecto
---------------------

1. Clona o descarga el proyecto.

2. En la carpeta backend, crea un archivo `.env` con tus credenciales:

   DB_HOST=localhost
   DB_USER=tu_usuario
   DB_PASSWORD=tu_contraseña
   DB_NAME=nombre_base_de_datos
   PORT=3001

3. Instala las dependencias:

   npm install

4. Para desarrollo con recarga automática:

   npm run dev

5. Para producción:

   npm start

6. El backend estará corriendo en `http://localhost:3001`.

7. Abre el frontend en el navegador (por ejemplo `clients.html`) para:

   - Listar, agregar, editar y borrar clientes.
   - Subir archivos CSV para alimentar la base de datos.

8. Recuerda que debes tener MySQL corriendo y la base de datos creada con la tabla `clients`.

9. Si haces cambios en las rutas o archivos estáticos, reinicia el backend para aplicar.

---

Para más detalles o ayuda, consulta la documentación o contacta al desarrollador.
