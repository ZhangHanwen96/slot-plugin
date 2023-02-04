import { exec } from "child_process";
import util from "util";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

// pureFn
// iframe
// render
const slotType = process.argv[2];

const execa = util.promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const srcDir = path.join(__dirname, "dist");
const cdnrefreshlist = path.join(__dirname, "cdnrefreshlist.txt");

const uploadAsset = async () => {
    const { stderr, stdout } = await execa(
        `qshell qupload2 --src-dir=${srcDir} --bucket=tezign-public --key-prefix=slot-plugin-demo/${slotType}/ \\
      --overwrite --check-hash --rescan-local --skip-fixed-strings=.svn,.git --skip-suffixes=.DS_Store,.exe \\
      --log-file=upload.log --log-level=info --log-rotate=1`
    );
    if (stderr) {
        console.error("Upload failed", stderr);
        process.exit(1);
    }
    console.log(stdout);
    const { stderr: stderr2, stdout: stdout2 } = await execa(
        `qshell cdnrefresh -i ${cdnrefreshlist}`
    );
    if (stderr) {
        console.error("Upload failed", stderr2);
        process.exit(1);
    }
    console.log(stdout2);
};

await uploadAsset();
