async function obtenerTodos(){
    try{
        fetch('https://my-json-server.typicode.com/fedegaray/telefonos/db', {
            method: 'GET',
            headers:{ // CORREGIDO: 'header' cambiado a 'headers'
                "Content-Type": "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then(data =>{
            let cuerpoTabla = document.getElementById("tblContenido");
            let salida = "";
            for(let elemento of data.dispositivos){
                salida += `
                <tr>
                    <td>${elemento.id}</td>
                    <td>${elemento.marca}</td>
                    <td>${elemento.modelo}</td>
                    <td>${elemento.color}</td>
                    <td>${elemento.almacenamiento}</td> <td>${elemento.procesador}</td>
                </tr>
            `;
            }
            cuerpoTabla.innerHTML = salida;
        }).catch(error => {throw new Error('Error en la solicitud: ' + error)})
    } catch(error){
        console.error(error);
    }
}

async function consultarUno(){
    try{
        let id = document.getElementById('txtConsulta').value;
        if(id ===''){
            alert("No has ingresado ningún ID");
            return;
        }

        axios.get('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/'+id)
        .then(respuesta =>{
            let dispositivo = respuesta.data;
            document.getElementById('consultaNombre').value = dispositivo.marca;
            document.getElementById('consultaModelo').value = dispositivo.modelo;
            document.getElementById('consultaColor').value = dispositivo.color;
            // Guardamos solo el valor numérico o el texto limpio para facilitar la modificación posterior
            document.getElementById('consultaAlmacenamiento').value = dispositivo.almacenamiento; 
            document.getElementById('consultaProcesador').value = dispositivo.procesador;
        })
        .catch(error => {throw new Error("Error en la solicitud: "+error)})
    }catch(error){
        console.error(error); // CORREGIDO: Se añadió la variable 'error'
    }
}

async function agregarUno(){
    try{
        let marca = document.getElementById("inputMarca").value;
        let modelo = document.getElementById("inputModelo").value;
        let color = document.getElementById("inputColor").value;
        let almacenamiento = document.getElementById("inputAlmacenamiento").value;
        let procesador = document.getElementById("inputProcesador").value;

        if(!marca || !modelo) {
            alert("Por favor introduce al menos Marca y Modelo");
            return;
        }

        fetch('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                marca: marca,
                modelo: modelo,
                color: color,
                almacenamiento: almacenamiento,
                procesador: procesador
                })
            })
            .then(respuesta => respuesta.json())
            .then(data =>{
                // SOLUCIÓN: En lugar de usar obtenerTodos(), agregamos la fila manualmente al HTML
                // para que puedas ver el cambio reflejado en la tabla.
                let cuerpoTabla = document.getElementById("tblContenido");
                cuerpoTabla.innerHTML += `
                    <tr>
                        <td>${data.id || 'N/A'}</td>
                        <td>${data.marca}</td>
                        <td>${data.modelo}</td>
                        <td>${data.color}</td>
                        <td>${data.almacenamiento} GB</td>
                        <td>${data.procesador}</td>
                    </tr>
                `;
                alert(`Se ha agregado un nuevo archivo (Simulado):\nMarca: ${data.marca}\nModelo: ${data.modelo}`);
                
                // Limpiar inputs
                document.getElementById("inputMarca").value = "";
                document.getElementById("inputModelo").value = "";
                document.getElementById("inputColor").value = "";
                document.getElementById("inputAlmacenamiento").value = "";
                document.getElementById("inputProcesador").value = "";
        })
        .catch(error => { throw new Error("Error en la solicitud: " + error)})
    } catch(error){
        console.error(error);
    }
}

// NUEVA FUNCIÓN: Modificar un artículo
async function modificarUno() {
    try {
        let id = document.getElementById('txtConsulta').value;
        if(id === '') {
            alert("Primero debes consultar un artículo mediante su ID para modificarlo.");
            return;
        }

        let marca = document.getElementById('consultaNombre').value;
        let modelo = document.getElementById('consultaModelo').value;
        let color = document.getElementById('consultaColor').value;
        let almacenamiento = document.getElementById('consultaAlmacenamiento').value;
        let procesador = document.getElementById('consultaProcesador').value;

        axios.put('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/' + id, {
            marca: marca,
            modelo: modelo,
            color: color,
            almacenamiento: almacenamiento,
            procesador: procesador
        })
        .then(respuesta => {
            alert(`Dispositivo con ID ${id} modificado exitosamente.\n(Nota: Los cambios son simulados por la API)`);
            // Opcional: Actualizamos la tabla de manera visual si quieres ver el cambio reflejado inmediatamente
            obtenerTodos(); 
        })
        .catch(error => { alert("No se pudo modificar. Error: " + error); });
    } catch (error) {
        console.error(error);
    }
}

// NUEVA FUNCIÓN: Eliminar un artículo
async function eliminarUno() {
    try {
        let id = document.getElementById('txtConsulta').value;
        if(id === '') {
            alert("Introduce el ID del artículo que deseas eliminar.");
            return;
        }

        axios.delete('https://my-json-server.typicode.com/fedegaray/telefonos/dispositivos/' + id)
        .then(respuesta => {
            alert(`Dispositivo con ID ${id} eliminado exitosamente.\n(Nota: La eliminación es simulada por la API)`);
            obtenerTodos();
        })
        .catch(error => { alert("No se pudo eliminar. Error: " + error); });
    } catch (error) {
        console.error(error);
    }
}
