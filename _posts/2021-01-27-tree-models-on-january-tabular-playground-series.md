In another post, we have taken a look at data from [Tabular Playground Series - January](https://www.kaggle.com/c/tabular-playground-series-jan-2021), and ran some simple linear regressions on it. In this post, I want to explore other approaches. 


```python
import numpy as np
import pandas as pd
from matplotlib import pyplot as plt
%matplotlib inline

from sklearn.model_selection import GridSearchCV, cross_val_score, \
                                    train_test_split
from sklearn.metrics import mean_squared_error as mse
```


```python
# loading data
df = pd.read_csv('data/train.csv',index_col=0)
y = pd.DataFrame(df['target'])
train = df.drop(['target'],axis=1)

test = pd.read_csv('data/test.csv',index_col=0)

train.head()
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
    </tr>
  </tbody>
</table>
</div>



### Decision Tree
First, we look at a popular method, decision tree. Recall that decision trees are built to optimize some quality criterion at each split, e.g., Gini impurity or misclassification error for classification problems, mean-squared-error or variance for regression problems. 


```python
from sklearn.tree import DecisionTreeRegressor

# hyperparameter tuning, with cross-validation using GridSearchCV
tree = DecisionTreeRegressor(random_state=42,criterion='mse')

tree_params = {'max_depth':range(1,11),
               'max_features':range(4,15)
              }
tree_grid = GridSearchCV(tree,tree_params, cv=5,n_jobs=-1)

tree_grid.fit(train,y)
```




    GridSearchCV(cv=5, estimator=DecisionTreeRegressor(random_state=42), n_jobs=-1,
                 param_grid={'max_depth': range(1, 11),
                             'max_features': range(4, 15)})




```python
# best parameters
tree_grid.best_params_
```




    {'max_depth': 8, 'max_features': 6}




```python
# making prediction with tree using above parameters
tree = DecisionTreeRegressor(random_state=42,max_depth=8,max_features=6)
tree.fit(train,y)
tree_preds = pd.DataFrame(tree.predict(test),index=test.index)
tree_preds.columns=['target']
tree_preds.to_csv('predictions/decisiontree.csv')
tree_preds
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
      <td>8.093925</td>
    </tr>
    <tr>
      <th>2</th>
      <td>7.751377</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7.794199</td>
    </tr>
    <tr>
      <th>7</th>
      <td>8.029836</td>
    </tr>
    <tr>
      <th>10</th>
      <td>8.093925</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>499984</th>
      <td>8.181278</td>
    </tr>
    <tr>
      <th>499985</th>
      <td>8.029836</td>
    </tr>
    <tr>
      <th>499987</th>
      <td>7.986406</td>
    </tr>
    <tr>
      <th>499988</th>
      <td>8.054487</td>
    </tr>
    <tr>
      <th>499990</th>
      <td>7.805804</td>
    </tr>
  </tbody>
</table>
<p>200000 rows × 1 columns</p>
</div>



Submitting this gives a score of 0.72077, which is a decent improvement upon our scores with linear regressions. The next natural step is taking ensemble.

### Random Forest

Random Forest is a type of ensemble method, which aggregates predictions from a collection of trees. In `DecisionTreeRegressor` class, the number of trees is controlled by the parameter `n_estimators`. Through the parameter `bootstrap`, it is possible to turn our estimator into *bagging* (see [Bootstrap aggregating](https://en.wikipedia.org/wiki/Bootstrap_aggregating)). 


```python
from sklearn.ensemble import RandomForestRegressor
```


```python


# hyperparameter tuning, with cross-validation using GridSearchCV
rf = RandomForestRegressor(n_estimators=100,random_state=42)

rf_params = {'max_depth':range(4,11),
             'min_samples_split': range(2,6),
             'max_features':range(4,11)
            }

rf_grid = GridSearchCV(rf,rf_params, cv=5,n_jobs=-1)

rf_grid.fit(train,y)
```


```python
# best parameters
rf_grid.best_params_
```




    {'max_depth': 10, 'max_features': 8, 'min_samples_split': 4}




```python
# making prediction with random forest using above parameters
rf = RandomForestRegressor(n_estimators=10,random_state=42,
                           max_depth=10,max_features=8,min_samples_split=4)
rf.fit(train,y)
rf_preds = pd.DataFrame(rf.predict(test),index=test.index)
rf_preds.columns=['target']
rf_preds.to_csv('predictions/randomforest.csv')
rf_preds
```

    <ipython-input-4-930db716f4c5>:4: DataConversionWarning: A column-vector y was passed when a 1d array was expected. Please change the shape of y to (n_samples,), for example using ravel().
      rf.fit(train,y)
    




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
      <td>8.093230</td>
    </tr>
    <tr>
      <th>2</th>
      <td>7.822159</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7.867669</td>
    </tr>
    <tr>
      <th>7</th>
      <td>8.074233</td>
    </tr>
    <tr>
      <th>10</th>
      <td>8.158477</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>499984</th>
      <td>8.153587</td>
    </tr>
    <tr>
      <th>499985</th>
      <td>8.001601</td>
    </tr>
    <tr>
      <th>499987</th>
      <td>8.048147</td>
    </tr>
    <tr>
      <th>499988</th>
      <td>7.988638</td>
    </tr>
    <tr>
      <th>499990</th>
      <td>7.833595</td>
    </tr>
  </tbody>
</table>
<p>200000 rows × 1 columns</p>
</div>



Submitting this gives a score of 0.71243, which is an improvement upon the decision tree score. In fact, one can get better score with higher `n_estimators`. For example, at `n_estimators`=50, we get a score of 0.71151. So, there is some room for future improvement via tuning. But, for now, let us try to use another approach. 

### Gradient boosting model
For this, we use the [xgboost](https://xgboost.readthedocs.io/en/latest/) implementation. We will also make use of early stopping. For that, we need to split training data into training part and validation part. 


```python
# splitting data using train_test_split
X_train, X_val, y_train, y_val = train_test_split(train,y,train_size=0.9)
```


```python
# fitting model
from xgboost import XGBRegressor
gbm = XGBRegressor(n_estimators=1000,learning_rate=0.01)
gbm.fit(X_train,y_train,early_stopping_rounds=5,
        eval_set=[(X_val,y_val)],verbose=False)
```




    XGBRegressor(base_score=0.5, booster='gbtree', colsample_bylevel=1,
                 colsample_bynode=1, colsample_bytree=1, gamma=0, gpu_id=-1,
                 importance_type='gain', interaction_constraints='',
                 learning_rate=0.01, max_delta_step=0, max_depth=6,
                 min_child_weight=1, missing=nan, monotone_constraints='()',
                 n_estimators=1000, n_jobs=6, num_parallel_tree=1, random_state=0,
                 reg_alpha=0, reg_lambda=1, scale_pos_weight=1, subsample=1,
                 tree_method='exact', validate_parameters=1, verbosity=None)




```python
# making and saving prediction
gbm_preds = pd.DataFrame(gbm.predict(test),index=test.index,
                        columns=['target'])
gbm_preds.to_csv('predictions/gbm.csv')
gbm_preds
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
      <td>7.967897</td>
    </tr>
    <tr>
      <th>2</th>
      <td>7.842190</td>
    </tr>
    <tr>
      <th>6</th>
      <td>7.916304</td>
    </tr>
    <tr>
      <th>7</th>
      <td>8.160949</td>
    </tr>
    <tr>
      <th>10</th>
      <td>8.249640</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>499984</th>
      <td>8.205752</td>
    </tr>
    <tr>
      <th>499985</th>
      <td>8.216376</td>
    </tr>
    <tr>
      <th>499987</th>
      <td>8.080898</td>
    </tr>
    <tr>
      <th>499988</th>
      <td>8.046902</td>
    </tr>
    <tr>
      <th>499990</th>
      <td>7.921037</td>
    </tr>
  </tbody>
</table>
<p>200000 rows × 1 columns</p>
</div>



Submitting this gives a score of 0.70397, which is a nice improvement upon our previous score. It is also not a big surprise since it is one of the most powever algorthim for tabular data. 

### What is next?
Much of the power of XGBoost comes from hyperparameters tuning. So, we can focus more on it. Another thing to try is feature transformation and engineering. There are some good advice [here](https://www.kaggle.com/c/tabular-playground-series-jan-2021/discussion/213090). 
