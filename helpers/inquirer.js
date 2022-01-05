const inquirer = require('inquirer');
require('colors');

const questions = [
    {
        type: 'list',
        name: 'option',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.green } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.green } Historial`
            },
            {
                value: 0,
                name: `${ '0.'.green } Salir`
            }
        ]
    }
]

const inquirerMenu = async() => {
    console.clear();
    console.log('+----------------------+'.green);
    console.log(`${ '|'.green } ${ 'Selecione una opción'.white} ${ '|'.green }`);
    console.log('+----------------------+\n'.green);

    const { option } = await inquirer.prompt(questions);

    return option;
}

const pausa = async() => {
    const question = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'ENTER'.green } para continuar`
        }
    ]
    console.log('\n')
    await inquirer.prompt(question) 
}

const leerInput = async(message) => {
    const question = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if (value.length === 0) {
                    return 'Por favor ingrese un valor'.red;
                }
                return true;
            }
        }
    ];
    const { desc } = await inquirer.prompt(question);
    return desc;
}

const listarCiudades = async( ciudades = [] ) => {

    const choices = ciudades.map( (ciudad, i) =>{

        let index = `${ i + 1 }`.green; 
        return{
            value: ciudad.id,
            name: `${ index } ${ ciudad.nombre }`
        }
    })

    choices.unshift({
        value: '0',
        name: '0. '.green + 'Cancelar'
    })

    const question = {
        type: 'list',
        name: 'id',
        message: 'Selecione una ciudad',
        choices
    }

    const { id } = await inquirer.prompt(question);
    return id;
}

const mostrarListadoChecklist = async( tareas = [] ) => {

    const choices = tareas.map( (tarea, i) =>{

        let index = `${ i + 1 }`.green; 
        return{
            value: tarea.id,
            name: `${ index } ${ tarea.desc }`,
            checked: ( tarea.completadoEn ) ? true : false
        }
    })

    const question = {
        type: 'checkbox',
        name: 'ids',
        message: 'Selecione',
        choices
    }

    const { ids } = await inquirer.prompt(question);
    return ids;
}
const confirm = async( message ) =>{
    const questions = {
        type: 'confirm',
        name: 'confirm',
        message
    }

    const { confirm } = await inquirer.prompt(questions);
    return confirm;
}

module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listarCiudades,
    mostrarListadoChecklist,
    confirm
}