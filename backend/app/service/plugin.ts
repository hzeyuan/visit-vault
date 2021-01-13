import { Service } from 'egg';
import { existsSync } from "fs";
import * as nodepath from "path";
import { register } from 'ts-node';

let didRegisterTsNode = false;



export default class PluginService extends Service {
    // private requireUncached(modulePath: string): unknown {
    //     if (!didRegisterTsNode && modulePath.endsWith(".ts")) {
    //         register({
    //             emit: false,
    //             skipProject: true, // Do not use this projects tsconfig.json
    //             transpileOnly: true, // Disable type checking
    //             compilerHost: true,
    //             compilerOptions: {
    //                 allowJs: true,
    //                 target: "es6",
    //                 module: "commonjs",
    //                 lib: ["es6", "dom", "es2016", "es2018"],
    //                 sourceMap: true,
    //                 removeComments: false,
    //                 esModuleInterop: true,
    //                 checkJs: false,
    //                 isolatedModules: false,
    //             },
    //         });
    //         didRegisterTsNode = true;
    //     }

    //     try {
    //         delete require.cache[require.resolve(modulePath)];
    //         return <unknown>require(modulePath);
    //     } catch (err) {
    //         const _err = err as Error;
    //         this.ctx.logger.error(`Error requiring ${modulePath}:`);
    //         this.ctx.logger.error(_err);
    //         this.ctx.logger.error(_err.message);
    //         throw err;
    //     }
    // }
    // private async runPlugin(
    //     config: IConfig,
    //     pluginName: string,
    //     inject?: Dictionary<unknown>,
    //     args?: Dictionary<unknown>
    // ): Promise<unknown> {
    //     const { logger } = this.ctx;
    //     const plugin = config.plugins.register[pluginName];

    //     if (!plugin) {
    //         throw new Error(`${pluginName}: plugin not found.`);
    //     }

    //     const path = nodepath.resolve(plugin.path);

    //     if (!existsSync(path)) {
    //         throw new Error(`${pluginName}: definition not found (missing file).`);
    //     }

    //     const func = this.requireUncached(path);

    //     if (typeof func !== "function") {
    //         throw new Error(`${pluginName}: not a valid plugin.`);
    //     }

    //     logger.info(plugin);

    //     const result = (await func({
    //         $walk: walk,
    //         $matcher: getMatcher(),
    //         $version: VERSION,
    //         $config: JSON.parse(JSON.stringify(config)) as IConfig,
    //         $pluginName: pluginName,
    //         $pluginPath: path,
    //         $cwd: process.cwd(),
    //         $library: libraryPath(""),
    //         $require: (partial: string) => {
    //             if (typeof partial !== "string") {
    //                 throw new TypeError("$require: String required");
    //             }

    //             return requireUncached(nodepath.resolve(path, partial));
    //         },
    //         $log: debug(`vault:plugin:${pluginName}:log`),
    //         $throw: (str: string) => {
    //             debug(`vault:plugin:${pluginName}:error`)(str);
    //             throw new Error(str);
    //         },
    //         args: args || plugin.args || {},
    //         ...inject,
    //         ...modules,
    //     })) as unknown;

    //     if (typeof result !== "object") {
    //         throw new Error(`${pluginName}: malformed output.`);
    //     }

    //     logger.info("Plugin result:");
    //     logger.info(result);
    //     return result || {};
    // };
    // public async runPluginsSerial(config: IConfig, event: string, inject?: Dictionary<unknown>): Promise<Record<string, unknown>> {
    //     const { logger } = this.ctx;
    //     const result = {} as Dictionary<unknown>;
    //     // 不存在插件
    //     if (!config.plugins.events[event]) {
    //         logger.warn(`No plugins defined for event ${event}.`);
    //         return result;
    //     }
    //     // 定义错误码
    //     let numErrors = 0;
    //     for (const pluginItem of config.plugins.events[event]) {
    //         const pluginName: string = pluginItem;
    //         let pluginArgs: Record<string, unknown> | undefined;
    //         logger.info(`Running plugin ${pluginName}:`);
    //         try {
    //             const pluginResult = await this.runPlugin(config, pluginName, {
    //                 data: <typeof result>JSON.parse(JSON.stringify(result)),
    //                 event,
    //                 ...inject,
    //                 pluginArgs,
    //             });
    //             Object.assign(result, pluginResult);
    //         } catch (error) {
    //             const _err = <Error>error;
    //             logger.info(_err);
    //             logger.error(_err.message);
    //             numErrors++;
    //         }
    //     }
    //     logger.info(`Plugin run over...`);
    //     if (!numErrors) {
    //         logger.info(`Ran successfully ${config.plugins.events[event].length} plugins.`);
    //     } else {
    //         logger.warn(`Ran ${config.plugins.events[event].length} plugins with ${numErrors} errors.`);
    //     }
    //     logger.info("Plugin series result");
    //     logger.info(result);
    //     return result;
    // }
}