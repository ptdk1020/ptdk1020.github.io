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

![post2](/images/posts/stock-analysis/stock-project-overview.jpg "Overview Diagram")

The application code is deployed to a Compute Engine instance where it is run inside a [Docker](https://www.docker.com/) container. The instance is configured to run the container application daily. The application makes Polygon API calls, saves raw data to a cloud storage bucket, and inserts ETL-processed data to a SQLite metadatabase stored in the same storage bucket.

*Note: I use the processed data to run time series stock price predictions (expand later).*


## Setup <a name="setup"></a>
### Polygon API
Simply go to [Polygon](https://polygon.io/) and request a Free API key. The basic free tier is sufficient for my purpose. 

From the [documentation](https://polygon.io/docs/stocks), there is a quite a variety of calls one can make such as getting the list of tickers, getting details of a particular ticker, getting the trades of a particular ticker within a given time range, etc. 

To get the most out of a single API call, I decided to use [Grouped Daily](https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date) calls to obtain the OHLC (open, high, low, and close) for the entire stocks/equities markets.

### Cloud Components Setup
_to be expanded_


