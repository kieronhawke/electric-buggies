import { defineCliConfig } from "sanity/cli";

/** CLI config for `sanity cors add` / `sanity deploy`. studioHost makes deploy
 *  non-interactive → https://<studioHost>.sanity.studio */
export default defineCliConfig({
  api: { projectId: "6q5dtk3i", dataset: "production" },
  studioHost: "electric-buggies",
});
