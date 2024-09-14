const config = {
  appWriteURL: String(import.meta.env.VITE_APPWRITE_URL),
  appWriteProjectId: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
  appWriteDatabaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),
  appWriteArticleCollectionId: String(
    import.meta.env.VITE_APPWRITE_ARTICLE_COLLECTION_ID
  ),
  appWriteUserCollectionId: String(
    import.meta.env.VITE_APPWRITE_USER_COLLECTION_ID
  ),
  appWriteBucketId: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
  appWriteStorageKey: String(import.meta.env.VITE_APPWRITE_STORAGE_KEY),
  appWriteUserManagementKey: String(
    import.meta.env.VITE_APPWRITE_USER_MANAGEMENT_KEY
  ),
};

export default config;
