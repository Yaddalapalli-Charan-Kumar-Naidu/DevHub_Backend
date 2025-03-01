import { SESClient } from "@aws-sdk/client-ses";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables

// Set AWS Region
const REGION = "ap-south-1";

// Validate Credentials
if (!process.env.AWS_SES_KEY || !process.env.AWS_SES_SECRET) {
  console.error("🚨 AWS SES credentials are missing. Check your .env file.");
}

// Create SES service object
const sesClient = new SESClient({ 
  region: REGION,
  credentials: {
    accessKeyId: process.env.AWS_SES_KEY,
    secretAccessKey: process.env.AWS_SES_SECRET,
  },
});

export { sesClient };
