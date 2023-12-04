#!/usr/bin/env node

import assert from "assert";
import Main from "./index.js";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const yargObj = yargs(hideBin(process.argv));

yargObj
	.command(
		["run", "$0"],
		"run command or empty command to run the process",
		(yargs) => {
			return yargs
				.option("filesPath", {
					alias: "f",
					description: "files path",
					type: "string",
					demandOption: true,
				})
				.option("apiUrl", {
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
					demandOption: true,
				})
				.check(({ callbackUrl }) => {
					if (callbackUrl) {
						assert(callbackUrl.startsWith("http://") || callbackUrl.startsWith("https://"), "callbackUrl must be a valid url");
					}
					return true;
				})
				.check(({ apiUrl }) => {
					assert(apiUrl.startsWith("http://") || apiUrl.startsWith("https://"), "secureApi must be a valid url");
					return true;
				});
		},
		(argv) => {
			if (argv.verbose)
				console.info("Files path:", argv.filesPath, "\nSecure api url:", argv.apiUrl, "\nApi key:", '******', "\nCallback url:", argv.callbackUrl);
			Main.run({
				callbackUrl: argv.callbackUrl,
				secureApi: argv.apiUrl,
				apiKey: argv.apiKey,
				rootDir: argv.filesPath,
			})
				.then((response) => {
					console.log(response);
				})
				.catch((error) => {
					console.error(error);
				});
		},
	)
	.option("verbose", {
		alias: "v",
		type: "boolean",
		description: "Run with verbose logging",
	})
	.parse();
