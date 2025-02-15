import request from "supertest";

const baseUrl = "http://localhost:7002";

describe("Password", () => {
  it("no body", async () => {
    const response = await request(baseUrl)
      .post("/password")
      .expect(400)
      .expect("Content-Type", /json/);

    expect(response.body).toEqual({
      statusCode: 400,
      code: "FST_ERR_VALIDATION",
      error: "Bad Request",
      message: "body must be object",
    });
  });

  let account_id;

  it("create account", async () => {
    const exists = await request(baseUrl).get(`/credential-testingd@email.fr`)
    if (exists?.body?.id) {
      console.error("ok!");
      await request(baseUrl).delete(`/${exists?.body?.id}`)
    }
    console.error("pas!!");
    const response = await request(baseUrl)
      .post("/password")
      .send({
        email: "credential-testingd@email.fr",
        hash: "02b1d478517f93d8cee16fa22e15437d58a7629b7aae6916b192f803b4014d74cceabf00e88cb8c8b89de277f75cda6379e7f0576a32ca2f0802d4e77650f68f",
        salt: "c77568641c27c0ec939d5e48e1ce673e2101d4ab187e5151e2feb27828e46365",
      })
      .expect(201)
      .expect("Content-Type", /json/);

    account_id = response.body.account.id;
    expect(response.body).toEqual({
      statusCode: 400,
      code: "FST_ERR_VALIDATION",
      error: "Bad Request",
      message: "body must be object",
    });

    it("delete account", async () => {
      const response = await request(baseUrl)
        .delete(`/${account_id}`)
        .expect(201)
        .expect("Content-Type", /json/);

      expect(response.body).toEqual({
        statusCode: 400,
        code: "FST_ERR_VALIDATION",
        error: "Bad Request",
        message: "body must be object",
      });
    });
  });
});
