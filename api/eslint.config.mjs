import globals from "globals";
import pluginJs from "@eslint/js";
import { off } from "./db/models/Categories";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.browser,
    },
    rules: {
      // Ekstra kurallar burada tanımlanır
      "no-unused-vars": off, // Kullanılmayan değişkenler hata verir
      // "no-console": "warn",     // console.log kullanımı uyarı verir
      "semi": ["error", "always"], // Noktalı virgül zorunlu
    },
  },
  pluginJs.configs.recommended,
];