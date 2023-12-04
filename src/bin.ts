#!/usr/bin/env node

import assert from "assert";
import Main from "./index.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const yargObj = yargs(hideBin(process.argv));

yargObj
	.command(
		"run",
		"start the directory hashing process",
		(yargs) => {
			return yargs
				.option("filesPath", {
					alias: "f",
					description: "files path",
					type: "string",
					demandOption: true,
				})
				.option("secureApi", {
					alias: "s",
					description: "secure api url",
					type: "string",
					demandOption: true,
				})
				.option("apiKey", {
					alias: "k",
					description: "api key",
					type: "string",
					demandOption: true,
				})
				.option("callbackUrl", {
					alias: "c",
					description: "callback url",
					type: "string",
					demandOption: false,
				})
				.check((argv) => {
					if (argv.callbackUrl) {
						assert(argv.callbackUrl.startsWith("http://") || argv.callbackUrl.startsWith("https://"), "callbackUrl must be a valid url");
					}
					return true;
				})
				.check((argv) => {
					assert(argv.secureApi.startsWith("http://") || argv.secureApi.startsWith("https://"), "secureApi must be a valid url");
					return true;
				});
		},
		(argv) => {
			if (argv.verbose)
				console.info(`Start hashing process with files path: ${argv.filesPath}` + `${argv.apiKey}` + `${argv.secureApi}` + `${argv.callbackUrl}`);
			(async () => {
				await Main.run({
					callbackUrl: argv.callbackUrl,
					secureApi: argv.secureApi,
					apiKey: argv.apiKey,
					rootDir: argv.filesPath,
				});
				console.log("Hashs to anchor before sorting:", argv.filesPath);
			})();
		},
	)
	.option("verbose", {
		alias: "v",
		type: "boolean",
		description: "Run with verbose logging",
	})
	.parse();
