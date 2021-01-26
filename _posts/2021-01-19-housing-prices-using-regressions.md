## Table of contents:
1. [Introduction](#intro)
2. [Some data processing](#dataprocessing)
3. [Model](#model)

-----------

### Introduction <a name="intro">
The problem statement is to use data provided by the [Kaggle competition](https://www.kaggle.com/c/house-prices-advanced-regression-techniques) to predict housing prices of residential homes in Ames, Iowa. This data is from the [Ames Housing dataset](http://jse.amstat.org/v19n3/decock.pdf).
In another post, I performed some Exploratory Data Analysis on the training set.

There are many great Kaggle kernels for this. For our starting point, our goal in this post is to approach the problem using only linear models. It is important to note that our post is heavily influenced by the great [notebook](https://www.kaggle.com/apapiu/regularized-linear-models) written by A. Papiu. There is a small difference in methodology in the data processing step, which will be discussed later.



```python
# import libraries
import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import cross_val_score, StratifiedKFold, \
                                    GridSearchCV, learning_curve, \
                                    validation_curve

import matplotlib.pyplot as plt
from scipy.stats import skew
from scipy.stats.stats import pearsonr

%config InlineBackend.figure_format = 'retina'
%matplotlib inline
```


```python
# Load data
train_df = pd.read_csv('Data/train.csv',index_col=0)
test_df = pd.read_csv('Data/test.csv',index_col=0)
```

### Some data preprocessing

In the [notebook](https://www.kaggle.com/apapiu/regularized-linear-models), during processing, the author combined both train and test data before the imputation. To avoid potential data leakage, I will process train data and test data separately. Missing data imputation will be done with train data information.

* In the training data, log transform the target column.
* Since some numeric features are more skewed, taking log(feature + 1) will make the features more normal. These features are obtained from computing the third moment of the numerical columns.
* Replace numeric missing values with the mean of their respective columns in the train data.
* One-hot categorical imputations. At test time, unknown values will be ignored.


```python
# find numeric and categorical features
numerical=train_df.iloc[:,:-1].dtypes[train_df.iloc[:,:-1].dtypes!='object']
numerical = numerical.index
categorical=train_df.iloc[:,:-1].dtypes[train_df.iloc[:,:-1].dtypes=='object']
categorical=categorical.index
```


```python
# find numerical features with skewness > 0.75
skews = train_df[numerical].apply(lambda x: skew(x.dropna()))
skews = skews[skews>0.75].index
skews
```




    Index(['MSSubClass', 'LotFrontage', 'LotArea', 'MasVnrArea', 'BsmtFinSF1',
           'BsmtFinSF2', 'BsmtUnfSF', 'TotalBsmtSF', '1stFlrSF', '2ndFlrSF',
           'LowQualFinSF', 'GrLivArea', 'BsmtHalfBath', 'KitchenAbvGr',
           'WoodDeckSF', 'OpenPorchSF', 'EnclosedPorch', '3SsnPorch',
           'ScreenPorch', 'PoolArea', 'MiscVal'],
          dtype='object')




```python
# log transform the target column from train data
train_df.SalePrice = np.log1p(train_df.SalePrice)

# fill in missing numerical data with the train data column mean
train_df[numerical] = train_df[numerical].fillna(train_df[numerical].mean())
test_df[numerical] = test_df[numerical].fillna(train_df[numerical].mean())

# log transform the skewed columns
train_df[skews] = np.log1p(train_df[skews])
test_df[skews] = np.log1p(test_df[skews])

# fill in missing categorical data with 'missing'
train_df[categorical] = train_df[categorical].fillna('missing')
test_df[categorical] = test_df[categorical].fillna('missing')
```


```python
# one hot encode categorical object
ohe = OneHotEncoder(handle_unknown='ignore', sparse=False)
oh_train = pd.DataFrame(ohe.fit_transform(train_df[categorical]))
oh_test = pd.DataFrame(ohe.transform(test_df[categorical]))

# one-hot encoding removed index, we put it back
oh_train.index = train_df.index
oh_test.index = test_df.index

# remove categorical column
num_train = train_df.drop(categorical,axis=1)
num_test = test_df.drop(categorical,axis=1)

# add numerical columns and one-hot encoded columns together
train = pd.concat([num_train,oh_train],axis=1)
y = train.SalePrice
train.drop('SalePrice',axis=1,inplace=True)
test = pd.concat([num_test,oh_test],axis=1)
```


```python
# for convenience, let us save these files
train.to_csv("Data/train_imputed.csv")
test.to_csv("Data/test_imputed.csv")
```

*Note*: It might have been a better idea to use sklearn pipeline to do the data processing.

### Model <a name="model">

In the next step, I want to go make predictions using linear regression models (e.g., ordinary least squares, ridge regressions, lasso, elastic net). I will also attempt some hyperparameter tuning together with model evaluation via root mean squared error.

From `sklearn.model_selection`, `cross_val_score`, and `learning_curve` are useful.




```python
from sklearn.model_selection import cross_val_score, StratifiedKFold, \
                                    GridSearchCV, learning_curve, \
                                    validation_curve
from sklearn.metrics import mean_squared_error
from sklearn.linear_model import LinearRegression
from sklearn.linear_model import LinearRegression, Ridge, Lasso, ElasticNet
```

We have the following [plot_learning_curve function](https://scikit-learn.org/stable/auto_examples/model_selection/plot_learning_curve.html#sphx-glr-auto-examples-model-selection-plot-learning-curve-py). I modified the call on `learning_curve` to change to scoring to root mean squared error.


```python
# learning curve
def plot_learning_curve(estimator, title, X, y, axes=None, ylim=None, cv=None,
                        n_jobs=None, train_sizes=np.linspace(.1, 1.0, 5)):
    if axes is None:
        _, axes = plt.subplots(1, 3, figsize=(20, 5))

    axes[0].set_title(title)
    if ylim is not None:
        axes[0].set_ylim(*ylim)
    axes[0].set_xlabel("Training examples")
    axes[0].set_ylabel("Score")

    train_sizes, train_scores, test_scores, fit_times, _ = \
        learning_curve(estimator, X, y, cv=cv, n_jobs=n_jobs,
                       scoring = "neg_root_mean_squared_error",
                       train_sizes=train_sizes,
                       return_times=True)
    train_scores_mean = -np.mean(train_scores, axis=1)
    train_scores_std = -np.std(train_scores, axis=1)
    test_scores_mean = -np.mean(test_scores, axis=1)
    test_scores_std = -np.std(test_scores, axis=1)
    fit_times_mean = np.mean(fit_times, axis=1)
    fit_times_std = np.std(fit_times, axis=1)

    # Plot learning curve
    axes[0].grid()
    axes[0].fill_between(train_sizes, train_scores_mean - train_scores_std,
                         train_scores_mean + train_scores_std, alpha=0.1,
                         color="r")
    axes[0].fill_between(train_sizes, test_scores_mean - test_scores_std,
                         test_scores_mean + test_scores_std, alpha=0.1,
                         color="g")
    axes[0].plot(train_sizes, train_scores_mean, 'o-', color="r",
                 label="Training score")
    axes[0].plot(train_sizes, test_scores_mean, 'o-', color="g",
                 label="Cross-validation score")
    axes[0].legend(loc="best")

    # Plot n_samples vs fit_times
    axes[1].grid()
    axes[1].plot(train_sizes, fit_times_mean, 'o-')
    axes[1].fill_between(train_sizes, fit_times_mean - fit_times_std,
                         fit_times_mean + fit_times_std, alpha=0.1)
    axes[1].set_xlabel("Training examples")
    axes[1].set_ylabel("fit_times")
    axes[1].set_title("Scalability of the model")

    # Plot fit_time vs score
    axes[2].grid()
    axes[2].plot(fit_times_mean, test_scores_mean, 'o-')
    axes[2].fill_between(fit_times_mean, test_scores_mean - test_scores_std,
                         test_scores_mean + test_scores_std, alpha=0.1)
    axes[2].set_xlabel("fit_times")
    axes[2].set_ylabel("Score")
    axes[2].set_title("Performance of the model")

    return plt

```

#### Linear Regression


```python
# cross validation score for linear regression
-cross_val_score(LinearRegression(),train,y,cv=10,
                 scoring='neg_root_mean_squared_error')
```




    array([0.12453533, 0.10844468, 0.11635599, 0.1632497 , 0.14549552,
           0.22008086, 0.12604069, 0.09827529, 0.2014955 , 0.15725782])




```python
title = "Learning curve (Linear Regression)"
plot_learning_curve(LinearRegression(),title,train,y,cv=10)
plt.show()
```


![png](/images/housingpricesregressions/output_15_0.png)



```python
preds = np.expm1(LinearRegression().fit(train,y).predict(test))
preds = pd.DataFrame(preds,index=test.index)
preds.columns = ['SalePrice']
preds.to_csv('linearregression.csv')
```

Submitting the prediction gives us a public score of 0.428, which is not even as good as the sample submission score. My guess is that the model needs to be modified. The extra features that we have merely added some noise in the prediction.

Looking at the learning curve, we see that there is that a gap between the scores, meaning that we have a high variance problem. Therefore, it makes sense to try some regularization.

#### Ridge Regression
Ridge regression is linear least squared with L2 regularization, with hyperparameter `alpha`.


```python
alphas = [0.01, 0.03, 0.05, 0.1, 0.3, 0.5, 1, 3, 5, 10, 30, 100]
cv_ridge = [-cross_val_score(Ridge(alpha=alpha),
            train,y,cv=10, scoring='neg_root_mean_squared_error').mean()
            for alpha in alphas]
cv_ridge = pd.Series(cv_ridge, index=alphas)
cv_ridge.plot(title='Validation curve for Ridge')
plt.xlabel('alpha')
plt.ylabel('rmse')
plt.show()
```


![png](/images/housingpricesregressions/output_19_0.png)



```python
cv_ridge
```




    0.01      0.136079
    0.03      0.135565
    0.05      0.135152
    0.10      0.134299
    0.30      0.132095
    0.50      0.130748
    1.00      0.128806
    3.00      0.126271
    5.00      0.125553
    10.00     0.125182
    30.00     0.126694
    100.00    0.132439
    dtype: float64



According to the validation curve, the cross validation score seems to be best  at around `alpha`=10.


```python
title = "Learning curve (Ridge Regression)"
plot_learning_curve(Ridge(alpha=10),title,train,y,cv=10)
plt.show()
```


![png](/images/housingpricesregressions/output_22_0.png)



```python
model = Ridge(alpha=10).fit(train,y)
ridge_preds = np.expm1(model.predict(test))
ridge_preds = pd.DataFrame(ridge_preds,index=test.index)
ridge_preds.columns = ['SalePrice']
ridge_preds.to_csv('ridgeregression.csv')
```

Submitting this answer gives a score of 0.125, which is a great improvement. Looking at the learning curve, we see that the gap between the training curve and the cross-validation curve is much smaller.

#### Lasso Regression
Lasso Regression consists of linear least squares together with L1 regularization, with hyperparameter also denoted by `alpha`.


```python
alphas = [0.0001, 0.0003, 0.0005, 0.001, 0.003, 0.005, 0.01, 0.03, 0.05, 0.1]
cv_lasso = [-cross_val_score(Lasso(alpha=alpha),
            train,y,cv=5, scoring='neg_root_mean_squared_error').mean()
            for alpha in alphas]
cv_lasso = pd.Series(cv_lasso, index=alphas)
cv_lasso.plot(title='Validation curve for Lasso')
plt.xlabel('alpha')
plt.ylabel('rmse')
plt.show()
```


![png](/images/housingpricesregressions/output_25_0.png)



```python
cv_lasso
```




    0.0001    0.128700
    0.0003    0.123794
    0.0005    0.122678
    0.0010    0.124244
    0.0030    0.136213
    0.0050    0.142389
    0.0100    0.153818
    0.0300    0.174189
    0.0500    0.184039
    0.1000    0.209220
    dtype: float64



According to the validation curve, the cross validation score seems to be best  at around `alpha`=0.0005.


```python
title = "Learning curve (Lasso Regression)"
plot_learning_curve(Lasso(alpha=0.0005),title,train,y,cv=5)
plt.show()
```


![png](/images/housingpricesregressions/output_28_0.png)



```python
model = Lasso(alpha=0.0005).fit(train,y)
lasso_preds = np.expm1(model.predict(test))
lasso_preds = pd.DataFrame(lasso_preds,index=test.index)
lasso_preds.columns = ['SalePrice']
lasso_preds.to_csv('lassoregression.csv')
```

Submitting this gives a score of 0.1246, which is a slight improvement upon our Ridge score.

#### Elastic Net
Elastic net regularization combines L1 and L2 regularization. In the `sklearn` implementation, the two parameters to be considered are `alpha`=a+b and `l1_ratio`=a/(a+b), where a and b control L1 and L2 regularization respectively.


```python
# initialize parameters for GridSearch
params = {"alpha":[0.001,0.003,0.005,0.01,0.03,0.05,0.1,0.3,0.5,1,3,5],
          "l1_ratio": [0.001,0.003,0.005,0.01,0.03,0.05,0.1,0.3,0.5,1,3,5],
         }

# gridsearch
gcv = GridSearchCV(ElasticNet(), params,cv=10, n_jobs=-1,verbose=1,
                  scoring="neg_root_mean_squared_error")
gcv.fit(train,y)
```

    Fitting 10 folds for each of 144 candidates, totalling 1440 fits


    [Parallel(n_jobs=-1)]: Using backend LokyBackend with 6 concurrent workers.
    [Parallel(n_jobs=-1)]: Done  38 tasks      | elapsed:    3.9s
    [Parallel(n_jobs=-1)]: Done 256 tasks      | elapsed:    9.0s
    [Parallel(n_jobs=-1)]: Done 1248 tasks      | elapsed:   18.8s
    [Parallel(n_jobs=-1)]: Done 1440 out of 1440 | elapsed:   19.7s finished





    GridSearchCV(cv=10, estimator=ElasticNet(), n_jobs=-1,
                 param_grid={'alpha': [0.001, 0.003, 0.005, 0.01, 0.03, 0.05, 0.1,
                                       0.3, 0.5, 1, 3, 5],
                             'l1_ratio': [0.001, 0.003, 0.005, 0.01, 0.03, 0.05,
                                          0.1, 0.3, 0.5, 1, 3, 5]},
                 scoring='neg_root_mean_squared_error', verbose=1)




```python
gcv.best_params_, -gcv.best_score_
```




    ({'alpha': 0.001, 'l1_ratio': 0.3}, 0.12155441518573948)




```python
title = "Learning curve (ElasticNet Regression)"
plot_learning_curve(ElasticNet(alpha=0.001,l1_ratio=0.3),
                    title,train,y,cv=10)
plt.show()
```


![png](/images/housingpricesregressions/output_33_0.png)



```python
model = ElasticNet(alpha=0.001,l1_ratio=0.3).fit(train,y)
elastic_preds = np.expm1(model.predict(test))
elastic_preds = pd.DataFrame(elastic_preds,index=test.index)
elastic_preds.columns = ['SalePrice']
elastic_preds.to_csv('elasticregression.csv')
```

Submitting this gives a score of 0.1249, which is similiar to the Lasso and Ridge scores.

#### Combination
Linear combination of different predictors could improve the prediction.


```python
stacked_preds = 0.7*lasso_preds + 0.3*ridge_preds
stacked_preds.to_csv('stacked.csv')
```

Submitting this gives the best score of 0.1241, which is a slight improvement.

### Conclusion
Linear models seem to work quite well, with some data processing, and no feature engineering. With some regularization using Ridge, Lasso, and ElasticNet regressions, we obtained an approximate score of 0.125, which are quite nice. We also tried combination, which gave a slight improvement.

At this point, we could try our hand at some feature analysis and engineering, or perhaps other more flexible machine learning algorithms. I will return to these in future posts.
