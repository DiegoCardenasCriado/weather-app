const fs = require('fs');
const axios = require('axios');


class Busquedas {
    historial = [];
    path = './db/database.json'

    constructor() {
        this.leerBD();
        
    }

    get paramsMapbox() {
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }
    get paramsWheater() {
        return {
            'appid': process.env.OPENWHEATER_KEY,
            'units': 'metric',
            'lang': 'es'
        }
    }

    get historialCapitalizado() {
        return this.historial.map( ciudad => {
            let palabras = ciudad.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));

            return palabras.join(' ');
        })
    }

    async ciudades( ciudad = '' ) {
        try {
            // Realizar petición HTPP
            // console.log('ciudad: ', ciudad);

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ciudad}.json`,
                params: this.paramsMapbox
            });

            const result = await intance.get();
            return result.data.features.map( ciudad =>({
                id: ciudad.id,
                nombre: ciudad.place_name,
                longitud: ciudad.center[0],
                latitud: ciudad.center[1]
            }));

        } catch (error) {
            return [];
        }
    }

    async climaCiudad( lat, lon ) {

        try {

            const intance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWheater, lat, lon}
            });

            const result = await intance.get();
            const { weather, main } = result.data;

            return {
                clima: weather[0].description,
                minima: main.temp_min,
                maxima: main.temp_max,
                temperatura: main.temp,
            }
        } catch (error) {
            console.log('Error')
            
        }
    }

    agregarHistorial(  ciudad = '') {

        if ( this.historial.includes( ciudad.toLocaleLowerCase() )) {
            return;
        }

        this.historial = this.historial.splice(0,5);
        
        this.historial.unshift( ciudad.toLocaleLowerCase() );

        this.guardarBD();
    }

    guardarBD() {

        const payload = {
            historial: this.historial
        };
        fs.writeFileSync(this.path, JSON.stringify( payload ));
    }

    leerBD() {
        if ( !fs.existsSync( this.path ) ) return;

        const info = fs.readFileSync(this.path, {encoding: 'utf-8'});
        const data = JSON.parse(info);

        this.historial = data.historial;

    }
    }
    
        
module.exports = Busquedas;