import express from 'express';
import pokemon from './schema/pokemon.js';
import pokemonRoutes from './route/route.js';  // ← Vous importez pokemonRoutes
import cors from 'cors'; 
import './connect.js';
import path from 'path';
import { fileURLToPath } from 'url';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  '/assets/pokemons',
  express.static(path.join(__dirname, 'assets/pokemons'))
);

app.use(cors());
app.use(express.json());
app.use('/api/pokemon', pokemonRoutes);  // ← Utilisez pokemonRoutes (pas route)

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/pokemons', async (req, res) => {
    try {
        const pokemons = await pokemon.find({});
        res.json(pokemons);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/pokemons/:id', async (req, res) => {
    try {
        const poke = await pokemon.findOne({ id: req.params.id });
        if (poke) {
            res.json(poke);
        } else {
            res.status(404).send('Pokemon not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(5000, () => {  // ← Changez 3000 en 5000
  console.log('Server is running on http://localhost:5000');
});