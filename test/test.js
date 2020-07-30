/* eslint-disable func-names */
/* eslint-disable node/no-unpublished-require */
const chai = require("chai");

const { expect } = chai;

const chaiHttp = require("chai-http");
const { app, queryInfura, storeBlock } = require("../app");

chai.use(chaiHttp);

describe("Tests", function () {
  it("Query Infura", async function () {
    const response = await queryInfura();
    expect(response.result).to.not.equals(null);
  });

  it("Update Database with new blocks", async function () {
    const response = await storeBlock();
    expect(response).to.equals(true);
  });
  it("Get Blocks Endpoint", async function () {
    const res = await chai.request(app).get("/blocks").send();
    expect(res.statusCode).to.equals(200);
    expect(res.body.data).to.not.equals(null);
  });
});
