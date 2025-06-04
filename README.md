# Prueba Técnica Frontend – Angular

Este proyecto fue desarrollado como parte de una prueba técnica para el puesto de Desarollador Angular.  
Se trata de una app para gestionar productos financieros: permite listar, buscar, agregar, editar y eliminar con validaciones y buen manejo de errores.

El objetivo fue entregar una solución clara, mantenible y bien estructurada, aplicando buenas prácticas de desarrollo.

## Tecnologías

- Angular 17+
- TypeScript
- Jest para pruebas unitarias

## Instrucciones

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/StevenCalderon/reto-tecnico-dev-front-angular.git
   ```

2. Instala las dependencias del frontend
   ```bash
   cd bank-app
   npm install
   ```
3. Instala las dependencias y ejecuta el backend
   ```bash
    cd ../node-bank-server
    npm install
    npm run start:dev
   ```

4. Vuelve a la carpeta del frontend y ejecuta la app
   ```bash
   npm start
   ```

5. Ejecuta los tests unitarios
   ```bash
   npm run test
   ```

## Funcionalidades

- Listado con paginación y selección de registros
- Búsqueda dinámica
- Crear y editar con formularios reactivos y validaciones
- Eliminación con confirmación
- Pruebas unitarias con cobertura >70%
- Feedback visual de errores

## Notas

- La lógica está separada en funciones puras y servicios reutilizables.
- El proyecto está listo para ser revisado o explicado en entrevista.

Gracias por la oportunidad.
