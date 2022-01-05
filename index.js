require('dotenv').config();
const { inquirerMenu, pausa, leerInput, listarCiudades } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

 const main = async() =>{

    let opcion;
    const busquedas = new Busquedas();


    do {

        opcion = await inquirerMenu();
        switch (opcion) {
            case 1:
                // Mostrar input al usuario
                const busqueda = await leerInput('Ciudad: ');

                // Buscar la ciudad
                const ciudades = await busquedas.ciudades(busqueda);
                
                //Seleccionar la ciudad
                const id = await listarCiudades(ciudades);
                if ( id === '0') continue; 
                const { nombre, latitud, longitud } = ciudades.find( ciudad => ciudad.id === id );
                busquedas.agregarHistorial(nombre);

                //Clima
                const { clima, minima, maxima, temperatura } = await busquedas.climaCiudad(latitud, longitud);

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:',nombre.green);
                console.log('Latitud:',latitud);
                console.log('Longitud:',longitud);
                console.log('Temperatura:',temperatura);
                console.log('Mínima:',minima);
                console.log('Máxima:',maxima);
                console.log('Como está el clima:',clima.green);

                break;
            case 2:
                // Historial
                busquedas.historialCapitalizado.forEach( (ciudad, i) => {
                    const index = `${ i + 1 }.`.green;
                    console.log( `${ index } ${ ciudad }` ) 
                });
                break;              
        }

        await pausa();
        
    } while (opcion !== 0);


 }

 main();