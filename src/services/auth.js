import { Account, Client, ID } from "appwrite";
import config from "../../conf/appwrite-config";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(config.appWriteURL)
      .setProject(config.appWriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );
      if (userAccount) {
        return this.login({ email, password });
      }
    } catch (error) {
      console.log("Appwrite service :: createAccount :: error", error);
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite service :: login :: error", error);
      if (error.type == "user_session_already_exists") return error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
    }
  }

  async logout() {
    try {
      await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }

  async deleteAccount() {
    try {
      // Todo using functions delete user and profile
    } catch (error) {
      console.log("Appwrite service :: deleteAccount :: error", error);
    }
  }
}

const authService = new AuthService();
export default authService;
