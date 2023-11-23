# FileHashDispatcher

## Overview
`FileHashDispatcher` is a Node.js package designed for the automated computation and secure transmission of file hashes. It is ideal for integrating into CI/CD pipelines, where ensuring the integrity of files in a repository is crucial. The package generates SHA-256 hashes for files and sends these hashes to a specified API endpoint.

## How It Works
This package works by scanning all files within a specified directory, computing their SHA-256 hashes, and then sending these hashes in a JSON payload to a designated secure API endpoint. It leverages environment variables for configuration, ensuring flexibility and ease of integration into various workflows.

## Getting Started

### Prerequisites
- Node.js (version 14 or higher is recommended)
- A GitHub repository where the package will be implemented
- A secure API endpoint that will receive the file hashes

### Installation
Install `FileHashDispatcher` via npm with the following command:

```bash
npm install @smart-chain-fr/filehashdispatcher
```

## GitHub Actions Workflow Setup
The following steps will guide you through the process of setting up a GitHub Actions workflow that will automatically compute and send file hashes to an API endpoint.

### Step 1: Create a GitHub Actions Workflow

To utilize FileHashDispatcher within your GitHub Actions workflow, follow these steps to set up the .github/workflows YAML file in your project. this is an example of a workflow that will compute and send file hashes to an API endpoint when a push event occurs:

```yaml
name: FileHashDispatcher CI
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
          node-version: "14"

      - name: Install FileHashDispatcher
        run: npm install @smart-chain-fr/filehashdispatcher

      - name: Install app dependencies
        run: npm install

      - name: Compute hashes and send to API
        env:
          CALLBACK_URL: ${{ secrets.CALLBACK_URL }}
          SECURE_API: ${{ secrets.SECURE_API }}
          API_KEY: ${{ secrets.API_KEY }}
          FILES_PATH: ${{ secrets.FILES_PATH }}
        run: node dist/index.js
```

### Step 2: Create Secrets

set the following secrets in your GitHub repository:

- `SECURE_API`: The URL of the API endpoint that will receive the file hashes
- `API_KEY`: The API key that will be used to authenticate the request to the API endpoint
- `FILES_PATH`: The path to the directory containing the files whose hashes will be computed
- `CALLBACK_URL`(optional): The URL callback that will be used to send the response from the API endpoint

### Step 3: Usage

Once the workflow is set up, the hashes of the files in the specified directory will be computed and sent to the API endpoint. The API endpoint will then respond with a JSON payload containing the hashes of the files. If a callback URL is specified, the response from the API endpoint will be sent to the callback URL.

## GitLab CI/CD Pipeline Setup (Coming Soon)

## Contributing

Contributions are welcome! Please see the [contributing guide](CONTRIBUTING.md) for more details.

## License

This project is licensed under the terms of the [MIT license](LICENSE).

## Initied by

This library was initied by [Smartchain](https://www.smart-chain.fr/).




