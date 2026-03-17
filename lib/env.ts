type Environment = "development" | "test" | "production";

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function readNodeEnv(): Environment {
  const nodeEnv = process.env.NODE_ENV;

  if (
    nodeEnv === "development" ||
    nodeEnv === "test" ||
    nodeEnv === "production"
  ) {
    return nodeEnv;
  }

  return "development";
}

function resolveSiteUrl() {
  const explicitUrl = process.env.NEXTAUTH_URL?.trim();

  if (explicitUrl) {
    return explicitUrl;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();

  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }

  return "http://localhost:3000";
}

export const env = {
  NODE_ENV: readNodeEnv(),
  DATABASE_URL: readRequiredEnv("DATABASE_URL"),
  NEXTAUTH_SECRET: readRequiredEnv("NEXTAUTH_SECRET"),
  ADMIN_EMAIL: readRequiredEnv("ADMIN_EMAIL").toLowerCase(),
  SITE_URL: resolveSiteUrl(),
};
