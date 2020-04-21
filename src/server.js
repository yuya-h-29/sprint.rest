const express = require("express");
const _ = require("underscore");
const pokeData = require("./data");

const setupServer = () => {
  const app = express();
  const fullArrayOfPokemon = pokeData.pokemon;

  app.get("/api/pokemon", (request, response) => {
    const returnArrayOfPokemon = [];
    if (request.query.limit) {
      const number = request.query.limit;
      for (let i = 0; i < number; i++) {
        returnArrayOfPokemon.push(fullArrayOfPokemon[i]);
      }
    } else {
      for (let i = 0; i < fullArrayOfPokemon.length; i++) {
        returnArrayOfPokemon.push(fullArrayOfPokemon[i]);
      }
    }
    response.send(returnArrayOfPokemon);
  });

  app.post("/api/pokemon", (request, response) => {
    const newPokemon = request.query;
    console.log(request.query);
    fullArrayOfPokemon.push(newPokemon);
    response.send(fullArrayOfPokemon);
  });

  app.get("/api/pokemon/:idOrName", (request, response) => {
    const idOrName = request.params.idOrName;
    let pokemon;
    if (Number(idOrName)) {
      pokemon = fullArrayOfPokemon[idOrName - 1];
    } else {
      const capitalizeIdOrName =
        idOrName.charAt(0).toUpperCase() + idOrName.slice(1);
      for (let i = 0; i < fullArrayOfPokemon.length; i++) {
        if (fullArrayOfPokemon[i].name === capitalizeIdOrName) {
          pokemon = fullArrayOfPokemon[i];
        }
      }
    }
    response.send(pokemon);
  });

  // app.patch("/api/pokemon/:idOrName", (request, response) => {
  //   const newIdOrName = request.query.newIdOrName;
  //   const idOrName = request.params.idOrName;
  //   let pokemon;
  //   if (Number(idOrName)) {
  //     pokemon = fullArrayOfPokemon[idOrName - 1];
  //   } else {
  //     for (let i = 0; i < fullArrayOfPokemon.length; i++) {
  //       if (fullArrayOfPokemon[i].name === idOrName) {
  //         pokemon = fullArrayOfPokemon[i];
  //       }
  //     }
  //   }
  //   response.send(pokemon);
  // });

  app.delete("/api/pokemon/:idOrName", (request, response) => {
    const idOrName = request.params.idOrName;

    if (Number(idOrName)) {
      fullArrayOfPokemon.splice([idOrName - 1], 1);
    } else {
      for (let i = 0; i < fullArrayOfPokemon.length; i++) {
        if (fullArrayOfPokemon[i].name === idOrName) {
          fullArrayOfPokemon.splice([i], 1);
        }
      }
    }
    response.send(fullArrayOfPokemon);
  });

  app.get("/api/pokemon/:idOrName/evolutions", (request, response) => {
    const idOrName = request.params.idOrName;
    let pokemon;
    if (Number(idOrName)) {
      pokemon = fullArrayOfPokemon[idOrName - 1];
    } else {
      const capitalizeIdOrName =
        idOrName.charAt(0).toUpperCase() + idOrName.slice(1);
      for (let i = 0; i < fullArrayOfPokemon.length; i++) {
        if (fullArrayOfPokemon[i].name === capitalizeIdOrName) {
          pokemon = fullArrayOfPokemon[i];
        }
      }
    }
    response.send(pokemon.evolutions);
  });

  app.get("/api/pokemon/:idOrName/evolutions/previous", (request, response) => {
    const idOrName = request.params.idOrName;
    let pokemon;
    if (Number(idOrName)) {
      pokemon = fullArrayOfPokemon[idOrName - 1];
    } else {
      const capitalizeIdOrName =
        idOrName.charAt(0).toUpperCase() + idOrName.slice(1);
      for (let i = 0; i < fullArrayOfPokemon.length; i++) {
        if (fullArrayOfPokemon[i].name === capitalizeIdOrName) {
          pokemon = fullArrayOfPokemon[i];
        }
      }
    }
    response.send(pokemon["Previous evolution(s)"]);
  });

  app.get("/api/types", (request, response) => {
    const returnArrayTypes = [];

    for (let i = 0; i < fullArrayOfPokemon.length; i++) {
      returnArrayTypes.push(fullArrayOfPokemon[i].types);
    }

    const flattenedArray = _.flatten(returnArrayTypes);
    const uniqArray = _.uniq(flattenedArray);

    if (request.query.limit) {
      const number = request.query.limit;
      const possibleTypes = [];
      for (let i = 0; i < number; i++) {
        possibleTypes.push(uniqArray[i]);
      }
      response.send(possibleTypes);
    } else {
      response.send(uniqArray);
    }
  });

  //come back to fix since response.send doesn't display new type
  app.post("/api/types", (request, response) => {
    const returnArrayTypes = [];

    for (let i = 0; i < fullArrayOfPokemon.length; i++) {
      returnArrayTypes.push(fullArrayOfPokemon[i].types);
    }

    const flattenedArray = _.flatten(returnArrayTypes);
    const uniqArray = _.uniq(flattenedArray);
    const newType = request.query.type;
    uniqArray.push(newType);
    response.send(uniqArray);
  });

  app.delete("/api/types/:name", (request, response) => {
    const returnArrayTypes = [];
    for (let i = 0; i < fullArrayOfPokemon.length; i++) {
      returnArrayTypes.push(fullArrayOfPokemon[i].types);
    }
    const flattenedArray = _.flatten(returnArrayTypes);
    const uniqArray = _.uniq(flattenedArray);

    const name = request.params.name;

    for (let i = 0; i < uniqArray.length; i++) {
      if (uniqArray[i] === name) {
        uniqArray.splice(i, 1);
      }
    }

    response.send(uniqArray);
  });

  app.get("/api/types/:type/pokemon", (request, response) => {
    const type = request.params.type;
    let resultArr = [];

    for (let i = 0; i < fullArrayOfPokemon.length; i++) {
      if (fullArrayOfPokemon[i].types.includes(type)) {
        const returnObj = {};
        returnObj.id = fullArrayOfPokemon[i].id;
        returnObj.name = fullArrayOfPokemon[i].name;
        resultArr.push(returnObj);
      }
    }
    response.send(resultArr);
  });

  app.get("/api/attacks", (request, response) => {
    const returnArrayAttacks = [];

    for (let i = 0; i < fullArrayOfPokemon.length; i++) {
      const attackObj = fullArrayOfPokemon[i].attacks;
      for (const key in attackObj) {
        returnArrayAttacks.push(attackObj[key]);
      }
    }

    const flattenedArray = _.flatten(returnArrayAttacks);
    const uniqArray = _.uniq(flattenedArray);

    if (request.query.limit) {
      const number = request.query.limit;
      const possibleAttacks = [];
      for (let i = 0; i < number; i++) {
        possibleAttacks.push(uniqArray[i]);
      }
      response.send(possibleAttacks);
    } else {
      response.send(uniqArray);
    }
  });

  // - `GET /api/attacks/fast`
  // - It should return fast attacks
  // - It is able to take a query parameter `limit=n` that makes the endpoint only return `n` attacks

  app.get("/api/attacks/fast", (request, response) => {
    const returnArrayAttacks = [];
    for (let i = 0; i < fullArrayOfPokemon.length; i++) {
      returnArrayAttacks.push(fullArrayOfPokemon[i].attacks.fast);
    }
    const flattenedArray = _.flatten(returnArrayAttacks);

    //create array of attacks using unique attack names
    // let uniqAttacks = [];
    let pushed = {};
    let result = [];

    for (let i = 0; i < flattenedArray.length; i++) {
      if (!pushed[flattenedArray[i].name]) {
        result.push(flattenedArray[i]);
        pushed[flattenedArray[i].name] = true;
      }
    }

    if (request.query.limit) {
      const number = request.query.limit;
      const possibleAttacks = [];
      for (let i = 0; i < number; i++) {
        possibleAttacks.push(result[i]);
      }
      response.send(possibleAttacks);
    } else {
      response.send(result);
    }
  });

  return app;
};

module.exports = { setupServer };
