import { config } from "@seven-auto/eslint-config/react-internal";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...config,
  {
    ignores: ["jest.config.cjs", "dist/**"],
  },
];
