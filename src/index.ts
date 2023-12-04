import * as fs from "fs";
import * as crypto from "crypto";
import fetch from "node-fetch";
import * as path from "path";
import asyncBatchModule from "@smart-chain-fr/asyncbatch";

const AsyncBatch = asyncBatchModule.AsyncBatch;

type IConfig = {
	callbackUrl: string | undefined;
	secureApi: string;
	apiKey: string;
	rootDir: string;
};

export default class Main {
	public static async run(configs: IConfig): Promise<void> {
		try {
			console.log("Response from API:", await this.requestAnchoring(await this.createHashsFromDir(configs.rootDir), configs));
		} catch (error) {
			console.error("Error:", error);
		}
	}

	private static async requestAnchoring(hashSources: string[], configs: IConfig): Promise<unknown> {
		console.log("Hashs to anchor before sorting:", hashSources);
		// sort hashSources by ascending order
		hashSources.sort((a, b) => a.localeCompare(b));
		return (
			await fetch(configs.secureApi, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					apiKey: `${configs.apiKey}`,
				},
				body: JSON.stringify({
					hash_sources: hashSources,
					...(configs.callbackUrl && {
						callback_url: configs.callbackUrl,
						callback_config: {
							queued: true,
							attempting: true,
							verifying: true,
							verified: true,
							abandoned: true,
							nb_try: 3,
						},
					}),
				}),
			})
		).json();
	}

	private static async createHashsFromDir(dir: string): Promise<string[]> {
		const files = this.getFilesPath(dir);

		const hashAction = async (filePath: string) => {
			return this.hashFile(filePath);
		};

		const asyncBatch = AsyncBatch.create<string, Promise<string>>(files, hashAction, {
			maxConcurrency: 4,
		});

		const hashes: string[] = [];

		asyncBatch.events.onProcessingEnd(({ response }) => {
			if (response) {
				hashes.push(response);
			}
		});

		asyncBatch.start();

		return hashes;
	}

	private static async hashFile(filePath: string): Promise<string> {
		return new Promise((resolve, reject) => {
			const hash = crypto.createHash("sha256");
			const stream = fs.createReadStream(filePath);

			stream.on("data", (data) => hash.update(data));
			stream.on("end", () => resolve(hash.digest("hex")));
			stream.on("error", (err) => reject(err));
		});
	}

	private static getFilesPath(dir: string): string[] {
		const files: string[] = [];
		const fileContent = fs.readdirSync(dir);
		for (const file of fileContent) {
			const fullPath = path.resolve(dir, file);
			if (fs.statSync(fullPath).isDirectory()) {
				files.push(...this.getFilesPath(fullPath));
			} else {
				files.push(fullPath);
			}
		}

		return files;
	}
}
