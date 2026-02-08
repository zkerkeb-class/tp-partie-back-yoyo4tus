import express from 'express';
import Pokemon from '../schema/pokemon.js';

const router = express.Router();

// GET tous les pokemons avec pagination (20 par page)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const pokemons = await Pokemon.find().skip(skip).limit(limit).sort({ id: 1 });
    const total = await Pokemon.countDocuments();

    res.json({
      pokemons,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET recherche par nom
router.get('/search', async (req, res) => {
  try {
    const { name } = req.query;
    const pokemon = await Pokemon.findOne({
      'name.english': new RegExp(name, 'i')
    });
    
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokemon non trouvé' });
    }
    
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET un pokemon par ID
router.get('/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findById(req.params.id);
    
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokemon non trouvé' });
    }
    
    res.json(pokemon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST créer un nouveau pokemon
router.post('/', async (req, res) => {
  try {
    // Trouver le dernier ID pour auto-incrémenter
    const lastPokemon = await Pokemon.findOne().sort({ id: -1 });
    const newId = (lastPokemon?.id || 0) + 1;

    const newPokemon = new Pokemon({
      ...req.body,
      id: newId
    });

    await newPokemon.save();
    res.status(201).json(newPokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// PUT modifier un pokemon
router.put('/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokemon non trouvé' });
    }
    
    res.json(pokemon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// DELETE supprimer un pokemon
router.delete('/:id', async (req, res) => {
  try {
    const pokemon = await Pokemon.findByIdAndDelete(req.params.id);
    
    if (!pokemon) {
      return res.status(404).json({ error: 'Pokemon non trouvé' });
    }
    
    res.json({ message: 'Pokemon supprimé', pokemon });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
