const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const multer = require('multer');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
//app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Multer para manejar la subida de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const config = {
    server: 'localhost', // Cambia esto si SQL Server está en una dirección diferente
    database: 'Utesa_db',
    user: 'utesauser',
    password:'utesauser123#',
    options: {
        enableArithAbort: true,
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true,
    },
};

// Conexión a la base de datos
sql.connect(config)
    .then(pool => {
        console.log('Conexión exitosa a SQL Server');
    })
    .catch(err => {
        console.error('Error al conectar a SQL Server:', err);

        res.status(500).json({ error: 'Error al conectar a la base de datos. Inténtalo de nuevo más tarde.' });
    });

app.post('/registrar', upload.single('rutaFoto'), async (req, res) => {
    const { id, nombre, correo, telefono } = req.body;

    const rutaFoto = req.file ? req.file.path : null;

    try {
        const pool = await sql.connect(config);
        const query = `INSERT INTO Profesores (id, nombre, correo, telefono, rutaFoto) 
                       VALUES (@id, @nombre, @correo, @telefono, @rutaFoto)`;

        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .input('nombre', sql.VarChar, nombre)
            .input('correo', sql.VarChar, correo)
            .input('telefono', sql.VarChar, telefono)
            .input('rutaFoto', sql.VarChar, rutaFoto)
            .query(query);

        res.status(201).json({ message: 'Registro exitoso.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al registrar. Inténtalo de nuevo más tarde.' });
    }
    finally {
        // Siempre cerramos la conexión después de usarla
        sql.close();
    }

});

app.get('/consultar/:id', async (req, res) => {
    const consultaId = req.params.id;

    try {
        const pool = await sql.connect(config);
        const query = `SELECT id, nombre, correo, telefono, rutaFoto FROM Profesores WHERE id = @consultaId`;
        const result = await pool.request()
            .input('consultaId', sql.VarChar, consultaId)
            .query(query);

            if (result.recordset.length > 0) {
                const data = result.recordset[0];
                res.status(200).json({
                    id: data.id,
                    nombre: data.nombre,
                    correo: data.correo,
                    telefono: data.telefono,
                    rutaFoto: data.rutaFoto // Asegúrate de incluir la ruta de la imagen
                });
            } else {
                res.status(404).json({ message: 'Profesor no encontrado.' });
            }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al consultar. Inténtalo de nuevo más tarde.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
