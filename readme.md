## Prerrequisitos

### Instale Nodejs v12.14.0 para [Windows](https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi). Si usa Linux por favor instale [nvm](https://github.com/nvm-sh/nvm)

## Instalación

### Descargue todas las dependencias del proyecto con el comando

`npm install`

## Ejecución

### Inicie el programa con el comando

`npm start`

## Configuración

### Puede cambiar los diferentes parámetros del programa cambiando el valor de ciertas variables de entorno:

- **ASIENTOS**: El número de asientos para su reserva
- **PELICULA**: El nombre exacto de la película a reservar tal y como aparece en la página de cinesa.es
- **TIPO_DE_SALA**: El tipo de sala a reservar, **_sensible a mayúsculas_**. Puede ser <_Digital, VOSE_>
- **FECHA**: La fecha de la reserva tal y como aparece en cinesa.es, en el formato **_DD/MM_** eg. _30/12_
- **HORA**: La hora de la reserva tal y como aparece en cinesa.es, en el formato **_hh:mm_** eg. _08:15_
- **INSTANCIAS**: El número de trabajadores concurrentes. Un mayor número de instancias mejora el rendimiento siempre y cuando su PC pueda con la carga; de lo contrario el rendimiento del programa se verá afectado negativamente. **_Recomendado: 3_**
