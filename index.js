const express = require('express');
const helmet = require('helmet');

const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true,
}

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

server.post('/api/zoos', async (req, res) => {
  try{
    if (req.body.name == '' || req.body.name == null) {
      res.status(406).json({message: 'Please fill in the zoo name'});
    } else {
        const [id] = await db('zoos')
        .insert(req.body);
   
        res.status(201).json(id);
      }
    
  } catch (error) {
      res.status(500).json({error: 'There was an error adding a zoo'});
  }
});

server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

server.get('/api/zoos/:id', async (req, res) => {
  try {
    const zoo = await db('zoos')
    .where({id: req.params.id})
    .first();

    if (zoo) {
      res.status(200).json(zoo);
    } else {
      res.status(404).json({ message: "Zoo not found"});
    }
    
  } catch (error) {
    res.status(500).json(error);
  }
});

server.put('/api/zoos/:id', async (req, res) => {
  try {
    const changes = await db('zoos')
    .where({id: req.params.id})
    .update(req.body);

    if (changes > 0) {
      const zoo = await db('zoos')
      .where({id: req.params.id})
      .first();
      res.status(200).json(zoo);
    } else {
      res.status(404).json({message: 'That zoo is not in our database'});
    }
  } catch (error) {
      res.status(500).json({error});
  }
});

server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
    .where({id: req.params.id})
    .del();

    if(count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({message: 'That zoo is not in our database'});
    }
    
  } catch (error) {
      res.status(500).json({message: 'There has been a terrible error'});
  }
});


const port = process.env.PORT || 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
