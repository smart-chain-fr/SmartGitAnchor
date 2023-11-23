import * as fs from "fs";
import * as crypto from "crypto";
import fetch from "node-fetch";
import * as path from "path";

async function computeHash(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);

    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (err) => reject(err));
  });
}

function getFilesPath(dir: string): string[] {
  let files: string[] = [];
  const fileContent = fs.readdirSync(dir);
  for (const file of fileContent) {
    const fullPath = path.resolve(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getFilesPath(fullPath));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const callbackUrl = process.env.CALLBACK_URL;
  const secureApi = process.env.SECURE_API;
  const apiKey = process.env.API_KEY;
  const filesPath = process.env.FILES_PATH;

  if (!secureApi || !apiKey || !filesPath) {
    console.error(
      "Environment variables FILES_PATH, SECURE_API or API_KEY are not set"
    );
    return;
  }

  try {
    const files = getFilesPath(filesPath).sort((a, b) => a.localeCompare(b));
    const hashes = await Promise.all(files.map((file) => computeHash(file)));
    let jsonPayload = {};

    if (callbackUrl) {
      jsonPayload = {
        hash_sources: hashes,
        callback_url: callbackUrl,
        callback_config: {
          queued: true,
          attempting: true,
          verifying: true,
          verified: true,
          abandoned: true,
          nb_try: 3,
        },
      };
    } else {
      jsonPayload = {
        hash_sources: hashes,
      };
    }

    const response = await fetch(secureApi, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apiKey: `${apiKey}`,
      },
      body: JSON.stringify(jsonPayload),
    });

    const responseData = await response.json();
    console.log("Response from API:", responseData);
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
