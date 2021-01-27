Let us look at the data from Kaggle [Tabular Playground Series - January](https://www.kaggle.com/c/tabular-playground-series-jan-2021). First, we load the data.


```python
import pandas as pd
import numpy as np
from matplotlib import pyplot as plt
import seaborn as sns
```


```python
df = pd.read_csv("data/train.csv",index_col=0)
df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>cont1</th>
      <th>cont2</th>
      <th>cont3</th>
      <th>cont4</th>
      <th>cont5</th>
      <th>cont6</th>
      <th>cont7</th>
      <th>cont8</th>
      <th>cont9</th>
      <th>cont10</th>
      <th>cont11</th>
      <th>cont12</th>
      <th>cont13</th>
      <th>cont14</th>
      <th>target</th>
    </tr>
    <tr>
      <th>id</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1</th>
      <td>0.670390</td>
      <td>0.811300</td>
      <td>0.643968</td>
      <td>0.291791</td>
      <td>0.284117</td>
      <td>0.855953</td>
      <td>0.890700</td>
      <td>0.285542</td>
      <td>0.558245</td>
      <td>0.779418</td>
      <td>0.921832</td>
      <td>0.866772</td>
      <td>0.878733</td>
      <td>0.305411</td>
      <td>7.243043</td>
    </tr>
    <tr>
      <th>3</th>
      <td>0.388053</td>
      <td>0.621104</td>
      <td>0.686102</td>
      <td>0.501149</td>
      <td>0.643790</td>
      <td>0.449805</td>
      <td>0.510824</td>
      <td>0.580748</td>
      <td>0.418335</td>
      <td>0.432632</td>
      <td>0.439872</td>
      <td>0.434971</td>
      <td>0.369957</td>
      <td>0.369484</td>
      <td>8.203331</td>
    </tr>
    <tr>
      <th>4</th>
      <td>0.834950</td>
      <td>0.227436</td>
      <td>0.301584</td>
      <td>0.293408</td>
      <td>0.606839</td>
      <td>0.829175</td>
      <td>0.506143</td>
      <td>0.558771</td>
      <td>0.587603</td>
      <td>0.823312</td>
      <td>0.567007</td>
      <td>0.677708</td>
      <td>0.882938</td>
      <td>0.303047</td>
      <td>7.776091</td>
    </tr>
    <tr>
      <th>5</th>
      <td>0.820708</td>
      <td>0.160155</td>
      <td>0.546887</td>
      <td>0.726104</td>
      <td>0.282444</td>
      <td>0.785108</td>
      <td>0.752758</td>
      <td>0.823267</td>
      <td>0.574466</td>
      <td>0.580843</td>
      <td>0.769594</td>
      <td>0.818143</td>
      <td>0.914281</td>
      <td>0.279528</td>
      <td>6.957716</td>
    </tr>
    <tr>
      <th>8</th>
      <td>0.935278</td>
      <td>0.421235</td>
      <td>0.303801</td>
      <td>0.880214</td>
      <td>0.665610</td>
      <td>0.830131</td>
      <td>0.487113</td>
      <td>0.604157</td>
      <td>0.874658</td>
      <td>0.863427</td>
      <td>0.983575</td>
      <td>0.900464</td>
      <td>0.935918</td>
      <td>0.435772</td>
      <td>7.951046</td>
    </tr>
  </tbody>
</table>
</div>




```python
test = pd.read_csv("data/test.csv",index_col=0)
test.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>cont1</th>
      <th>cont2</th>
      <th>cont3</th>
      <th>cont4</th>
      <th>cont5</th>
      <th>cont6</th>
      <th>cont7</th>
      <th>cont8</th>
      <th>cont9</th>
      <th>cont10</th>
      <th>cont11</th>
      <th>cont12</th>
      <th>cont13</th>
      <th>cont14</th>
    </tr>
    <tr>
      <th>id</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>0.353600</td>
      <td>0.738780</td>
      <td>0.600939</td>
      <td>0.293377</td>
      <td>0.285691</td>
      <td>0.458006</td>
      <td>0.620704</td>
      <td>0.422249</td>
      <td>0.369203</td>
      <td>0.435727</td>
      <td>0.550540</td>
      <td>0.699134</td>
      <td>0.286864</td>
      <td>0.364515</td>
    </tr>
    <tr>
      <th>2</th>
      <td>0.907222</td>
      <td>0.189756</td>
      <td>0.215531</td>
      <td>0.869915</td>
      <td>0.301333</td>
      <td>0.528958</td>
      <td>0.390351</td>
      <td>0.521112</td>
      <td>0.794779</td>
      <td>0.798580</td>
      <td>0.446475</td>
      <td>0.449037</td>
      <td>0.916964</td>
      <td>0.513002</td>
    </tr>
    <tr>
      <th>6</th>
      <td>0.179287</td>
      <td>0.355353</td>
      <td>0.623972</td>
      <td>0.437812</td>
      <td>0.282476</td>
      <td>0.320826</td>
      <td>0.386789</td>
      <td>0.776422</td>
      <td>0.222268</td>
      <td>0.229102</td>
      <td>0.211913</td>
      <td>0.222651</td>
      <td>0.327164</td>
      <td>0.827941</td>
    </tr>
    <tr>
      <th>7</th>
      <td>0.359385</td>
      <td>0.181049</td>
      <td>0.551368</td>
      <td>0.206386</td>
      <td>0.280763</td>
      <td>0.482076</td>
      <td>0.506677</td>
      <td>0.362793</td>
      <td>0.379737</td>
      <td>0.345686</td>
      <td>0.445276</td>
      <td>0.518485</td>
      <td>0.299028</td>
      <td>0.598166</td>
    </tr>
    <tr>
      <th>10</th>
      <td>0.335791</td>
      <td>0.682607</td>
      <td>0.676481</td>
      <td>0.219465</td>
      <td>0.282861</td>
      <td>0.581721</td>
      <td>0.748639</td>
      <td>0.350158</td>
      <td>0.448915</td>
      <td>0.506878</td>
      <td>0.817721</td>
      <td>0.805895</td>
      <td>0.790591</td>
      <td>0.249275</td>
    </tr>
  </tbody>
</table>
</div>



### Visualization
Since there are only 14 feature columns and a target column, let us take a look at all of their distribution plots, as well as their boxplots.


```python
fig, ax = plt.subplots(5,3,figsize=(20,30))
for i in range(len(df.columns)):
    sns.histplot(df[df.columns[i]],ax=ax[i//3,i%3])
plt.show()
```


    
![png](/images/tabularpost1/output_5_0.png)
    



```python
fig, ax = plt.subplots(5,3,figsize=(20,30))
for i in range(len(df.columns)):
    sns.boxplot(y=df[df.columns[i]],ax=ax[i//3,i%3])
plt.show()
```


    
![png](/images/tabularpost1/output_6_0.png)
    


To investigate dependencies between the columns, let us also look at the correlation matrix.


```python
plt.figure(figsize=(12,12))
sns.heatmap(df.corr(),vmax=.8,square=True,annot=True)
plt.show()
```


    
![png](/images/tabularpost1/output_8_0.png)
    


There are a few dependencies between the features. For example, the positive correlations of `cont6` to `cont13` are quite noticeable. Interestingly, `target` is not really dependent on any single column. 

### Bench mark: linear regression


```python
from sklearn.linear_model import LinearRegression, Ridge, RidgeCV, \
                                    Lasso, LassoCV, ElasticNet
from sklearn.model_selection import cross_val_score, learning_curve, \
                                    validation_curve
from sklearn.utils import shuffle
```

Let us also include a simplified implementation of the [plot learning curve](https://scikit-learn.org/stable/auto_examples/model_selection/plot_learning_curve.html#sphx-glr-auto-examples-model-selection-plot-learning-curve-py) function. 


```python
def plot_learning_curve(estimator, title, X, y, axes=None, ylim=None, cv=None,
                        n_jobs=None, train_sizes=np.linspace(.1, 1.0, 5)):
    plt.figure(figsize=(10, 6))
    if axes is None:
        axes = plt.axes()

    plt.title(title)
    
    if ylim is not None:
        axes.set_ylim(*ylim)
    axes.set_xlabel("Training examples")
    axes.set_ylabel("Error")

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
    axes.grid()
    axes.fill_between(train_sizes, train_scores_mean - train_scores_std,
                         train_scores_mean + train_scores_std, alpha=0.1,
                         color="r")
    axes.fill_between(train_sizes, test_scores_mean - test_scores_std,
                         test_scores_mean + test_scores_std, alpha=0.1,
                         color="g")
    axes.plot(train_sizes, train_scores_mean, 'o-', color="r",
                 label="Training score")
    axes.plot(train_sizes, test_scores_mean, 'o-', color="g",
                 label="Cross-validation score")
    axes.legend(loc="best")

    return plt
```


```python
# separating features and target
y = pd.DataFrame(df.target)
train = df.drop(['target'],axis=1)
```


```python
# Cross-validation scores for linear regression
-cross_val_score(LinearRegression(),train,y,cv=10,
                 scoring='neg_root_mean_squared_error')
```




    array([0.72959369, 0.72894404, 0.72910387, 0.72512859, 0.72370349,
           0.72916593, 0.72179602, 0.72650582, 0.72281263, 0.72558807])




```python
# Learning curve for linear regression
title = "Learning curve (Linear Regression)"
plot_learning_curve(LinearRegression(),title,shuffle(train,random_state=10),
                    y,cv=10)
plt.show()
```


    
![png](output_15_0.png)
    


Now this is a little strange, as our training error is worse than the validation error. Of course, this is possible, but I'm not sure why this is the case here. 


```python
linreg_preds = LinearRegression().fit(train,y).predict(test)
linreg_preds = pd.DataFrame(linreg_preds,index=test.index)
linreg_preds.columns = ['target']
linreg_preds.to_csv('predictions/linreg.csv')
```

Submitting this gives a score of 0.7278, which we shall remember as our benchmark. 

### Adding some spice with regularization


```python
# Ridge
alphas = [0.001, 0.003,0.005,0.01, 0.03, 0.05, 
          0.1, 0.3, 0.5, 1, 3, 5, 10, 30, 50, 100]
ridge = RidgeCV(alphas=alphas,scoring="neg_root_mean_squared_error",cv=10)
ridge.fit(train,y)
ridge.alpha_,ridge.best_score_
```




    (10.0, -0.7262341595492992)




```python
# ridge prediction
ridge_preds = Ridge(alpha=10).fit(train,y).predict(test)
ridge_preds = pd.DataFrame(ridge_preds,index=test.index)
ridge_preds.columns = ['target']
ridge_preds.to_csv('predictions/ridge.csv')
```


```python
ridge_preds
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>target</th>
    </tr>
    <tr>
      <th>id</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>8.053523</td>
    </tr>
    <tr>
      <th>2</th>
      <td>7.597975</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7.950714</td>
    </tr>
    <tr>
      <th>7</th>
      <td>7.941894</td>
    </tr>
    <tr>
      <th>10</th>
      <td>8.060783</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>499984</th>
      <td>7.939215</td>
    </tr>
    <tr>
      <th>499985</th>
      <td>7.975067</td>
    </tr>
    <tr>
      <th>499987</th>
      <td>7.856080</td>
    </tr>
    <tr>
      <th>499988</th>
      <td>7.937270</td>
    </tr>
    <tr>
      <th>499990</th>
      <td>7.955528</td>
    </tr>
  </tbody>
</table>
<p>200000 rows × 1 columns</p>
</div>




```python
# Lasso
alphas = [0.001, 0.003,0.005,0.01, 0.03, 0.05, 
          0.1, 0.3, 0.5, 1, 3, 5, 10, 30, 50, 100]
lasso = LassoCV(alphas=alphas,cv=10)
lasso.fit(train,y)
lasso.alpha_,ridge.best_score_
```

    d:\projects\funwithkaggle\venv\lib\site-packages\sklearn\utils\validation.py:63: DataConversionWarning: A column-vector y was passed when a 1d array was expected. Please change the shape of y to (n_samples, ), for example using ravel().
      return f(*args, **kwargs)
    




    (0.001, -0.7262341595492992)




```python
# lasso prediction
lasso_preds = Lasso(alpha=0.001).fit(train,y).predict(test)
lasso_preds = pd.DataFrame(lasso_preds,index=test.index)
lasso_preds.columns = ['target']
lasso_preds.to_csv('predictions/lasso.csv')
```


```python
lasso_preds
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>target</th>
    </tr>
    <tr>
      <th>id</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>8.026996</td>
    </tr>
    <tr>
      <th>2</th>
      <td>7.674180</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7.931432</td>
    </tr>
    <tr>
      <th>7</th>
      <td>7.920829</td>
    </tr>
    <tr>
      <th>10</th>
      <td>8.056073</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>499984</th>
      <td>7.922326</td>
    </tr>
    <tr>
      <th>499985</th>
      <td>7.930921</td>
    </tr>
    <tr>
      <th>499987</th>
      <td>7.882189</td>
    </tr>
    <tr>
      <th>499988</th>
      <td>7.919121</td>
    </tr>
    <tr>
      <th>499990</th>
      <td>7.933590</td>
    </tr>
  </tbody>
</table>
<p>200000 rows × 1 columns</p>
</div>




```python
# combined ridge lasso
ridgelasso = 0.7*ridge_preds + 0.3*lasso_preds
ridgelasso.to_csv('predictions/ridgelasso.csv')
```


```python
ridgelasso
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>target</th>
    </tr>
    <tr>
      <th>id</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>8.045565</td>
    </tr>
    <tr>
      <th>2</th>
      <td>7.620836</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7.944929</td>
    </tr>
    <tr>
      <th>7</th>
      <td>7.935575</td>
    </tr>
    <tr>
      <th>10</th>
      <td>8.059370</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>499984</th>
      <td>7.934148</td>
    </tr>
    <tr>
      <th>499985</th>
      <td>7.961823</td>
    </tr>
    <tr>
      <th>499987</th>
      <td>7.863913</td>
    </tr>
    <tr>
      <th>499988</th>
      <td>7.931825</td>
    </tr>
    <tr>
      <th>499990</th>
      <td>7.948946</td>
    </tr>
  </tbody>
</table>
<p>200000 rows × 1 columns</p>
</div>



From what we have seen, adding regularization doesn't seem to work quite well. This is somewhat evident from the learning curve of linear regression, as we don't really have an overfitting problem on the training set. 
