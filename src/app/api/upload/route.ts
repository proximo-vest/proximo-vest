import { route, type Router } from "@better-upload/server";
import { toRouteHandler } from "@better-upload/server/adapters/next";
import { cloudflare } from "@better-upload/server/clients"; // <-- CORRETO

const client = cloudflare({
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  accountId: process.env.B2_ACCOUNT_ID!,
});

const router: Router = {
  client,
  bucketName: process.env.R2_BUCKET_NAME!,

  routes: {
    "markdown-images": route({
      fileTypes: ["image/*"],
      maxFileSize: 10 * 1024 * 1024,
      multipleFiles: false,
    }),
  },
};

export const { POST } = toRouteHandler(router);
