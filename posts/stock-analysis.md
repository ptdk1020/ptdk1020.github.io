---
title: "End-to-End Stock Data Analysis (WIP)"
date: "June 20 2023"
excerp: ""
cover_image: "/images/posts/stock-analysis/stock-cover.jpg"
---

_**This post is still being updated**_

## Table of Contents
1. [Overview](#overview)
2. [Setup](#setup)

## Overview <a name="overview"></a>
I thought it would be fun to create my own end-to-end cloud-based application to gather and analyze stock data. To do this, I used a Google Cloud Platform account for hosting and free tier [Polygon API](https://polygon.io/) for data gathering. Here is a simple workflow diagram

![post2-1](/images/posts/stock-analysis/stock-project-overview.jpg "Overview Diagram")

The application code is deployed to a Compute Engine instance where it is run inside a [Docker](https://www.docker.com/) container. The instance is configured to run the container application daily. The application makes Polygon API calls, saves raw data to a cloud storage bucket, and inserts ETL-processed data to a SQLite metadatabase stored in the same storage bucket.

*Note: I use the processed data to run time series stock price predictions (to expanded at a later update).*


## Setup <a name="setup"></a>
### Polygon API
Simply go to [Polygon](https://polygon.io/) and request a Free API key. The basic free tier is sufficient for my purpose. 

From the [documentation](https://polygon.io/docs/stocks), there is a quite a variety of calls one can make such as getting the list of tickers, getting details of a particular ticker, getting the trades of a particular ticker within a given time range, etc. 

To get the most out of a single API call, I decided to use [Grouped Daily](https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date) calls to obtain the OHLC (open, high, low, and close) for the entire stocks/equities markets.

### Cloud Components Setup
#### Compute Engine
I prefer my compute instance to be as small as possible, so I went with the e2-micro (2vCPU, 1Gb Memory, 10Gb VM storage) with a Debian image. In hindsight, it may have been a better idea to go with a Container-Optimized OS image since it would have Docker pre-installed.

I went through a couple of iterations when deploying the application. It was originally simply deployed with a codebase where my scripts were triggered by a cronjob. But since that made it difficult for local testing and migration, I decided to dockerize it. One can follow these [instructions](https://docs.docker.com/engine/install/debian/) to install Docker on the instance.

#### Storage bucket
I use a cloud storage bucket to store the raw API JSON response as well as a SQLite metadatabase.

#### Codebase
To keep things in the same ecosystem, I kept the code on GCP Source Repositories, which can then be pulled to the compute instance as well as my desktop for local development. Below is the structure of the code base.
```
├── src
│   ├── sql_scripts
│   │   ├── *.sql
│   ├── *.py
├── shell_scripts
│   ├── run.sh
├── .env
├── Dockerfile
├── requirements.txt
└── .gitignore
```
Note that the `.env` file is not committed to the repository.

## Workflow
### Docker container
Once the code is pulled to the instance, I simply create a `.env` file, build the Docker image, and create a Docker container. 

The content of the Dockerfile is as follows:
```dockerfile
FROM google/cloud-sdk:slim
WORKDIR /stockapp
COPY .env requirements.txt ./
ADD /src ./src
ADD /shell_scripts ./shell_scripts

RUN mkdir -p ./data ./data/ticker_json ./data/grouped_daily_json
RUN pip3 install -r requirements.txt
RUN pip3 install torch --index-url https://download.pytorch.org/whl/cpu
RUN chmod +x ./shell_scripts/*.sh

CMD ["./shell_scripts/run.sh"]
```

The container would run the `run.sh` executable at every daily cronjob run. The content of this script is as follows.
```sh
#!/bin/sh
echo $(date +"Container run started at: %c")
python3 /stockapp/src/get_grouped_daily.py
gsutil -m cp -r -n /stockapp/data/grouped_daily_json gs://stock-data-project-khoa
gsutil cp gs://stock-data-project-khoa/stock.db /stockapp/data/stock.db
python3 /stockapp/src/etl_grouped_daily.py
gsutil cp /stockapp/data/stock.db gs://stock-data-project-khoa
rm /stockapp/data/grouped_daily_json/*
rm /stockapp/data/stock.db
echo $(date +"Container run ended at: %c")
```

### ETL Process
The `get_grouped_daily.py` script makes the API call, and saves JSON response to the storage bucket. The `etl_grouped_daily.py` script loads the JSON response, does some light processing, and insert the data into the SQLite metadatabase file.

![](/images/posts/stock-analysis/db-browser.png "DB Sample")

The data is inserted into the `daily` table. As we can see, each line contains the OHLC prices of a particular ticker in a particular day. 

