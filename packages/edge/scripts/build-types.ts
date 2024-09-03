import { build, emptyDir } from "jsr:@deno/dnt@^0.41.3";

await emptyDir("./dist");

await build({
  entryPoints: ["./supabase/functions/trpc/index.ts"],
  outDir: "./dist/charisma",
  shims: {
    customDev: [
      {
        package: {
          name: "@deno/shim-deno",
          version: "~0.19.2",
          typeOnly: true,
        },
        globalNames: ["Deno"],
      },
    ],
  },
  package: {
    name: "@charisma/edge-dist",
    version: "1.0.0",
    main: "src/index.ts",
    license: "UNLICENSED",
    private: true,
  },
  typeCheck: false,
  packageManager: "yarn",
});
