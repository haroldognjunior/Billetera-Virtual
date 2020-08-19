<p align='left'>
    <img src='https://static.wixstatic.com/media/85087f_0d84cbeaeb824fca8f7ff18d7c9eaafd~mv2.png/v1/fill/w_160,h_30,al_c,q_85,usm_0.66_1.00_0.01/Logo_completo_Color_1PNG.webp' </img>
</p>

# Proyecto Fintech - Henry Bank

Henry Bank es el proyecto final realizado por un grupo de estudiantes para la institución [Henry](https://www.linkedin.com/school/soyhenry/) con el fin de graduarse como Full Stack Web developers. Henry Bank es el resultado de un proyecto desafiante construído desde cero, integrando en la misma todos los conocimientos adquiridos durante el programa educativo en [Henry](https://www.linkedin.com/school/soyhenry/).
<br><br>
La aplicación se trata de un Banco Digital en la cual una persona puede transitar por los procesos de registro de usuario, login, envío, recepción y recarga de dinero. Además, es posible realizar transferencias de moneda hacia establecimientos comerciales y operar mediante un CVU (clave virtual uniforme). Es posible agregar a mi lista de contactos otros usuarios de Henry Bank y visualizar mis estadísticas transaccionales de acuerdo a mi actividad en la aplicación.

## Comenzando :rocket:

Este proyecto está dividido en dos grandes secciones correspondientes al Frontend (client) y al Backend (api).
<br><br>
<i>Estas instrucciones te permitirán obtener una copia del proyecto en funcionamiento en tu máquina local para propósitos de desarrollo y pruebas.</i>
<br>

## Pre-requisitos :clipboard:

Debes tener instalado [Node.js](https://nodejs.org/es/download/) que incluye el sistema de gestión de paquetes [npm](https://www.npmjs.com/). Además, debes tener instalado el sistema de gestión de bases de datos relacional [PostgreSQL](https://www.postgresql.org/download/)
<br><br>
Es importante tener en cuenta que para correr la aplicación debes generar tu [API Key de Google](https://developers.google.com/maps/documentation/javascript/get-api-key) y requerirlo en la línea 6 en /henry-bank-ft02/api/src/routes/auth.js

```javascript
const { GOOGLE_API_KEY } = 'YOUR GOOGLE API KEY';
```


## Clonar el repo :floppy_disk:

Clonar el repositorio en la ubicación que elijas.

```bash
git clone https://github.com/soyHenry/henry-bank-ft02.git
```

## Instalación :computer:

En ambos directorios (client y api), debes ejecutar

```bash
npm install --save
```

## Ejecución :boat:

Abrir postgres.

En ambos directorios (client y api), debes ejecutar lo siguiente

```bash
npm start
```
Por defecto, el Frontend se ejecutará en http://localhost:3000 y el Backend en http://localhost:3001
<br><br>

# Construido con :hammer:

* [PostgreSQL](https://www.postgresql.org/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/en/)
* [npm](https://www.npmjs.com/)
* [Sequelize](https://sequelize.org/)
<br><br>

# Contributors :busts_in_silhouette:

* [Cristian Morales](https://www.linkedin.com/in/cristiansmorales/)
* [Diego Bautista]()
* [Júnior Nogueira](https://www.linkedin.com/in/júnior-nogueira-34826261/)
* [Germán Cejas](https://www.linkedin.com/in/german-cejas/)
* [Martín Russo](https://www.linkedin.com/in/martin-russo/)
* [Mauricio Ariel Arizaga Fabregas](https://www.linkedin.com/in/mauricioarielarizaga/)
* [Wolney Sandoval Vejar](https://www.linkedin.com/in/wolney-sandoval-vejar-851533a5/)