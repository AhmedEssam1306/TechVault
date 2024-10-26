import { test, expect } from "@playwright/test";
import { UsersClass } from "../../classes/usersClass";
import * as endpoints from "../../fixtures/json/endpoints.json";
import { CommonClass } from "../../classes/commonClass";

const userLoginData = [
  {
    state: "valid",
    email: "test.13@gmail.com",
    password: "test123",
  },
  {
    state: "invalid",
    email: "a@gmail.com",
    password: "test123",
  },
];

test.describe("API tests for Users", () => {
  test("Verify API is healthy", async ({ request }) => {
    const commonClass = new CommonClass();
    const response = await request.get(endpoints.health);

    expect(response.status()).toBe(200);
    await commonClass.attachApiResponse(response.json());
  });

  test("Register New user", async ({ request, page }) => {
    const userClass = new UsersClass(request);
    const commonClass = new CommonClass();
    const registerUser = userClass.registerUser();

    expect((await registerUser).resBody.status()).toBe(201);
    const responseBody = await (await registerUser).resBody.json();
    expect(responseBody.message).toBe("User account created successfully");
    await commonClass.attachApiResponse(responseBody);
  });

  test("Update User Info", async ({ request }) => {
    const userClass = new UsersClass(request);
    const commonClass = new CommonClass();
    const loginUser = userClass.userLogin(
      userLoginData[0].email,
      userLoginData[0].password
    );
    const token = (await loginUser).token;

    const patchUser = userClass.patchUser(token);
    const patchResBody = await (await patchUser).json();
    expect((await patchUser).status()).toBe(200);
    expect(patchResBody.message).toBe("Profile updated successful");
    await commonClass.attachApiResponse(patchResBody);
  });

  test("Change Password", async ({ request }) => {
    const userClass = new UsersClass(request);
    const commonClass = new CommonClass();

    // Register new user
    const registerUser = userClass.registerUser();
    const responseBody = await (await registerUser).resBody.json();

    // Login with user to get token
    const loginUser = userClass.userLogin(
      responseBody.data.email,
      (await registerUser).password
    );
    const token = (await loginUser).token;

    // Change password
    const changePassword = userClass.changePassword(
      (await registerUser).password,
      token
    );
    const changePasswordBody = await (await changePassword).json();

    expect((await changePassword).status()).toBe(200);
    expect(changePasswordBody.message).toBe(
      "The password was successfully updated"
    );
    await commonClass.attachApiResponse(changePasswordBody);
  });

  userLoginData.forEach((user) => {
    test(`User ${user.state} Login`, async ({ request }) => {
      const userClass = new UsersClass(request);
      const commonClass = new CommonClass();
      const loginResponse = userClass.userLogin(user.email, user.password);

      if (user.state == "valid") {
        expect((await loginResponse).resBody.status()).toBe(200);
      } else {
        expect((await loginResponse).resBody.status()).toBe(401);
      }

      await commonClass.attachApiResponse((await loginResponse).resBody);
    });
  });
});
