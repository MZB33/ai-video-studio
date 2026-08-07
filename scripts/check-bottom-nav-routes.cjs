const fs = require("node:fs");
const path = require("node:path");

const rootDir = process.cwd();
const navFile = path.join(rootDir, "components", "ui", "BottomNav.tsx");
const content = fs.readFileSync(navFile, "utf8");

const hrefMatches = [...content.matchAll(/href:\s*"([^"]+)"/g)].map((match) => match[1]);
const uniqueRoutes = [...new Set(hrefMatches)];

const missingRoutes = uniqueRoutes.filter((route) => {
  if (route === "/") {
    return !fs.existsSync(path.join(rootDir, "app", "page.tsx"));
  }

  const routeDir = path.join(rootDir, "app", ...route.split("/").filter(Boolean));
  return !fs.existsSync(path.join(routeDir, "page.tsx"));
});

if (missingRoutes.length > 0) {
  console.error(`Missing app routes for bottom navigation: ${missingRoutes.join(", ")}`);
  process.exit(1);
}

console.log(`Bottom navigation routes verified: ${uniqueRoutes.join(", ")}`);