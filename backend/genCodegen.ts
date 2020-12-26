import * as fs from 'fs';
import * as path from 'path';

const grpahqlFiles: string[] = [];

const genCodegenyml = async (root: string) => {
  const tarDirpath = path.join(root);
  const files: string[] = fs.readdirSync(root);
  files.forEach((fileName: string) => {
    const filedir = path.join(root, fileName);
    const filterFlag = path.extname(fileName) === '.graphql';
    const stats = fs.statSync(filedir);
    const isFile = stats.isFile();
    const destPath = path.join(tarDirpath, fileName);
    if (isFile && filterFlag) {
      // 复制文件
      const r = path.parse(destPath);
      const dts = path.join(process.cwd(), 'typings', r.dir.replace(process.cwd(), ''), `${r.name}.d.ts`);
      grpahqlFiles.push(`
      "${dts}":
        schema: "${destPath}"
        plugins:
          - "typescript"`);
      return;
    } else if (!isFile) {
      genCodegenyml(destPath);
    }
  });
};

genCodegenyml(process.cwd());
fs.writeFileSync(path.join(process.cwd(), 'codegen.yml'), `
overwrite: true
generates:
  ${grpahqlFiles.join('')}`);
