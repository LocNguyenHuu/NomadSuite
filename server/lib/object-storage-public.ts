// Public object storage for bug report screenshots and other public assets
import { Storage } from "@google-cloud/storage";

const objectStorageClient = new Storage({
  credentials: {
    audience: "replit",
  },
  authClient: {
    transport: {
      request: async (opts: RequestInit) => {
        const res = await fetch(opts as RequestInfo);
        return res;
      },
    },
  },
});

class PublicObjectStorageService {
  private bucketId: string | undefined;
  
  constructor() {
    this.bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  }

  async uploadPublicFile(buffer: Buffer, fileName: string, mimeType: string): Promise<string> {
    if (!this.bucketId) {
      throw new Error("Object storage not configured");
    }

    const bucket = objectStorageClient.bucket(this.bucketId);
    const file = bucket.file(`public/${fileName}`);
    
    await file.save(buffer, {
      metadata: {
        contentType: mimeType,
      },
    });

    // Return public URL
    return `https://storage.googleapis.com/${this.bucketId}/public/${fileName}`;
  }
}

export const publicObjectStorage = new PublicObjectStorageService();
