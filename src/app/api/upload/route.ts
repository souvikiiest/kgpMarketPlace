import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import verifyToken from "../backend-utils/jwt";

const s3client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadFileToS3(
  fileBuffer: Buffer,
  userId: string | undefined,
  fileType: string
) {
  const savedFileName = uuidv4();
  const params = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: `${userId}/${savedFileName}`,
    Body: fileBuffer,
    ContentType: fileType,
  };
  try {
    const command = new PutObjectCommand(params);
    const result = await s3client.send(command);
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${userId}/${savedFileName}`;

    return fileUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Failed to upload file");
  }
}

export async function POST(req: NextRequest) {
  const decodedValue = verifyToken();

  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file)
    return NextResponse.json({ error: "File is required" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileType = file.type;

  try {
    const fileUrl = await uploadFileToS3(
      buffer,
      decodedValue?.userId,
      fileType
    );
    return NextResponse.json({ status: true, fileUrl });
  } catch (error: any) {
    return NextResponse.json(
      { status: false, error: error.message },
      { status: 500 }
    );
  }
}
