const { Pool } = require('pg');
const moment = require('moment');

const pool = new Pool({

    user: 'postgres',
    host: 'localhost',
    password: 'alguien1234',
    database: 'bancosolar',
    port: 5432

});

const insertUsuario = async (data) => {

    const consulta = {

        text: 'INSERT INTO usuarios(nombre, balance, estado) VALUES($1, $2, true) RETURNING *',
        values: data

    };

    try {

        const res = await pool.query(consulta);
        console.log('Resultado: ', res.rows[0]);
        return res;

    } catch (error) {

        console.log('Ha ocurrido un error. Código: ', error.code);
        return error.code;

    };

};

const selectUsuarios = async () => {

    try {

        const res = await pool.query('SELECT * FROM usuarios WHERE estado = true ORDER BY id ASC');
        return res;

    } catch (error) {

        console.log('Ha ocurrido un error. Código: ', error.code);
        return error.code;

    };

};

const updateUsuario = async (data) => {

    const consulta = {

        text: 'UPDATE usuarios SET nombre = $2, balance = $3 WHERE id = $1 RETURNING * ',
        values: data

    };

    try {

        const res = await pool.query(consulta);
        console.log('Resulado: ', res.rows[0]);
        return res;

    } catch (error) {

        console.log('Ha ocurrido un error. Código: ', error.code);
        return error.code;

    };

};

const deleteUsuario = async (id) => {

    try {

        const res = await pool.query(`UPDATE usuarios SET estado = false WHERE id = ${id}`);
        console.log('Registros eliminados: ', res.rowCount);
        return res.rowCount;

    } catch (error) {

        console.log('Ha ocurrido un error. Código: ', error.code);
        return error.code;

    };

};

const nuevaTransferencia = async (data) => {

    const consultaInsert = {

        text: `INSERT INTO transferencias(emisor, receptor, monto, fecha) VALUES((SELECT id FROM usuarios WHERE nombre = $1), (SELECT id FROM usuarios WHERE nombre = $2), $3, '${moment().format("L")} ${moment().format("LTS")}') RETURNING *`,
        values: [data[0], data[1], Number(data[2])]

    };

    const updateEmisor = {

        text: 'UPDATE usuarios SET balance = balance - $2 WHERE id = (SELECT id FROM usuarios WHERE nombre = $1)',
        values: [data[0], Number(data[2])]

    };

    const updateReceptor = {

        text: 'UPDATE usuarios SET balance = balance + $2 WHERE id = (SELECT id FROM usuarios WHERE nombre = $1)',
        values: [data[1], Number(data[2])]

    };

    try {

        await pool.query('BEGIN TRANSACTION');
        await pool.query(consultaInsert);
        await pool.query(updateEmisor);
        await pool.query(updateReceptor);
        await pool.query('COMMIT');
        return true;

    } catch (error) {

        await pool.query('ROLLBACK');
        console.log('Ha ocurrido un error. Código: ', error.code);
        return error.code;

    };

};

const selectTransferencias = async () => {

    try {

        const consulta = {

            rowMode: 'array',
            text: 'SELECT fecha, (SELECT nombre FROM usuarios WHERE usuarios.id = transferencias.emisor), (SELECT nombre FROM usuarios WHERE usuarios.id = transferencias.receptor), monto FROM transferencias INNER JOIN usuarios ON transferencias.emisor = usuarios.id'

        };

        const res = await pool.query(consulta);
        return res.rows;

    } catch (error) {

        console.log('Ha ocurrido un error. Código: ', error.code);
        return error.code;

    };

};

module.exports = { insertUsuario, selectUsuarios, updateUsuario, deleteUsuario, nuevaTransferencia, selectTransferencias };