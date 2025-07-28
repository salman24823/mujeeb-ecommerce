import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const envPath = path.join(process.cwd(), ".env");

// Helper: Parse .env (ignore comments but keep them in memory)
function parseEnvWithComments(content) {
  const lines = content.split("\n");
  const data = {};
  const structure = [];

  lines.forEach((line) => {
    if (line.trim() === "" || line.trim().startsWith("#")) {
      structure.push({ type: "comment", value: line });
    } else {
      const [key, ...rest] = line.split("=");
      const value = rest.join("=");
      data[key.trim()] = value.trim();
      structure.push({ type: "var", key: key.trim() });
    }
  });

  return { data, structure };
}

// Helper: Rebuild .env
function rebuildEnv(data, structure) {
  return structure
    .map((item) => {
      if (item.type === "comment") return item.value;
      return `${item.key}=${data[item.key] || ""}`;
    })
    .join("\n");
}

export async function GET() {
  const content = fs.readFileSync(envPath, "utf8");
  const { data } = parseEnvWithComments(content);
  return NextResponse.json(data);
}

export async function POST(req) {
  const body = await req.json();

  const content = fs.readFileSync(envPath, "utf8");
  const { data, structure } = parseEnvWithComments(content);

  // Update data
  Object.assign(data, body);

  // Rebuild .env (keep comments)
  const newContent = rebuildEnv(data, structure);
  fs.writeFileSync(envPath, newContent, "utf8");

  return NextResponse.json({
    message:
      "Configuration updated successfully! Restart the server to apply changes.",
  });
}
