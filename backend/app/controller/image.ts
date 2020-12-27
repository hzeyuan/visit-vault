import { Controller } from 'egg';
import * as fs from 'fs';
import * as path from 'path';
import Image from "../types/image";

export default class ImageController extends Controller {
    public async image() {
        console.log('image', this.ctx.params);
        // const image = await Image.getById(this.ctx.params.image);
        // todo :返回一个image对象
        const image = {
            path:'public/flags/ad.svg'
        } as Image;
        if (image && image.path) {
            const resolved = path.resolve(image.path);
            if (!fs.existsSync(resolved)) this.ctx.redirect("/broken");
            else {
                // res.sendFile(resolved);
                // this.ctx.set('content-type', 'image/jpeg')
                // this.ctx.body =  fs.readFileSync(resolved);
                this.ctx.redirect(`/${image.path}`)
            }
        } else {
            this.ctx.redirect("/broken");
        }
    }
    public async imageThumbnail() {
        // const image = await Image.getById(req.params.image);
        const image = {
            thumbPath:'public/flags/ad.svg'
        } as Image;
        if (image && image.thumbPath) {
            const resolved = path.resolve(image.thumbPath);
            console.log('resolved', resolved)
            console.log(fs.existsSync(resolved))
            if (!fs.existsSync(resolved)) {
                this.ctx.redirect("/broken");
            } else {
                // this.ctx.set('content-type', 'image/jpeg')
                // console.log(fs.createReadStream(resolved))
                // this.ctx.body = fs.readFileSync(resolved);
                this.ctx.redirect(`/${image.thumbPath}`)
                // this.ctx.render
                // this.ctx.sendFile(resolved);
            }
        } else if (image) {
            // const config = getConfig();
            const config = {
                auth: {
                    password: '123',
            }}
            this.logger.info(`${this.ctx.params.image}'s thumbnail does not exist (yet)`);
            this.ctx.redirect(`/media/image/${image._id}?password=${config.auth.password}`);
        } else {
            this.ctx.redirect("/broken");
        }
    }
}