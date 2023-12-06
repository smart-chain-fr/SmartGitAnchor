# SmartGitAnchor

## Overview
`SmartGitAnchor` is a Node.js package designed for automated computation and secure transmission of file hashes, with a particular focus on blockchain technologies like `Tezos` and `Ethereum`. It's ideal for CI/CD pipelines, especially in blockchain development projects, where verifying the integrity of files against a `Merkle tree` generated hash root is crucial. The package generates SHA-256 hashes, a standard in blockchain hash functions, for files and securely transmits these to a specified API endpoint.

## How It Works
This package works by scanning all files within a specified directory, computing their SHA-256 hashes, and then sending these hashes in a JSON payload to a designated secure API endpoint. It leverages environment variables for configuration, ensuring flexibility and ease of integration into various workflows.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher is recommended)
- A GitHub repository where the package will be implemented
- A secure API endpoint that will receive the file hashes (see [Secure API Endpoint Setup](#secure-api-endpoint-setup))

## Installation and Setup (GitHub Actions Workflow)
Install `SmartGitAnchor` via npm with the following command:

```bash
npm install @smart-chain-fr/SmartGitAnchor
```

### Create a GitHub Actions Workflow

To utilize SmartGitAnchor within your GitHub Actions workflow, follow these steps to set up the .github/workflows YAML file in your project. this is an example of a workflow that will compute and send file hashes to an API endpoint when a push event occurs:

```yaml
name: SmartGitAnchor CI
on: [push]
jobs:
  send-hashes:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2

      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "20"

      - name: Install SmartGitAnchor
        run: npm install @smart-chain-fr/smartgitanchor -g

      - name: Compute hashes and send to API
        run: smartgitanchor --callbackUrl=${{ secrets.CALLBACK_URL }} --apiUrl=${{ secrets.SECURE_API }} --apiKey=${{ secrets.API_KEY }} --filesPath=${{ secrets.FILES_PATH }}
```

### Create Secrets

set the following secrets in your GitHub repository:

- `SECURE_API`: The URL of the API endpoint that will receive the file hashes
- `API_KEY`: The API key that will be used to authenticate the request to the API endpoint
- `FILES_PATH`: The path to the directory containing the files whose hashes will be computed
- `CALLBACK_URL`(optional): The URL callback that will be used to send the response from the API endpoint

### Workflow Explanation

Once the workflow is set up, the hashes of the files in the specified directory will be computed and sent to the API endpoint. The API endpoint will then respond with a JSON payload containing the hashes of the files. If a callback URL is specified, the response from the API endpoint will be sent to the callback URL.

### Secure API Endpoint Setup

Secure API, part of the [Bloom](https://3loom.io/) suite, that allows you to receive the hashes of the files sent by SmartGitAnchor. To use it, you must contact the smartchain team to create an account and get your API key and the URL of your API endpoint. You can contact the team at [Contact](https://www.smart-chain.fr/contact) and specify that you want to use the Secure API service.

## Command Line Interface (CLI) Usage

### installation

```bash
npm install @smart-chain-fr/smartgitanchor -g
```

### Usage

```bash
smartgitanchor [options]
```
options:
- `--callbackUrl`: The URL callback that will be used to send the response from the API endpoint
- `--apiUrl`: The URL of the API endpoint that will receive the file hashes (required)
- `--apiKey`: The API key that will be used to authenticate the request to the API endpoint (required)
- `--filesPath`: The path to the directory containing the files whose hashes will be computed (required)

### Example

```bash
smartgitanchor --callbackUrl=https://example.com/callback --apiUrl=https://example.com/api --apiKey=1234567890 --filesPath=/home/user/my-project
```

## GitLab CI/CD Pipeline Setup (Coming Soon)

## Contributing

Contributions are welcome! Please see the [contributing guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the terms of the [MIT license](LICENSE).

## Initied by

This library was initied by [Smartchain](https://www.smart-chain.fr/).




