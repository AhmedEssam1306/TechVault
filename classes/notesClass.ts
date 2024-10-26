import { APIRequestContext, expect, Page } from "playwright/test";
import endpoints from "../fixtures/json/endpoints.json";
import { UsersClass } from "../classes/usersClass";
import { CommonClass } from "./commonClass";

export class NotesClass {
  constructor(request: APIRequestContext) {
    this.request = request;
  }

  readonly request: APIRequestContext;
  readonly page: Page;

  async getNoteData() {
    const userClass = new UsersClass(this.request);
    const commonClass = new CommonClass(this.page);

    const categories = ["Home", "Work", "Personal"];
    const category = categories[Math.floor(Math.random() * 4)];
    const title = `title-${await commonClass.generateRandomLetters(10)}`;
    const description = `desc-${await commonClass.generateRandomLetters(10)}`;

    return { category, title, description };
  }

  async createNote() {
    const userClass = new UsersClass(this.request);
    const formData = new URLSearchParams();

    const token = (await userClass.userLogin("test.13@gmail.com", "test123"))
      .token;

    const noteData = await this.getNoteData();

    formData.append("title", noteData.title);
    formData.append("description", noteData.description);
    formData.append("category", noteData.category);

    const resBody = await this.request.post(endpoints.createNote, {
      headers: {
        "x-auth-token": `${token}`,
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData.toString(),
    });

    const resJson = await resBody.json();

    const noteId = await resJson.data.id;

    return { resBody, noteId };
  }

  async getAllNotes() {
    const userClass = new UsersClass(this.request);
    const token = (await userClass.userLogin("test.13@gmail.com", "test123"))
      .token;
    const response = await this.request.get(endpoints.createNote, {
      headers: {
        "x-auth-token": `${token}`,
      },
    });
    const respJson = await response.json();
    const data = await respJson.data;

    return data;
  }

  async updateNote(noteId: string) {
    const formData = new URLSearchParams();
    const userClass = new UsersClass(this.request);

    const token = (await userClass.userLogin("test.13@gmail.com", "test123"))
      .token;

    const noteData = await this.getNoteData();

    formData.append("title", noteData.title);
    formData.append("description", noteData.description);
    formData.append("category", noteData.category);
    formData.append("completed", "true");

    const response = await this.request.put(endpoints.updateNote + noteId, {
      headers: {
        "x-auth-token": `${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: formData.toString(),
    });

    return response.json();
  }

  async searchForNote(noteId: string, data: any, isShouldExist: boolean) {
    data.forEach(async (note: any) => {
      if (note.id === noteId && isShouldExist) {
        expect(note.id).toBe(noteId);
      } else {
        expect(note.id).not.toContain(noteId);
      }
    });
  }

  async deleteNote(noteId: string) {
    const userClass = new UsersClass(this.request);
    const token = (await userClass.userLogin("test.13@gmail.com", "test123"))
      .token;

    const response = await this.request.delete(endpoints.updateNote + noteId, {
      headers: {
        "x-auth-token": `${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const respJson = response.json();

    return respJson;
  }
}
