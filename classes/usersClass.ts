import { Page, APIRequestContext } from "playwright/test";
import endpoints from "../fixtures/json/endpoints.json";
import { CommonClass } from "./commonClass";

export class UsersClass {
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  readonly request: APIRequestContext;
  readonly page: Page;

  async userLogin(email: string, password: string) {
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);

    const resBody = await this.request.post(endpoints.userLogin, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData.toString(),
    });

    const token = await resBody.json().then((res: any) => {
      if (resBody.status() === 200) {
        return res.data.token;
      }
    });

    return { resBody, token };
  }

  async registerUser() {
    const formData = new URLSearchParams();
    const commonClass = new CommonClass(this.page);

    const randomLetters = await commonClass.generateRandomLetters(3);
    const password = "ahmed123";

    formData.append("name", `ahmed${randomLetters}`);
    formData.append("email", `ahmed${randomLetters}@gmail.com`);
    formData.append("password", password);

    const resBody = await this.request.post(endpoints.userRegister, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData.toString(),
    });

    return { resBody, password };
  }

  async patchUser(token: string) {
    const formData = new URLSearchParams();
    const commonClass = new CommonClass(this.page);

    const randomLetters = await commonClass.generateRandomLetters(3);

    formData.append("name", `ahmed${randomLetters}`);
    formData.append("phone", "152354856345");
    formData.append("company", "CO. Test Company");

    const registerUser = await this.request.patch(endpoints.userProfile, {
      headers: {
        "x-auth-token": `${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData.toString(),
    });

    return registerUser;
  }

  async changePassword(currentPassword: string, token: string) {
    const formData = new URLSearchParams();
    const commonClass = new CommonClass(this.page);

    const randomLetters = await commonClass.generateRandomLetters(3);

    formData.append("currentPassword", currentPassword);
    formData.append("newPassword", `test1${randomLetters}`);

    const registerUser = await this.request.post(endpoints.changePassword, {
      headers: {
        "x-auth-token": `${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData.toString(),
    });

    return registerUser;
  }
}
