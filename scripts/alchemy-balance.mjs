import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const { parsed, error } = dotenv.config({ path: resolve(projectRoot, ".env") });

if (error || !parsed?.ALCHEMY_API_KEY) {
  console.error("ALCHEMY_API_KEY is missing from the project .env file.");
  process.exit(1);
}

const address = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const command = process.platform === "win32" ? "npx.cmd" : "npx";
const result = spawnSync(
  command,
  ["--yes", "--package", "@alchemy/cli", "alchemy", "evm", "rpc", "eth_getBalance", address, "latest", "-n", "eth-mainnet", "--json"],
  { cwd: projectRoot, env: process.env, encoding: "utf8", shell: process.platform === "win32" },
);

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) {
  console.error("Could not run the Alchemy CLI.");
  process.exit(1);
}
process.exitCode = result.status ?? 1;