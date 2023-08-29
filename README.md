---
author: choutianxius@gmail.com
---

# cfOmics Website Demo Code

This repository contains the code of the cfOmics website. It is the same as what's behind [the online website](https://cfomics.ncrnalab.org), apart from some deployment-related parts.

## Structure

cfOmics is a comprehensive database for cell-free multi-omics high-throughput data, which is comprised of five parts:

| Part              | Description                                      | Folder           |
| ----------------- | ------------------------------------------------ | ---------------- |
| React.js frontend | Frontend                                         | /frontend/       |
| Node.js backend   | Browsing module and for prompting search options | /backend-node/   |
| Django backend    | Analyses and drawing plots                       | /backend-django/ |
| MySQL database    | Data storage and orgnization                     | N/A              |
| Apache webserver  | Proxy for handling network traffic               | N/A              |

As the website need a large amount of data to run properly, you will need to directly connect to our working database to run this project. Also, as the proxy web server is only meant for deployment, it is not implemented here.

## Request Environment Files Containing Secrets

Because you will need to directly connect to our online database, to prevent abuse of our database and API, you need to contact [choutianxius@gmail.com](mailto:choutianxius@gmail.com) to get three environment files before running this project. Place the environment files and rename them as follows:

| Original File | Path                            | Rename To                |
| ------------- | ------------------------------- | ------------------------ |
| .env-react    | /frontend/.env-react            | /frontend/.env           |
| .env-node     | /backend-node/.env-node         | /backend-node/.env       |
| .env-django   | /backend-django/app/.env-django | /backend-django/app/.env |

## How to Start

- Make sure the environment files are ready.

- Install Docker and Docker Compose. You can just install [Docker Desktop](https://www.docker.com/products/docker-desktop/) if it's available for your machine.
- You need to have basic exposure to shell.
- Make sure that ports 3000, 8084 and 8085 are not occupied on your machine.

- Clone this repository. At the root level of this repository (the same level as this file), run

  ~~~shell
  docker compose build # first-time run only
  docker compose up
  ~~~

  Now you can visit the website at [http://localhost:3000](http://localhost:3000). The `docker compose build` command is only required for the first-time start.

- To stop, press CTRL+C and run

  ~~~shell
  docker compose down
  ~~~


## Warning

**DO NOT** redistribute the built image!



