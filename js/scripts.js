class Empleado {
    constructor(nombre, puesto, salario, identificador) {
        this.nombre = nombre;
        this.puesto = puesto;
        this.salario = parseFloat(salario);
        this.identificador = identificador;
    }
}

class Tienda {
    constructor() {
        this.empleados = this.cargarDesdeLocalStorage();
    }

    guardarEnLocalStorage() {
        localStorage.setItem("empleados", JSON.stringify(this.empleados));
    }

    cargarDesdeLocalStorage() {
        const data = localStorage.getItem("empleados");
        return data ? JSON.parse(data) : [];
    }

    agregarEmpleado(empleado) {
        this.empleados.push(empleado);
        this.guardarEnLocalStorage();
    }

    eliminarEmpleado(id) {
        this.empleados = this.empleados.filter(e => e.identificador !== id);
        this.guardarEnLocalStorage();
    }

    obtenerEmpleados() {
        return this.empleados;
    }

    filtrarPorPuesto(puesto) {
        return this.empleados.filter(e => 
            e.puesto.toLowerCase().includes(puesto.toLowerCase())
        );
    }

    ordenarPorSalario() {
        return [...this.empleados].sort((a, b) => a.salario - b.salario);
    }
}

const tienda = new Tienda();
const contenedor = document.getElementById("resultado");

function render(lista) {
    contenedor.innerHTML = "";

    if (lista.length === 0) {
        contenedor.innerHTML = "<p>No hay empleados registrados.</p>";
        return;
    }

    lista.forEach(emp => {
        const div = document.createElement("div");

        div.innerHTML = `
            <p>
                <strong>${emp.nombre}</strong> - ${emp.puesto} 
                - $${emp.salario} 
                (ID: ${emp.identificador})
                <button onclick="eliminar('${emp.identificador}')">Eliminar</button>
            </p>
        `;

        contenedor.appendChild(div);
    });
}

document.getElementById("btnAgregarEmpleado").addEventListener("click", agregarEmpleado)
function agregarEmpleado() {
    const nombre = document.getElementById("nombre").value;
    const puesto = document.getElementById("puesto").value;
    const salario = document.getElementById("salario").value;
    const id = document.getElementById("id").value;

    if (!nombre || !puesto || !salario || !id) {
        alert("Completa todos los campos");
        return;
    }

    const empleado = new Empleado(nombre, puesto, salario, id);
    tienda.agregarEmpleado(empleado);

    mostrar();

    document.getElementById("nombre").value = "";
    document.getElementById("puesto").value = "";
    document.getElementById("salario").value = "";
    document.getElementById("id").value = "";
}

document.getElementById("btnmostrar").addEventListener("click", mostrar)
function mostrar() {
    render(tienda.obtenerEmpleados());
}

function eliminar(id) {
    tienda.eliminarEmpleado(id);
    mostrar();
}

document.getElementById("btnfiltrar").addEventListener("click", filtrar)
function filtrar() {
    const puesto = document.getElementById("filtro").value;
    const resultado = tienda.filtrarPorPuesto(puesto);

    if (resultado.length === 0) {
        contenedor.innerHTML = "<p>No hay resultados para ese filtro.</p>";
        return;
    }

    render(resultado);
}

document.getElementById("btnordenar").addEventListener("click", ordenar)
function ordenar() {
    const ordenados = tienda.ordenarPorSalario();
    render(ordenados);
}

window.onload = mostrar;