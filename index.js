const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const productRoutes = require('./src/routes/productRoutes');
const axios = require('axios');
const userRoutes = require('./src/routes/userRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

dotenv.config();
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true,
};


const app = express();

const allowedOrigins = ['http://localhost:9000'];

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/carts', cartRoutes);

app.use((err, req, res, next) => {
    console.error(`Error: ${err.message}`);
    res.status(err.status || 500).json({
        error: {
            message: err.message
        }
    });
});


app.listen(PORT, () => {
    console.log(`BFF layer running on http://localhost:${PORT}`);
}).on('error', (err) => {
    console.error('Failed to start server:', err);
});


