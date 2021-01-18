---
layout: post
tags: [EDA, visualization]
---

In this notebook, I want to perform Exploratory Data Analysis (EDA) with data from the [Housing Prices Kaggle competition](https://www.kaggle.com/c/house-prices-advanced-regression-techniques). Note that the analysis is far from complete, but can serve as a starting point.

Aside from my own attempt, I also got a lot of inspiration from [Comprehensive data exploration with Python](https://www.kaggle.com/pmarcelino/comprehensive-data-exploration-with-python).

---------------------------

## Table of contents
1. [Univariate visualization](#univiz)
2. [Multivariate visualization](#multiviz)
3. [Some feature analysis](#featanalysis)
4. [Brief look at missing data](#missingdata)


```python
# import libraries
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import scipy as scp
```


```python
# read the training set into a pd dataframe
train = pd.read_csv('Data/train.csv', index_col=0)
```


```python
# dataframe information
train.info()
```

    <class 'pandas.core.frame.DataFrame'>
    Int64Index: 1460 entries, 1 to 1460
    Data columns (total 80 columns):
     #   Column         Non-Null Count  Dtype  
    ---  ------         --------------  -----  
     0   MSSubClass     1460 non-null   int64  
     1   MSZoning       1460 non-null   object
     2   LotFrontage    1201 non-null   float64
     3   LotArea        1460 non-null   int64  
     4   Street         1460 non-null   object
     5   Alley          91 non-null     object
     6   LotShape       1460 non-null   object
     7   LandContour    1460 non-null   object
     8   Utilities      1460 non-null   object
     9   LotConfig      1460 non-null   object
     10  LandSlope      1460 non-null   object
     11  Neighborhood   1460 non-null   object
     12  Condition1     1460 non-null   object
     13  Condition2     1460 non-null   object
     14  BldgType       1460 non-null   object
     15  HouseStyle     1460 non-null   object
     16  OverallQual    1460 non-null   int64  
     17  OverallCond    1460 non-null   int64  
     18  YearBuilt      1460 non-null   int64  
     19  YearRemodAdd   1460 non-null   int64  
     20  RoofStyle      1460 non-null   object
     21  RoofMatl       1460 non-null   object
     22  Exterior1st    1460 non-null   object
     23  Exterior2nd    1460 non-null   object
     24  MasVnrType     1452 non-null   object
     25  MasVnrArea     1452 non-null   float64
     26  ExterQual      1460 non-null   object
     27  ExterCond      1460 non-null   object
     28  Foundation     1460 non-null   object
     29  BsmtQual       1423 non-null   object
     30  BsmtCond       1423 non-null   object
     31  BsmtExposure   1422 non-null   object
     32  BsmtFinType1   1423 non-null   object
     33  BsmtFinSF1     1460 non-null   int64  
     34  BsmtFinType2   1422 non-null   object
     35  BsmtFinSF2     1460 non-null   int64  
     36  BsmtUnfSF      1460 non-null   int64  
     37  TotalBsmtSF    1460 non-null   int64  
     38  Heating        1460 non-null   object
     39  HeatingQC      1460 non-null   object
     40  CentralAir     1460 non-null   object
     41  Electrical     1459 non-null   object
     42  1stFlrSF       1460 non-null   int64  
     43  2ndFlrSF       1460 non-null   int64  
     44  LowQualFinSF   1460 non-null   int64  
     45  GrLivArea      1460 non-null   int64  
     46  BsmtFullBath   1460 non-null   int64  
     47  BsmtHalfBath   1460 non-null   int64  
     48  FullBath       1460 non-null   int64  
     49  HalfBath       1460 non-null   int64  
     50  BedroomAbvGr   1460 non-null   int64  
     51  KitchenAbvGr   1460 non-null   int64  
     52  KitchenQual    1460 non-null   object
     53  TotRmsAbvGrd   1460 non-null   int64  
     54  Functional     1460 non-null   object
     55  Fireplaces     1460 non-null   int64  
     56  FireplaceQu    770 non-null    object
     57  GarageType     1379 non-null   object
     58  GarageYrBlt    1379 non-null   float64
     59  GarageFinish   1379 non-null   object
     60  GarageCars     1460 non-null   int64  
     61  GarageArea     1460 non-null   int64  
     62  GarageQual     1379 non-null   object
     63  GarageCond     1379 non-null   object
     64  PavedDrive     1460 non-null   object
     65  WoodDeckSF     1460 non-null   int64  
     66  OpenPorchSF    1460 non-null   int64  
     67  EnclosedPorch  1460 non-null   int64  
     68  3SsnPorch      1460 non-null   int64  
     69  ScreenPorch    1460 non-null   int64  
     70  PoolArea       1460 non-null   int64  
     71  PoolQC         7 non-null      object
     72  Fence          281 non-null    object
     73  MiscFeature    54 non-null     object
     74  MiscVal        1460 non-null   int64  
     75  MoSold         1460 non-null   int64  
     76  YrSold         1460 non-null   int64  
     77  SaleType       1460 non-null   object
     78  SaleCondition  1460 non-null   object
     79  SalePrice      1460 non-null   int64  
    dtypes: float64(3), int64(34), object(43)
    memory usage: 923.9+ KB


As we can see, there are 80 features, with 1460 sample points. Moreover, there are many missing values (which can be logically missing). At this point, it is hard to tell which features are important.

The competition came with a benchmark prediction, being linear regression on `LotArea`, `MoSold`, `YrSold`, `BedroomAbvGr`, with target `SalePrice`. So, to improve upon this prediction, it would certainly be helpful to look more closely at these features.

We will explore, with a slight view toward data visualization.
1. Univariate visualization:
2. Multivariate visualization

### Univariate visualization <a name="univiz">


```python
# describe SalePrice
train['SalePrice'].describe()
```




    count      1460.000000
    mean     180921.195890
    std       79442.502883
    min       34900.000000
    25%      129975.000000
    50%      163000.000000
    75%      214000.000000
    max      755000.000000
    Name: SalePrice, dtype: float64




```python
# look at SalePrice distribution with histogram
plt.figure(figsize=(20,10))
plt.title('SalePrice distribution')
sns.histplot(train['SalePrice'])
```




    <AxesSubplot:title={'center':'SalePrice distribution'}, xlabel='SalePrice', ylabel='Count'>




![png](/images/housingpricesEDA/output_7_1.png)



```python
# SalePrice with boxplot/violinplot
_, axes = plt.subplots(nrows=1,ncols=2,sharey=True,figsize=(8,4))
sns.boxplot(y=train['SalePrice'],ax=axes[0]);
sns.violinplot(y=train['SalePrice'],ax=axes[1])
```




    <AxesSubplot:ylabel='SalePrice'>




![png](/images/housingpricesEDA/output_8_1.png)


From the histogram, we might want to guess that `SalePrice` follows a log-normal distribution. One way to verify this using [Kolmogorov-Smirnov test](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.kstest.html).


```python
scp.stats.lognorm.fit(train['SalePrice'])
```




    (0.39897548872302213, -129.93222216110172, 166854.6998403497)




```python
scp.stats.kstest(train['SalePrice'],'lognorm',
                scp.stats.lognorm.fit(train['SalePrice']))
```




    KstestResult(statistic=0.040898917784028654, pvalue=0.014705247778226238)




```python
# QQ plot
from scipy import stats

stats.probplot(np.log(1+train.SalePrice),plot=plt)
```




    ((array([-3.30513952, -3.04793228, -2.90489705, ...,  2.90489705,
              3.04793228,  3.30513952]),
      array([10.46027076, 10.47197813, 10.54273278, ..., 13.34550853,
             13.52114084, 13.53447435])),
     (0.398259646654151, 12.024057394918403, 0.9953761551826701))




![png](/images/housingpricesEDA/output_12_1.png)



```python
# Lot Area
plt.figure(figsize=(20,10))
plt.title('LotArea distribution')
plt.xlim(0,50000) # limit values to get a more legible graph
sns.histplot(train['LotArea'])
```




    <AxesSubplot:title={'center':'LotArea distribution'}, xlabel='LotArea', ylabel='Count'>




![png](/images/housingpricesEDA/output_13_1.png)



```python
# Bedrooms (above ground)
sns.countplot(x='BedroomAbvGr',data=train)
```




    <AxesSubplot:xlabel='BedroomAbvGr', ylabel='count'>




![png](/images/housingpricesEDA/output_14_1.png)



```python
# It makes sense to combine MoSold and YrSold into a single DateSold column
dates=train['MoSold'].astype(str)+ '-' +train['YrSold'].astype(str)
dates = pd.to_datetime(dates, format='%m-%Y').dt.to_period('M')
train['DtSold'] = dates
plt.figure(figsize=(5,10))
dates.value_counts().sort_index().plot(kind='barh')
```




    <AxesSubplot:>




![png](/images/housingpricesEDA/output_15_1.png)


Interestingly, there are more entries of sold houses in the Spring-Summer months of May, June and July. This information doesn't seem particularly useful for us, but it is interesting nonetheless.

### Multivariate Visualization <a name="multiviz">

We aim to show the relationships between `SalePrice` and the other features.



```python
# LotArea, Bedrooms, SalePrice
plt.figure(figsize=(8,8))
plt.xlim(0,40000)
sns.scatterplot(data=train, x='LotArea', y='SalePrice',hue='BedroomAbvGr',
               palette='deep')
```




    <AxesSubplot:xlabel='LotArea', ylabel='SalePrice'>




![png](/images/housingpricesEDA/output_18_1.png)


*Note*: somewhat as expected, we see that `SalePrice` have positive correlations with `LotArea` and `BedroomAbvGr`. In other words, larger areas and/or more rooms means higher sale price.


```python
# average SalePrice per month
train.groupby('DtSold').SalePrice.mean().plot()
```




    <AxesSubplot:xlabel='DtSold'>




![png](/images/housingpricesEDA/output_20_1.png)


### Some feature analysis <a name="featanalysis">
We can try to find the correlations between each of the features and `SalePrice`. For this, let us work with the numerical features.


```python
# obtain a list of numerical and categorical columns
# some numerical columns are categorical/ordinal by nature
dates = []
numerical = []
categorical = []

for col in train.columns:
    if train[col].dtype in ['int64','float64']:
        numerical.append(col)
    elif col == 'DtSold':
        dates.append(col)
    else:
        categorical.append(col)

len(numerical) + len(categorical) + 1 == len(train.columns)
```




    True




```python
# columns correlations
plt.figure(figsize=(12,12))
sns.heatmap(train.corr(),vmax=.8, square=True)
```




    <AxesSubplot:>




![png](/images/housingpricesEDA/output_23_1.png)



```python
# correlations with SalePrice column
sale_corr = train[numerical].corr()['SalePrice'][:]
plt.figure(figsize=(10,7))
sns.barplot(x=sale_corr[:-1], y=sale_corr.index[:-1])
```




    <AxesSubplot:xlabel='SalePrice'>




![png](/images/housingpricesEDA/output_24_1.png)



```python
# some numerica features with higher correlations with SalePrice
high_corr = [col for col in sale_corr.index[:-1] if abs(sale_corr[col])>0.5]
high_corr
```




    ['OverallQual',
     'YearBuilt',
     'YearRemodAdd',
     'TotalBsmtSF',
     '1stFlrSF',
     'GrLivArea',
     'FullBath',
     'TotRmsAbvGrd',
     'GarageCars',
     'GarageArea']




```python
sns.set()
sns.pairplot(train[high_corr], height=2.5)
```




    <seaborn.axisgrid.PairGrid at 0x2531747f760>




![png](/images/housingpricesEDA/output_26_1.png)


### Brief look at missing data <a name="missingdata">

We aim to look at missing data. There are various reasons why data can be missing: simply randomly missing, or logically missing due to how the nature of the feature or due to the way data was recorded.

There are also various ways to deal with missing data: simply delete features/samples, or imputation.


```python
# obtaining missing data
missing = train.isnull().sum().sort_values(ascending=False)
missing_train = missing[missing>0]
missing_train/train.shape[0]
```




    PoolQC          0.995205
    MiscFeature     0.963014
    Alley           0.937671
    Fence           0.807534
    FireplaceQu     0.472603
    LotFrontage     0.177397
    GarageYrBlt     0.055479
    GarageType      0.055479
    GarageQual      0.055479
    GarageCond      0.055479
    GarageFinish    0.055479
    BsmtFinType2    0.026027
    BsmtExposure    0.026027
    BsmtCond        0.025342
    BsmtFinType1    0.025342
    BsmtQual        0.025342
    MasVnrArea      0.005479
    MasVnrType      0.005479
    Electrical      0.000685
    dtype: float64




```python
# let us also look at the test set for this
test = pd.read_csv('Data/test.csv', index_col=0)
missing = test.isnull().sum().sort_values(ascending=False)
missing_test = missing[missing>0]
missing_test
```




    PoolQC          1456
    MiscFeature     1408
    Alley           1352
    Fence           1169
    FireplaceQu      730
    LotFrontage      227
    GarageCond        78
    GarageFinish      78
    GarageYrBlt       78
    GarageQual        78
    GarageType        76
    BsmtCond          45
    BsmtExposure      44
    BsmtQual          44
    BsmtFinType1      42
    BsmtFinType2      42
    MasVnrType        16
    MasVnrArea        15
    MSZoning           4
    BsmtHalfBath       2
    Utilities          2
    Functional         2
    BsmtFullBath       2
    BsmtFinSF2         1
    BsmtFinSF1         1
    BsmtUnfSF          1
    TotalBsmtSF        1
    Exterior2nd        1
    SaleType           1
    Exterior1st        1
    KitchenQual        1
    GarageArea         1
    GarageCars         1
    dtype: int64



In general, it is not clear how important these features with missing data are. The first thing to go might simply be dropping these features. At test time, there are some missing data in some other features (the number is low, so we can probably say that this is due to chance/error, we can deal with this later).

Following the [kernel](https://www.kaggle.com/pmarcelino/comprehensive-data-exploration-with-python), it makes sense to keep only `Electrical`, where we remove training samples with missing `Electrical` data. Of course, what we are saying here is quite vague, and potentially incorrect. But, it is certainly a starting point.
