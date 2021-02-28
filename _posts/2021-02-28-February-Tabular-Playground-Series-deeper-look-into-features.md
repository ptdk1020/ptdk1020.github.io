### Table of contents
1. [Introduction](#intro)
2. [Mutual Information with target](#mi)
3. [Feature analysis with PCA](#pca)
4. [Clusters](#cluter)
5. [Discussion](#disc)

### Introduction <a name='intro'>
In this post, I want to try to improve my previous predictions on the [February Tabular Playground Competition](https://www.kaggle.com/c/tabular-playground-series-feb-2021/overview). Previously, I applied various models on the data, using one-hot encoding on categorical variables. This time, let us dive deeper into feature selection/engineering.


```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
```


```python
df = pd.read_csv('data/train.csv',index_col=0)
test = pd.read_csv('data/test.csv', index_col=0)
```


```python
train = df.copy()
y = train.pop('target')
```


```python
# label encoding on categorical variables
for col in train.select_dtypes('object'):
    train[col], _ = train[col].factorize()
```


```python
#  for mutual info, a boolean mask for discrete features is necessary for us
categorical = (train.dtypes==int)
```

### Mutual information with target <a name='mi'>
[Mutual information](https://en.wikipedia.org/wiki/Mutual_information) is a univariate quantity based on the concept of entropy.


```python
from sklearn.feature_selection import mutual_info_regression
from sklearn.model_selection import cross_val_score
from sklearn.preprocessing import OneHotEncoder
from xgboost import XGBRegressor

# helper function to display mutual information
def frame_mi_scores(X,y,discrete_features):
    mi_scores=mutual_info_regression(X,y,discrete_features=discrete_features)
    mi_scores=pd.Series(mi_scores,name='MI Scores', index=X.columns)
    mi_scores=mi_scores.sort_values(ascending=False)
    return mi_scores

# helper function to plot mutual information scores
def plot_mi_scores(scores):
    y = scores.sort_values(ascending=True)
    width = np.arange(len(y))
    ticks = list(y.index)
    plt.figure(figsize=(14,8))
    plt.barh(width,y)
    plt.yticks(width,ticks)
    plt.title('Mutual Information Scores')

# helper function to one-hot encode categorical variables
def one_hot(X,test):
    discrete = X.dtypes[X.dtypes=='object'].index
    oh = OneHotEncoder(handle_unknown='ignore',sparse=False)

    oh_X = pd.DataFrame(oh.fit_transform(X[discrete]))
    oh_X.index = X.index
    X_num = X.drop(discrete,axis=1)
    X_encoded = pd.concat([oh_X,X_num],axis=1)

    oh_test = pd.DataFrame(oh.transform(test[discrete]))
    oh_test.index = test.index
    test_num = test.drop(discrete,axis=1)
    test_encoded = pd.concat([oh_test,test_num],axis=1)

    return X_encoded, test_encoded


# function to evaluate performance
def score_data(X,y,model=XGBRegressor()):
    X_train, _ = one_hot(X,test)
    score = cross_val_score(model,X_train,y,cv=2,
                            scoring="neg_root_mean_squared_error")
    score = (-1)*score
    return score
```


```python
mi_scores = frame_mi_scores(train,y,categorical)
mi_scores
```




    cont8     0.012832
    cat1      0.012001
    cont0     0.011973
    cat9      0.011252
    cont11    0.007914
    cont5     0.007900
    cont12    0.007277
    cont1     0.007117
    cat2      0.006329
    cont3     0.006201
    cont9     0.005123
    cat5      0.004825
    cat8      0.004778
    cat3      0.004625
    cont13    0.004058
    cont7     0.004028
    cont10    0.002998
    cont6     0.002445
    cat6      0.002382
    cat7      0.001187
    cat0      0.001008
    cont2     0.000986
    cat4      0.000173
    cont4     0.000000
    Name: MI Scores, dtype: float64




```python
plot_mi_scores(mi_scores)
```



![png](/images/febtabular3/output_9_0.png)



As we can see, the relationship between `target` and all feature columns are quite weak. The feature `cont4` seems to have almost no relationship with our `target`, from the point of view of mutual information.

### Feature analysis with PCA <a name='pca'>


```python
# helper function to plot variance
def plot_variance(pca, width=8, dpi=100):
    # Create figure
    fig, axs = plt.subplots(1, 2)
    n = pca.n_components_
    grid = np.arange(1, n + 1)
    # Explained variance
    evr = pca.explained_variance_ratio_
    axs[0].bar(grid, evr)
    axs[0].set(
        xlabel="Component", title="% Explained Variance", ylim=(0.0, 1.0)
    )
    # Cumulative Variance
    cv = np.cumsum(evr)
    axs[1].plot(np.r_[0, grid], np.r_[0, cv], "o-")
    axs[1].set(
        xlabel="Component", title="% Cumulative Variance", ylim=(0.0, 1.0)
    )
    # Set up figure
    fig.set(figwidth=8, dpi=100)
    return axs
```


```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
numerical = train.dtypes[train.dtypes=='float64'].index
X_num = df.copy()[numerical]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_num)
test_scaled = scaler.transform(test[numerical])
```


```python
pca = PCA()
X_pca = pca.fit_transform(X_scaled)
test_pca = pca.transform(test_scaled)
component_names = [f"PC{i+1}" for i in range(X_pca.shape[1])]
X_pca = pd.DataFrame(X_pca,columns=component_names,index=X_num.index)
test_pca = pd.DataFrame(test_pca,columns=component_names,index=test.index)
X_pca
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
      <th>PC1</th>
      <th>PC2</th>
      <th>PC3</th>
      <th>PC4</th>
      <th>PC5</th>
      <th>PC6</th>
      <th>PC7</th>
      <th>PC8</th>
      <th>PC9</th>
      <th>PC10</th>
      <th>PC11</th>
      <th>PC12</th>
      <th>PC13</th>
      <th>PC14</th>
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
      <td>4.007152</td>
      <td>-0.287137</td>
      <td>-0.616210</td>
      <td>-0.040970</td>
      <td>-1.220582</td>
      <td>-2.045058</td>
      <td>0.422936</td>
      <td>-0.945802</td>
      <td>-0.490780</td>
      <td>0.754603</td>
      <td>0.175601</td>
      <td>0.052521</td>
      <td>-0.148215</td>
      <td>-0.174724</td>
    </tr>
    <tr>
      <th>2</th>
      <td>0.370114</td>
      <td>-1.242004</td>
      <td>-1.620660</td>
      <td>-0.599363</td>
      <td>1.996433</td>
      <td>1.025111</td>
      <td>-1.074598</td>
      <td>-0.056463</td>
      <td>0.674771</td>
      <td>1.158846</td>
      <td>-0.813682</td>
      <td>0.559756</td>
      <td>-0.347718</td>
      <td>0.012453</td>
    </tr>
    <tr>
      <th>3</th>
      <td>3.175671</td>
      <td>-1.204480</td>
      <td>-1.093005</td>
      <td>-0.400499</td>
      <td>-2.118989</td>
      <td>0.669334</td>
      <td>0.322556</td>
      <td>-1.842585</td>
      <td>-0.526955</td>
      <td>-0.820925</td>
      <td>-1.255360</td>
      <td>0.098809</td>
      <td>0.017490</td>
      <td>0.324430</td>
    </tr>
    <tr>
      <th>4</th>
      <td>3.078185</td>
      <td>-0.813904</td>
      <td>0.289956</td>
      <td>1.879460</td>
      <td>-1.459988</td>
      <td>-0.063743</td>
      <td>-1.516448</td>
      <td>-0.054198</td>
      <td>-0.296987</td>
      <td>-0.460323</td>
      <td>-0.513670</td>
      <td>0.504566</td>
      <td>-0.244123</td>
      <td>0.532357</td>
    </tr>
    <tr>
      <th>6</th>
      <td>-0.045967</td>
      <td>2.030668</td>
      <td>0.393629</td>
      <td>-0.740670</td>
      <td>0.605095</td>
      <td>0.162002</td>
      <td>-0.376066</td>
      <td>0.889557</td>
      <td>-0.253369</td>
      <td>0.506481</td>
      <td>0.261940</td>
      <td>0.328952</td>
      <td>-0.089354</td>
      <td>-0.154388</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>499993</th>
      <td>-2.803364</td>
      <td>-1.111513</td>
      <td>-1.069301</td>
      <td>1.144713</td>
      <td>-1.387580</td>
      <td>-0.500638</td>
      <td>-0.846170</td>
      <td>0.902091</td>
      <td>0.013936</td>
      <td>0.651545</td>
      <td>-0.851142</td>
      <td>0.186040</td>
      <td>-0.252218</td>
      <td>0.280956</td>
    </tr>
    <tr>
      <th>499996</th>
      <td>-3.379632</td>
      <td>-1.088119</td>
      <td>1.238318</td>
      <td>0.518752</td>
      <td>0.850754</td>
      <td>-0.019607</td>
      <td>1.870482</td>
      <td>0.563601</td>
      <td>0.750439</td>
      <td>-0.013130</td>
      <td>-0.459452</td>
      <td>0.234659</td>
      <td>-0.184260</td>
      <td>-0.045378</td>
    </tr>
    <tr>
      <th>499997</th>
      <td>-2.149592</td>
      <td>0.018433</td>
      <td>0.330000</td>
      <td>-1.321653</td>
      <td>-0.539887</td>
      <td>0.034334</td>
      <td>0.059224</td>
      <td>0.196099</td>
      <td>-0.159667</td>
      <td>-0.259317</td>
      <td>-0.486069</td>
      <td>-0.962121</td>
      <td>-0.243667</td>
      <td>0.801325</td>
    </tr>
    <tr>
      <th>499998</th>
      <td>-2.441988</td>
      <td>0.537749</td>
      <td>0.590642</td>
      <td>1.583769</td>
      <td>-0.153258</td>
      <td>-0.236506</td>
      <td>-0.067395</td>
      <td>-0.825578</td>
      <td>-0.664471</td>
      <td>0.157218</td>
      <td>0.335641</td>
      <td>-1.071453</td>
      <td>-0.182593</td>
      <td>0.082385</td>
    </tr>
    <tr>
      <th>499999</th>
      <td>1.142924</td>
      <td>-0.251867</td>
      <td>0.753739</td>
      <td>1.370226</td>
      <td>1.752959</td>
      <td>0.541513</td>
      <td>1.291353</td>
      <td>-1.020496</td>
      <td>1.667756</td>
      <td>-0.221424</td>
      <td>0.140016</td>
      <td>-0.293284</td>
      <td>-0.409016</td>
      <td>0.210131</td>
    </tr>
  </tbody>
</table>
<p>300000 rows × 14 columns</p>
</div>



The principal components are linear combinations of the original features.


```python
loadings = pd.DataFrame(
    pca.components_.T,  # transpose the matrix of loadings
    columns=component_names,  # so the columns are the principal components
    index=X_num.columns,  # and the rows are the original features
)
loadings
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
      <th>PC1</th>
      <th>PC2</th>
      <th>PC3</th>
      <th>PC4</th>
      <th>PC5</th>
      <th>PC6</th>
      <th>PC7</th>
      <th>PC8</th>
      <th>PC9</th>
      <th>PC10</th>
      <th>PC11</th>
      <th>PC12</th>
      <th>PC13</th>
      <th>PC14</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>cont0</th>
      <td>0.337213</td>
      <td>-0.099996</td>
      <td>0.051681</td>
      <td>0.120544</td>
      <td>0.087794</td>
      <td>-0.021652</td>
      <td>-0.018058</td>
      <td>-0.192973</td>
      <td>-0.652248</td>
      <td>0.223875</td>
      <td>0.236608</td>
      <td>-0.370247</td>
      <td>0.340790</td>
      <td>-0.169096</td>
    </tr>
    <tr>
      <th>cont1</th>
      <td>-0.039944</td>
      <td>0.489351</td>
      <td>0.024623</td>
      <td>0.040668</td>
      <td>-0.818938</td>
      <td>0.009925</td>
      <td>-0.233341</td>
      <td>-0.080896</td>
      <td>-0.146387</td>
      <td>0.056546</td>
      <td>0.005176</td>
      <td>-0.006954</td>
      <td>-0.013436</td>
      <td>-0.006835</td>
    </tr>
    <tr>
      <th>cont2</th>
      <td>-0.173902</td>
      <td>0.415358</td>
      <td>0.027869</td>
      <td>0.105741</td>
      <td>0.204459</td>
      <td>0.502824</td>
      <td>0.369119</td>
      <td>-0.550468</td>
      <td>-0.011199</td>
      <td>-0.219892</td>
      <td>0.035274</td>
      <td>0.004610</td>
      <td>0.039980</td>
      <td>-0.006067</td>
    </tr>
    <tr>
      <th>cont3</th>
      <td>0.164973</td>
      <td>-0.354989</td>
      <td>-0.047118</td>
      <td>-0.138784</td>
      <td>-0.128682</td>
      <td>0.807055</td>
      <td>-0.382353</td>
      <td>0.080179</td>
      <td>0.065507</td>
      <td>0.009567</td>
      <td>0.018077</td>
      <td>-0.003636</td>
      <td>0.003687</td>
      <td>0.005434</td>
    </tr>
    <tr>
      <th>cont4</th>
      <td>-0.119142</td>
      <td>-0.189663</td>
      <td>0.227636</td>
      <td>0.906849</td>
      <td>-0.110121</td>
      <td>0.110507</td>
      <td>0.089267</td>
      <td>0.195335</td>
      <td>0.062250</td>
      <td>0.009807</td>
      <td>-0.010379</td>
      <td>0.026116</td>
      <td>0.013537</td>
      <td>0.015275</td>
    </tr>
    <tr>
      <th>cont5</th>
      <td>0.377451</td>
      <td>-0.037619</td>
      <td>0.071628</td>
      <td>0.054987</td>
      <td>-0.047989</td>
      <td>-0.098441</td>
      <td>-0.029850</td>
      <td>-0.207081</td>
      <td>0.124702</td>
      <td>-0.124707</td>
      <td>0.091677</td>
      <td>-0.008920</td>
      <td>0.144153</td>
      <td>0.855469</td>
    </tr>
    <tr>
      <th>cont6</th>
      <td>0.244949</td>
      <td>0.379750</td>
      <td>-0.111533</td>
      <td>0.046754</td>
      <td>0.172840</td>
      <td>0.106567</td>
      <td>-0.012018</td>
      <td>0.591564</td>
      <td>-0.270374</td>
      <td>-0.535933</td>
      <td>0.155944</td>
      <td>0.034229</td>
      <td>-0.053769</td>
      <td>0.033686</td>
    </tr>
    <tr>
      <th>cont7</th>
      <td>0.218916</td>
      <td>-0.205477</td>
      <td>-0.083925</td>
      <td>-0.180245</td>
      <td>-0.387990</td>
      <td>0.126537</td>
      <td>0.804609</td>
      <td>0.216112</td>
      <td>-0.002335</td>
      <td>0.070132</td>
      <td>-0.023022</td>
      <td>-0.059716</td>
      <td>-0.025436</td>
      <td>0.002866</td>
    </tr>
    <tr>
      <th>cont8</th>
      <td>0.354001</td>
      <td>-0.092248</td>
      <td>0.041680</td>
      <td>0.078819</td>
      <td>0.016255</td>
      <td>-0.033319</td>
      <td>0.007961</td>
      <td>-0.228199</td>
      <td>-0.332226</td>
      <td>0.054644</td>
      <td>-0.119486</td>
      <td>0.713877</td>
      <td>-0.400807</td>
      <td>-0.082507</td>
    </tr>
    <tr>
      <th>cont9</th>
      <td>0.359156</td>
      <td>0.055150</td>
      <td>0.102294</td>
      <td>0.090456</td>
      <td>0.034670</td>
      <td>-0.034321</td>
      <td>-0.055288</td>
      <td>-0.132846</td>
      <td>0.122055</td>
      <td>-0.109872</td>
      <td>-0.382999</td>
      <td>-0.562430</td>
      <td>-0.569500</td>
      <td>-0.109177</td>
    </tr>
    <tr>
      <th>cont10</th>
      <td>0.302148</td>
      <td>0.322608</td>
      <td>-0.030737</td>
      <td>0.079838</td>
      <td>0.140807</td>
      <td>0.064557</td>
      <td>0.016351</td>
      <td>0.092337</td>
      <td>0.391489</td>
      <td>0.516722</td>
      <td>0.547333</td>
      <td>0.032267</td>
      <td>-0.187624</td>
      <td>-0.091880</td>
    </tr>
    <tr>
      <th>cont11</th>
      <td>0.322602</td>
      <td>0.292413</td>
      <td>-0.032220</td>
      <td>0.058335</td>
      <td>0.124631</td>
      <td>0.072505</td>
      <td>-0.003394</td>
      <td>0.132244</td>
      <td>0.166896</td>
      <td>0.252242</td>
      <td>-0.632483</td>
      <td>0.139117</td>
      <td>0.499462</td>
      <td>-0.085793</td>
    </tr>
    <tr>
      <th>cont12</th>
      <td>0.334934</td>
      <td>-0.147089</td>
      <td>0.109496</td>
      <td>0.020466</td>
      <td>-0.172104</td>
      <td>-0.174785</td>
      <td>-0.038762</td>
      <td>-0.226233</td>
      <td>0.385146</td>
      <td>-0.493465</td>
      <td>0.219592</td>
      <td>0.098058</td>
      <td>0.296201</td>
      <td>-0.451116</td>
    </tr>
    <tr>
      <th>cont13</th>
      <td>0.028108</td>
      <td>-0.073562</td>
      <td>-0.943992</td>
      <td>0.262127</td>
      <td>-0.044545</td>
      <td>-0.061068</td>
      <td>-0.038498</td>
      <td>-0.148877</td>
      <td>0.038286</td>
      <td>-0.035416</td>
      <td>-0.016238</td>
      <td>-0.037100</td>
      <td>-0.013870</td>
      <td>-0.007406</td>
    </tr>
  </tbody>
</table>
</div>



The next plot presents the amount of information contained in each of the principal components.


```python
plot_variance(pca);
```



![png](/images/febtabular3/output_17_0.png)




```python
mutual_info_regression(X_pca,y)
```




    array([0.00220991, 0.        , 0.00278606, 0.00032605, 0.00236544,
           0.00149745, 0.        , 0.        , 0.00044469, 0.00128214,
           0.00263009, 0.00225952, 0.00061506, 0.        ])



It seems that the mutual information scores for the principal components are not very significant.

### Clusters <a name='cluster'>
We can also try to extract more information by grouping data points into clusters via `KMeans`.


```python
from sklearn.cluster import KMeans
```


```python
kmeans = KMeans(n_clusters=5,n_init = 10)
train['Cluster'] = kmeans.fit_predict(train)
```

Now, let us look at the mutual information score of the cluster classification and the target.


```python
train.Cluster = train.Cluster.astype('int64')
categorical = (train.dtypes=='int64')

cluster_mi = frame_mi_scores(train,y,categorical)
```


```python
cluster_mi
```




    cont8      0.012832
    cat1       0.011977
    cont0      0.011973
    cat9       0.011264
    cont11     0.007915
    cont5      0.007900
    cont12     0.007276
    cont1      0.007116
    cat2       0.006324
    cont3      0.006202
    cont9      0.005123
    cat5       0.004823
    cat8       0.004785
    cat3       0.004638
    cont13     0.004058
    cont7      0.004028
    Cluster    0.003670
    cont10     0.002998
    cont6      0.002445
    cat6       0.002382
    cat7       0.001198
    cat0       0.001014
    cont2      0.000986
    cat4       0.000173
    cont4      0.000000
    Name: MI Scores, dtype: float64




```python
sns.boxplot(data=pd.concat([train,y],axis=1),x='Cluster',y='target');
```



![png](/images/febtabular3/output_25_0.png)



Unfortunately, it seems that the clustering does not seem to be very indicative to the target, as shown by the mutual information score, as well as the above plot.

### Making predictions


```python
# obtain processed data
X_encoded, test_encoded = one_hot(df.drop('target',axis=1),test)
X_encpca = pd.concat([X_encoded,X_pca],axis=1)
test_encpca = pd.concat([test_encoded,test_pca],axis=1)
```


```python
from sklearn.model_selection import train_test_split
X_train,X_val,y_train,y_val=train_test_split(X_encpca,y,train_size=0.8)
gbm = XGBRegressor(n_estimators=1000,learning_rate=0.1)
gbm.fit(X_train,y_train,early_stopping_rounds=5,
        eval_set=[(X_val,y_val)],verbose=False)
```




    XGBRegressor(base_score=0.5, booster='gbtree', colsample_bylevel=1,
                 colsample_bynode=1, colsample_bytree=1, gamma=0, gpu_id=-1,
                 importance_type='gain', interaction_constraints='',
                 learning_rate=0.1, max_delta_step=0, max_depth=6,
                 min_child_weight=1, missing=nan, monotone_constraints='()',
                 n_estimators=1000, n_jobs=6, num_parallel_tree=1, random_state=0,
                 reg_alpha=0, reg_lambda=1, scale_pos_weight=1, subsample=1,
                 tree_method='exact', validate_parameters=1, verbosity=None)




```python
# making and saving prediction
gbm_preds = pd.DataFrame(gbm.predict(test_encpca),index=test.index,
                        columns=['target'])
gbm_preds.to_csv('predictions/gbmpca.csv')
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
      <td>7.581488</td>
    </tr>
    <tr>
      <th>5</th>
      <td>7.800866</td>
    </tr>
    <tr>
      <th>15</th>
      <td>7.607448</td>
    </tr>
    <tr>
      <th>16</th>
      <td>7.504133</td>
    </tr>
    <tr>
      <th>17</th>
      <td>7.335790</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>499987</th>
      <td>7.466197</td>
    </tr>
    <tr>
      <th>499990</th>
      <td>7.346903</td>
    </tr>
    <tr>
      <th>499991</th>
      <td>7.469084</td>
    </tr>
    <tr>
      <th>499994</th>
      <td>7.529034</td>
    </tr>
    <tr>
      <th>499995</th>
      <td>7.366149</td>
    </tr>
  </tbody>
</table>
<p>200000 rows × 1 columns</p>
</div>



### Discussion <a name='disc'>
After trying to add in PCA features, unfortunately, the submission score did not improve. So, perhaps, after adding the components, there are redundancies in our data, and it is not clear to me how we should select the features. However, the score did improve when I changed the learning rate to 0.1, which suggests there is room to improve in hyperparameters tuning.
