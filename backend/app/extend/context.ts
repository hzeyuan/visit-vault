
const TYPE_USER = Symbol('Context#TypeUser');
import { createWriteStream, ReadStream } from "fs";
import { getExtension } from "../utils/string";
export default {
    /**
     * 
     * @param file 上传文件的配置
     * @param id 文件的标识符
     */
    async upload(
        file: Promise<{
            filename: string;
            mimetype: string;
            createReadStream: () => NodeJS.ReadableStream;
        }>, id: string) {
        const { filename, mimetype, createReadStream } = await file;
        const ext = getExtension(filename); // 文件后缀
        // 不是图片格式
        if (!mimetype.includes("image/")) {
            throw new Error("Invalid file");
        }
        // 这里的路径应该从配置中取出
        const outPath = `/tmp/${id}${ext}`;
        // 读写流
        const read = createReadStream() as ReadStream;
        const write = createWriteStream(outPath);
        const pipe = read.pipe(write);
        await new Promise<void>((resolve) => {
            pipe.on("close", () => resolve());
        });
        return outPath;
    }
};
