import { Client, Databases, Query } from "appwrite";
import config from "../../conf/appwrite-config";

export class DBService {
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(config.appWriteURL)
      .setProject(config.appWriteProjectId);
    this.databases = new Databases(this.client);
  }

  async createPost(data) {
    try {
      let { title, slug, content, featuredImage, isActive, userid } = data;

      return await this.databases.createDocument(
        config.appWriteDatabaseId,
        config.appWriteArticleCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          isActive,
          userid,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
      return false;
    }
  }

  async updatePost(slug, data) {
    try {
      let { title, content, featuredImage, isActive, userid } = data;

      return await this.databases.updateDocument(
        config.appWriteDatabaseId,
        config.appWriteArticleCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          isActive,
          userid,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
      return false;
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        config.appWriteDatabaseId,
        config.appWriteArticleCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        config.appWriteDatabaseId,
        config.appWriteArticleCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  async getPosts() {
    try {
      return await this.databases.listDocuments(
        config.appWriteDatabaseId,
        config.appWriteArticleCollectionId,
        [Query.equal("isActive", true), Query.orderAsc("title")]
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  async getProfile(userId) {
    try {
      return await this.databases.getDocument(
        config.appWriteDatabaseId,
        config.appWriteUserCollectionId,
        userId
      );
    } catch (error) {
      console.log("Appwrite service :: getProfile :: error", error);
      return false;
    }
  }

  async upsertProfile(data) {
    let databaseId = config.appWriteDatabaseId;
    let collectionId = config.appWriteUserCollectionId;
    let { $id, profilePic } = data;

    try {
      const document = await this.databases.getDocument(
        databaseId,
        collectionId,
        $id
      );
      if (document) {
        const updatedDocument = await this.databases.updateDocument(
          databaseId,
          collectionId,
          $id,
          {
            user_id: $id,
            profilePic,
          }
        );
        return updatedDocument;
      }
    } catch (error) {
      if (error.code === 404) {
        try {
          const newDocument = await this.databases.createDocument(
            databaseId,
            collectionId,
            $id,
            {
              user_id: $id,
              profilePic,
            }
          );
          return newDocument;
        } catch (error) {
          console.log("Appwrite service :: upsertProfile :: error", error);
          return false;
        }
      } else {
        console.log("Appwrite service :: upsertProfile :: error", error);
        return false;
      }
    }
  }
}

const dbService = new DBService();
export default dbService;
