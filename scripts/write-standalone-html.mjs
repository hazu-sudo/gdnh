import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const distDir = "dist";
const assetsDir = join(distDir, "assets");
const assets = await readdir(assetsDir);
const cssFile = assets.find((name) => name.endsWith(".css"));
const jsFile = assets.find((name) => name.endsWith(".js"));

if (!cssFile || !jsFile) {
  throw new Error("Missing built CSS or JS asset in dist/assets.");
}

let css = await readFile(join(assetsDir, cssFile), "utf8");
let js = await readFile(join(assetsDir, jsFile), "utf8");

css = css.replaceAll("</style", "<\\/style");
js = js.replaceAll("</script", "<\\/script");

const html = `<!doctype html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="description"
      content="今すぐ送れない、でも忘れたくない気持ちを、あとで開けるしおりとして残すWebアプリ。"
    />
    <title>あとで開くしおり</title>
    <style>
${css}
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script>
${js}
    </script>
  </body>
</html>
`;

await writeFile(join(distDir, "index.html"), html);
await writeFile(join(distDir, ".nojekyll"), "");
