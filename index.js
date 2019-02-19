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

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  CREATE Requests  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// POST to the api/zoos table
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

//POST to the bears table
server.post('/bears', async (req, res) => {
  try{
    if (req.body.name == '' || req.body.name == null) {
      res.status(406).json({message: 'Please fill in the name of the bear'});
    } else {
        const [id] = await db('bears')
        .insert(req.body);
   
        res.status(201).json(id);
      }
    
  } catch (error) {
      res.status(500).json({error: 'There was an error adding a bear'});
  }
});

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    RECEIVE Requests    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//GET from the /api/zoos table
server.get('/api/zoos', async (req, res) => {
  try {
    const zoos = await db('zoos');
    res.status(200).json(zoos);
  } catch (error) {
    res.status(500).json(error);
  }
});

//GET from the /bears table
server.get('/bears', async (req, res) => {
  try {
    const bears = await db('bears');
    res.status(200).json(bears);
  } catch (error) {
    res.status(500).json(error);
  }
});


//GET from the /api/zoos table by id
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

//GET from the /bears table by id
server.get('/bears/:id', async (req, res) => {
  try {
    const bear = await db('bears')
    .where({id: req.params.id})
    .first();

    if (bear) {
      res.status(200).json(bear);
    } else {
      res.status(404).json({ message: "Bear not found"});
    }
    
  } catch (error) {
    res.status(500).json(error);
  }
});


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<    UPDATE Requests    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//PUT an updated item to the /api/zoos table - requires id
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


//PUT an updated item to the /bears table - requires id
server.put('/bears/:id', async (req, res) => {
  try {
    const changes = await db('bears')
    .where({id: req.params.id})
    .update(req.body);

    if (changes > 0) {
      const bear = await db('bears')
      .where({id: req.params.id})
      .first();
      res.status(200).json(bear);
    } else {
      res.status(404).json({message: 'That bear is not in our database'});
    }
  } catch (error) {
      res.status(500).json({error});
  }
});


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  DELETE Requests  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

//DELETE from the /api/zoos table - requires item id
server.delete('/api/zoos/:id', async (req, res) => {
  try {
    const count = await db('zoos')
    .where({id: req.params.id})
    .del();

    if(count > 0) {
      res.status(202).json({message: 'That zoo has been deleted from our records'});
    } else {
      res.status(404).json({message: 'That zoo is not in our database'});
    }
    
  } catch (error) {
      res.status(500).json({message: 'There has been a terrible error'});
  }
});

//DELETE from the /bears table - requires item id
server.delete('/bears/:id', async (req, res) => {
  try {
    const count = await db('bears')
    .where({id: req.params.id})
    .del();

    if(count > 0) {
      res.status(202).json({message: 'That bear has been removed from the records'});
    } else {
      res.status(404).json({message: 'That bear is not in our database'});
    }
    
  } catch (error) {
      res.status(500).json({message: 'There has been a terrible error'});
  }
});


const port = process.env.PORT || 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
