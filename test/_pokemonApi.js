const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { setupServer } = require("../src/server");
chai.should();

/*
 * This sprint you will have to create all tests yourself, TDD style.
 * For this you will want to get familiar with chai-http https://www.chaijs.com/plugins/chai-http/
 * The same kind of structure that you encountered in lecture.express will be provided here.
 */
const server = setupServer();

describe("Pokemon API Server", () => {
  let request;
  beforeEach(() => {
    request = chai.request(server);
  });

  describe("GET /api/pokemon", () => {
    it("should return the full list of Pokemon", async () => {
      const res = await request.get("/api/pokemon");
      res.should.have.status(200);
      res.should.be.json;
      // console.log(res);
      //testing the length
      //deeply equal object
      // Target object deeply (but not strictly) equals `{a: 1}`
      //there should be 151 pokemon
    });
  });

  describe("GET /api/pokemon - dealing with query parameters", () => {
    it("should return the first n Pokemon", async () => {
      const test = 5;
      const res = await request.get("/api/pokemon").query({ number: test });
      res.body.should.have.lengthOf(5);
    });
  });

  describe("POST /api/pokemon", () => {
    it("should add new Pokemon", async () => {
      const newPokemon = {
        id: "152",
        name: "Yuyaka",
        classification: "Seed Pokémon",
        types: ["Grass", "Poison"],
        resistant: ["Water", "Electric", "Grass", "Fighting", "Fairy"],
        weaknesses: ["Fire", "Ice", "Flying", "Psychic"],
        weight: {
          minimum: "6.04kg",
          maximum: "7.76kg",
        },
        height: {
          minimum: "0.61m",
          maximum: "0.79m",
        },
        fleeRate: 0.1,
        evolutionRequirements: {
          amount: 25,
          name: "Bulbasaur candies",
        },
        evolutions: [
          {
            id: 2,
            name: "Ivysaur",
          },
          {
            id: 3,
            name: "Venusaur",
          },
        ],
        maxCP: 951,
        maxHP: 1071,
        attacks: {
          fast: [
            {
              name: "Tackle",
              type: "Normal",
              damage: 12,
            },
            {
              name: "Vine Whip",
              type: "Grass",
              damage: 7,
            },
          ],
          special: [
            {
              name: "Power Whip",
              type: "Grass",
              damage: 70,
            },
            {
              name: "Seed Bomb",
              type: "Grass",
              damage: 40,
            },
            {
              name: "Sludge Bomb",
              type: "Poison",
              damage: 55,
            },
          ],
        },
      };
      const res = await request.post("/api/pokemon").query(newPokemon);
      res.body.should.have.lengthOf(152);
    });
  });

  describe("GET /api/pokemon/:idOrName", () => {
    it("should return the Pokemon with the given id", async () => {
      const res = await request.get("/api/pokemon/45");
      const pokemonName = "Vileplume";
      res.body.name.should.equal(pokemonName);
    });
  });

  describe("GET /api/pokemon/:name", () => {
    it("should return the Pokemon with the given name", async () => {
      const res = await request.get("/api/pokemon/Mew");
      const pokemonName = "Mew";
      res.body.name.should.equal(pokemonName);
    });
  });

  describe("PATCH /api/pokemon/:idOrName", () => {
    it("should allow you to make partial modifications to a Pokemon", async () => {
      const res = await request
        .patch("/api/pokemon/Mew")
        .query({ newIdOrName: "Flower" });
      const pokemonName = "Flower";
      res.body.name.should.equal(pokemonName);
    });

    it("should allow you to make partial modifications to a Pokemon", async () => {
      const res = await request
        .patch("/api/pokemon/45")
        .query({ newIdOrName: "Flower" });
      const pokemonName = "Flower";
      res.body.name.should.equal(pokemonName);
    });
  });
  //body request
  //postman
  //insomnia

  describe("DELETE /api/pokemon/:idOrName", () => {
    it("should delete the given Pokemon", async () => {
      const res = await request.delete("/api/pokemon/Mew");
      res.body.should.have.lengthOf(151);
    });

    it("should delete the given Pokemon", async () => {
      const res = await request.delete("/api/pokemon/45");
      res.body.should.have.lengthOf(150);
    });
  });

  describe("GET /api/pokemon/:idOrName/evolutions", () => {
    it("should return the evolutions a Pokemon has. if pokemon don't have evolutions, it should return an empty array in this case", async () => {
      const res = await request.get("/api/pokemon/staryu/evolutions");
      res.should.be.a("array"); //[ { "id": 121, "name": "Starmie" } ]
      res[0].id.should.be(121);
    });
  });
});
