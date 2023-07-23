---
title: "End-to-End Stock Data Analysis"
date: "2023-07-05"
excerp: ""
cover_image: "/images/posts/stock-analysis/stock-cover.jpg"
---

## Table of Contents
1. [Overview](#overview)
2. [Setup](#setup)
3. [Workflow](#workflow)
4. [Forecasting Specifics](#forecasting)

## Overview <a name="overview"></a>
I thought it would be fun to create my own end-to-end cloud-based application to gather and analyze stock data. While the application code is kept on GCP Source Repositories, I also created a corresponding [Github repo](https://github.com/ptdk1020/stock-analysis) for future reference.

Moving onto the project overview, I used a Google Cloud Platform account for hosting and free tier [Polygon API](https://polygon.io/) for data gathering. Here is a simple workflow diagram

![post2-1](/images/posts/stock-analysis/stock-project-overview.jpg "Overview Diagram")

The application code is deployed to a Compute Engine instance where it is run inside a [Docker](https://www.docker.com/) container. The instance is configured to run the container application daily. The application makes Polygon API calls, saves raw data to a cloud storage bucket, and inserts ETL-processed data to a SQLite metadatabase stored in the same storage bucket.

I use a smaller portion of the processed data to run stock price predictions using an LSTM model. Of course, other recurrent network architectures (such as RNN or GRU) or vector times series models (such as Vector Auto Regression) would also work.


## Setup <a name="setup"></a>
### Polygon API
Simply go to [Polygon](https://polygon.io/) and request a Free API key. The basic free tier is sufficient for my purpose. 

From the [documentation](https://polygon.io/docs/stocks), there is a quite a variety of calls one can make such as getting the list of tickers, getting details of a particular ticker, getting the trades of a particular ticker within a given time range, etc. 

To get the most out of a single API call, I decided to use [Grouped Daily calls](https://polygon.io/docs/stocks/get_v2_aggs_grouped_locale_us_market_stocks__date) to obtain the OHLC (open, high, low, and close) for the entire stocks/equities markets.

### Cloud Components Setup
#### Compute Engine
I prefer my compute instance to be as small as possible, so I went with the e2-micro (2vCPU, 1Gb Memory, 10Gb VM storage) with a Debian image. 

I went through a couple of iterations when deploying the application. It was originally simply deployed with a codebase where my scripts were triggered by a cronjob. But since that made it difficult for local testing and migration, I decided to dockerize it. One can follow these [instructions](https://docs.docker.com/engine/install/debian/) to install Docker on the instance.

#### Storage bucket
I use a cloud storage bucket to store the raw API JSON response as well as a SQLite metadatabase.

#### Codebase
To keep things in the same ecosystem, I kept the code on GCP Source Repositories, which can then be pulled to the compute instance as well as my desktop for local development. Below is the structure of the relevant codebase.
```
├── src
│   ├── sql_scripts
│   │   ├── *.sql
│   ├── bq_schemas
│   │   ├── small_daily.json
│   ├── forecasting
│   │   ├── data_prep.py
│   │   ├── models.py
│   ├── api_models.py
│   ├── bigquery.py
│   ├── etl_grouped_daily.py
│   ├── forecast.py
│   ├── get_grouped_daily.py
├── shell_scripts
│   ├── run.sh
├── .env
├── Dockerfile
└── requirements.txt
```
Note that the `.env` file is not committed to the repository.

## Workflow <a name="workflow"></a>
### Docker container
Once the code is pulled to the instance, I simply create a `.env` file, build the Docker image, and create a Docker container. 

The content of the Dockerfile is as follows:
```dockerfile
FROM google/cloud-sdk:slim

WORKDIR /stockapp
COPY .env requirements.txt ./
ADD /src ./src
ADD /shell_scripts ./shell_scripts

RUN mkdir -p ./data ./data/ticker_json ./data/grouped_daily_json ./data/models
RUN pip3 install -r requirements.txt
RUN pip3 install torch --index-url https://download.pytorch.org/whl/cpu

RUN chmod +x ./shell_scripts/*.sh

CMD ["./shell_scripts/run.sh"]
```

The container would run the `run.sh` executable at every daily cron job. The content of this script is as follows.
```sh
#!/bin/sh
echo $(date +"Container run started at: %c")
python3 /stockapp/src/get_grouped_daily.py

gsutil -m cp -r -n /stockapp/data/grouped_daily_json gs://stock-data-project-khoa
gsutil cp gs://stock-data-project-khoa/stock.db /stockapp/data/stock.db
gsutil -m cp -r gs://stock-data-project-khoa/models /stockapp/data

python3 /stockapp/src/etl_grouped_daily.py
python3 /stockapp/src/forecast.py
python3 /stockapp/src/bigquery.py


gsutil cp -r /stockapp/data/models gs://stock-data-project-khoa
gsutil cp /stockapp/data/stock.db gs://stock-data-project-khoa

rm /stockapp/data/grouped_daily_json/*
rm /stockapp/data/models/*
rm /stockapp/data/stock.db
echo $(date +"Container run ended at: %c")
```

### ETL and Forecast Process
From the shell script displayed above: 
- The `get_grouped_daily.py` script makes the API call, and saves JSON response to the storage bucket. 
- The `etl_grouped_daily.py` script loads the JSON response, does some light processing, and insert the data into the SQLite metadatabase file.

![](/images/posts/stock-analysis/db-browser.png "DB Sample")

The data is inserted into the `daily` table. As we can see, each line contains the OHLC prices of a particular ticker in a particular day. 

- The `forecast.py` considers data for tickers AAPL, AMZN, GOOG, META, NFLX. It runs historical close price prediction as well as forecasting for the following days. The resulting data is stored the `small_daily` table in the metadatabase. Below is the historical close prices of these tickers.

![](/images/posts/stock-analysis/close-price.png "Daily Close Price")

- The `bigquery.py` queries the `small_daily` table and writes it into BigQuery for quick analysis. The data can then be displayed by connecting the BigQuery table to a Looker Studio report. Below is the the historical close price for META as well as forecasting for several subsequent days.

![](/images/posts/stock-analysis/pred-close-price.png "Daily Close Price Prediction")


## Forecasting Specifics <a name="forecasting"></a>
### Data Processing
Our model will be a sequence to label model. So we would need our dataset to be a context sequence of numbers coupled with the next number as the target, i.e., a labeled data point is a pair (context,target) where the context is essentially a sequence $(x_1,\dots,x_n)$ of numbers. In general, our data point is of the form
$$
\text{context} = (v_1,\dots, v_n), \quad \text{label} = v
$$
where $v_1,\dots, v_n, v \in \mathbb{R}^k$ with $k$ being the number of considered tickers. This number $k$ corresponds to the input dimension of our LSTM model. As a side note, usually, in text generation tasks, $k$ is the embedding dimension. Below is a simplified version of my data processing code.

```python
class DataPrep(Dataset):
    def __init__(self,df,window_size,tickers_config_path=None):
        self.window_size = window_size
        self.data_index = df["date"].sort_values().unique().tolist()
        self.tickers_config_path = tickers_config_path
        self.tickers_config, self.data, self.data_normalized = self._generate_train_data(df)
        self.windows_targets = self._generate_windowstargets()

    def _generate_train_data(self, df):
        tickers = sorted(df["ticker"].unique().tolist())
        tickers_config = {}
        tensors = []
        tensors_normalized = []
        for ticker in tickers:
            series = df[df["ticker"]==ticker][["date","close_price"]]
            series.sort_values(by="date",inplace=True)
            series.set_index("date",inplace=True)
            series = series["close_price"]
            self.data_index = series.index.tolist()
            
            tensor = torch.tensor(series.values, dtype=torch.float32).unsqueeze(1)
            tensors.append(tensor)
            series_normalized, series_mean, series_std = normalize(series)
            tickers_config[ticker] = {"mean":series_mean,"std":series_std}

            tensor_normalized = torch.tensor(series_normalized.values, dtype=torch.float32).unsqueeze(1)
            tensors_normalized.append(tensor_normalized)
        return tickers_config, torch.cat(tensors, dim = -1), torch.cat(tensors_normalized, dim = -1)
    
    def _generate_windowstargets(self):
        return [
            (self.data_normalized[i:i+self.window_size],
             self.data[i+self.window_size]
            ) for i in range(len(self.data_normalized)-self.window_size)
        ]
    
    def __len__(self):
        return len(self.windows_targets)
        

    def __getitem__(self,ix):
        window, target = self.windows_targets[ix]
        return window, target
```

Note that $df$ is the ETL data and that *window_size* is the sequence length $n$. In this processed data, for simplicity, the sequence lengths for all data points are the same. In general, this does not need to be the case. One additional point to note is that the context data is normalized.


### Model

Below is the LSTM model that I created together with the usual Pytorch training loop. As mentioned above, the input size is the number of tickers. This means that the model is a multivariate time series, and is capable to make a large amount of predictions at once. I only use 5 tickers, but it is simple to vary this number.

```python
class LSTMModel(nn.Module):
    def __init__(self, input_size,hidden_size):
        torch.manual_seed(0)
        super().__init__()
        self.config = {"input_size":input_size,"hidden_size":hidden_size}
        self.lstm_layer = nn.LSTM(input_size=input_size, hidden_size=hidden_size,batch_first=True)
        self.fc = nn.Linear(hidden_size, input_size)

    def forward(self, x):
        _, x = self.lstm_layer(x)
        x = self.fc(x[0]).squeeze(0)
        return x

    def train_fn(self,dataloader,epochs=1000):
        torch.manual_seed(0)
        self.train()
        loss_fn = nn.L1Loss()
        optimizer = torch.optim.Adam(params=self.parameters(),lr=0.01)
        for epoch in range(epochs):
            train_iter = iter(dataloader)
            epoch_loss = 0
            for batch, (X,y) in enumerate(train_iter):
                optimizer.zero_grad()
                yhat = self(X)
                loss = loss_fn(yhat,y)
                epoch_loss += loss.item()
                loss.backward()
                optimizer.step()
            epoch_loss = epoch_loss/len(train_iter)
            if epoch % 100 == 0:
                print(f"Epoch {epoch} loss: {epoch_loss}")

    def predict(self,x):
        self.eval()
        with torch.inference_mode():
            pred = self(x)
        return pred
```

### Forecasting
At forecasting time, I evaluate the historical predictions as well as forecast a few subsequent days. The (simplified) main forecast function is as follows:

```python
def main():
    df = load_db_data(conn,sql_path)

    # trainer will check the weekly config date to see if it needs to train
    trainer(df,model_config_path,model_path,models_folder,train_config_path)
    
    # load inference dataset
    dataset = load_inference_data(df,tickers_config_path,train_config_path)
    # load model artifact
    model = load_model(model_config_path,model_path)

    # predict historical data
    pred_historical = predict_historical_data(model,dataset)
    # forecast
    forecast = forecast_next_n(model,dataset)
    # write to db
    write_to_db(conn,dataset,df,forecast,pred_historical)
```

A good retraining approach is to monitor model health with loss function, and retrain if it performs outside a certain threshold. But, for simplicity, I set the model to retrain weekly. The historical predictions as well next day's forecast are done with short term forecasting, i.e., using the ground truth values to compute target. Beyond that, the predicted values are used in recursive fashion for long term forecasting.


## Conclusion
It was very fun to create my own stock analysis application. Now, every morning, I can simply go to my Looker Studio report to see the previous day's close prices for these tickers as well as subsequent days predictions. Of course, one would need to try different models, and apply additional techniques to make it a usable stock forecasting tool, as my goal was simply to create an end-to-end pipeline.

To the reader, hope you had fun reading. Goodbye for now!











