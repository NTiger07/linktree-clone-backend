const axios = require("axios");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET;

async function uploadFile(buffer, fileName, contentType) {
  if (!SUPABASE_URL || !SUPABASE_KEY || !BUCKET) {
    throw new Error("Supabase configuration missing");
  }

  const url = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${fileName}`;

  const headers = {
    Authorization: `Bearer ${SUPABASE_KEY}`,
    "Content-Type": contentType || "application/octet-stream",
  };

  const res = await axios.put(url, buffer, {
    headers,
    maxBodyLength: Infinity,
  });
  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Upload failed: ${res.status}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${fileName}`;
}

module.exports = { uploadFile };
