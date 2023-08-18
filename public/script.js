document.addEventListener("DOMContentLoaded", function () {

    const registroForm = document.getElementById("registro-form");
    const consultaForm = document.getElementById("consulta-form");
    const resultadoDiv = document.getElementById("resultado");
    const fotoInput = document.getElementById("foto");
    const consultaIdInput = document.getElementById("consulta-id");
    const consultaBtn = document.getElementById("consulta-btn");

    registroForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const id = document.getElementById("id").value;
        const nombre = document.getElementById("nombre").value;
        const correo = document.getElementById("correo").value;
        const telefono = document.getElementById("telefono").value;
        const foto = fotoInput.files[0]; // Obtener el archivo seleccionado

         // Crear un objeto FormData para enviar la foto
        const formData = new FormData();
        formData.append("id", id);
        formData.append("nombre", nombre);
        formData.append("correo", correo);
        formData.append("telefono", telefono);
        formData.append("foto", foto);
        
        /* function mostrarMensaje(mensaje, tipo) {
            const mensajeDiv = document.createElement("div");
            mensajeDiv.textContent = mensaje;
            mensajeDiv.classList.add("mensaje", tipo);
        
            // Agregar el mensaje al principio del cuerpo del documento
            document.body.insertBefore(mensajeDiv, document.body.firstChild);
        
            setTimeout(() => {
                mensajeDiv.remove(); // Eliminar el mensaje después de 5 segundos
            }, 5000);
        } */

        try {
            const response = await fetch('/registrar', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok) {
                mostrarMensaje("Registro exitoso.", "success");
            } else {
                mostrarMensaje("Error al registrar. Inténtalo de nuevo más tarde.", "error");
            }
        } catch (error) {
            console.error(error);
        }
         // Agregado: Manejo del formulario de consulta
    consultaForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const consultaId = consultaIdInput.value;

        try {
            const response = await fetch(`/consultar/${consultaId}`);
            const data = await response.json();

            if (data) {
                resultadoDiv.innerHTML = `
                    <h3>Resultado de la consulta</h3>
                    <p>ID: ${data.id}</p>
                    <p>Nombre: ${data.nombre}</p>
                    <p>Correo: ${data.correo}</p>
                    <p>Teléfono: ${data.telefono}</p>
                    <p>Ruta de la imagen: ${data.rutaFoto}</p>
                `;
            } else {
                resultadoDiv.innerHTML = "Profesor no encontrado.";
            }
        } catch (error) {
            console.error(error);
        }
    });

    function mostrarMensaje(mensaje, tipo) {
        const mensajeDiv = document.getElementById("mensaje");
        mensajeDiv.textContent = mensaje;
        mensajeDiv.classList.add(tipo);

        setTimeout(() => {
            mensajeDiv.textContent = "";
            mensajeDiv.classList.remove(tipo);
        }, 5000);
    }

        try {
            const response = await fetch('/registrar', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    });

    consultaBtn.addEventListener("click", async function () {
        const consultaId = consultaIdInput.value;

        try {
            const response = await fetch(`/consultar/${consultaId}`);
            const data = await response.json();

             if (data) {
            resultadoDiv.innerHTML = `
                <h3>Resultado de la consulta</h3>
                <p>ID: ${data.id}</p>
                <p>Nombre: ${data.nombre}</p>
                <p>Correo: ${data.correo}</p>
                <p>Teléfono: ${data.telefono}</p>
                <p>Ruta de la imagen: ${data.rutaFoto}</p>
            `;
            } else {
                resultadoDiv.innerHTML = "Profesor no encontrado.";
            }
        } catch (error) {
            console.error(error);
        }
    });
});
