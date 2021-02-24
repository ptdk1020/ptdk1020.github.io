## Table of contents
1. [Introduction](#intro)
2. [Numerical columns](#numerical)
3. [Categorical columns](#categorical)
4. [Numerical and categorical](#numcat)


### Introduction <a name='intro'>
In this post, let us look at data from the [February Tabular Playground Series](https://www.kaggle.com/c/tabular-playground-series-feb-2021/overview). According the description, our goal is to predict a continuous `target` based on a number of feature columns. The columns `cat0`-`cat9` are categorical, while `cont0`-`cont13` are continuous.


```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
```


```python
train = pd.read_csv('./data/train.csv',index_col = 0)
test = pd.read_csv('./data/test.csv',index_col=0)
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
      <th>cat0</th>
      <th>cat1</th>
      <th>cat2</th>
      <th>cat3</th>
      <th>cat4</th>
      <th>cat5</th>
      <th>cat6</th>
      <th>cat7</th>
      <th>cat8</th>
      <th>cat9</th>
      <th>...</th>
      <th>cont5</th>
      <th>cont6</th>
      <th>cont7</th>
      <th>cont8</th>
      <th>cont9</th>
      <th>cont10</th>
      <th>cont11</th>
      <th>cont12</th>
      <th>cont13</th>
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
      <td>A</td>
      <td>B</td>
      <td>A</td>
      <td>A</td>
      <td>B</td>
      <td>D</td>
      <td>A</td>
      <td>E</td>
      <td>C</td>
      <td>I</td>
      <td>...</td>
      <td>0.881122</td>
      <td>0.421650</td>
      <td>0.741413</td>
      <td>0.895799</td>
      <td>0.802461</td>
      <td>0.724417</td>
      <td>0.701915</td>
      <td>0.877618</td>
      <td>0.719903</td>
      <td>6.994023</td>
    </tr>
    <tr>
      <th>2</th>
      <td>B</td>
      <td>A</td>
      <td>A</td>
      <td>A</td>
      <td>B</td>
      <td>B</td>
      <td>A</td>
      <td>E</td>
      <td>A</td>
      <td>F</td>
      <td>...</td>
      <td>0.440011</td>
      <td>0.346230</td>
      <td>0.278495</td>
      <td>0.593413</td>
      <td>0.546056</td>
      <td>0.613252</td>
      <td>0.741289</td>
      <td>0.326679</td>
      <td>0.808464</td>
      <td>8.071256</td>
    </tr>
    <tr>
      <th>3</th>
      <td>A</td>
      <td>A</td>
      <td>A</td>
      <td>C</td>
      <td>B</td>
      <td>D</td>
      <td>A</td>
      <td>B</td>
      <td>C</td>
      <td>N</td>
      <td>...</td>
      <td>0.914155</td>
      <td>0.369602</td>
      <td>0.832564</td>
      <td>0.865620</td>
      <td>0.825251</td>
      <td>0.264104</td>
      <td>0.695561</td>
      <td>0.869133</td>
      <td>0.828352</td>
      <td>5.760456</td>
    </tr>
    <tr>
      <th>4</th>
      <td>A</td>
      <td>A</td>
      <td>A</td>
      <td>C</td>
      <td>B</td>
      <td>D</td>
      <td>A</td>
      <td>E</td>
      <td>G</td>
      <td>K</td>
      <td>...</td>
      <td>0.934138</td>
      <td>0.578930</td>
      <td>0.407313</td>
      <td>0.868099</td>
      <td>0.794402</td>
      <td>0.494269</td>
      <td>0.698125</td>
      <td>0.809799</td>
      <td>0.614766</td>
      <td>7.806457</td>
    </tr>
    <tr>
      <th>6</th>
      <td>A</td>
      <td>B</td>
      <td>A</td>
      <td>A</td>
      <td>B</td>
      <td>B</td>
      <td>A</td>
      <td>E</td>
      <td>C</td>
      <td>F</td>
      <td>...</td>
      <td>0.382600</td>
      <td>0.705940</td>
      <td>0.325193</td>
      <td>0.440967</td>
      <td>0.462146</td>
      <td>0.724447</td>
      <td>0.683073</td>
      <td>0.343457</td>
      <td>0.297743</td>
      <td>6.868974</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 25 columns</p>
</div>



### Numerical columns <a name='numerical'>
Unlike in contextual datasets, we do not have a good idea as to what these columns might represent. To begin a systematic study of the feature columns, first, we look at the distribution plots of the numerical feature columns, as well as that of the target.


```python
fig, ax = plt.subplots(5,3,figsize=(20,30))
for i in range(10,len(train.columns)):
    sns.histplot(train[train.columns[i]], ax=ax[(i-10)//3,(i-10)%3])
plt.show()
```



![png](/images/febtabular1/output_4_0.png)



*Note: as an aside, interestingly, these plots look very similar to those of the [January version](https://www.kaggle.com/c/tabular-playground-series-jan-2021). So, I would guess that our data is an augment to the previous data. Of course, this is not a hugely important point.*

Let us also look at the corresponding boxplots, as well as the correlation matrix.


```python
fig, ax = plt.subplots(5,3,figsize=(20,30))
for i in range(10,len(train.columns)):
    sns.boxplot(y=train[train.columns[i]], ax=ax[(i-10)//3,(i-10)%3])
plt.show()
```



![png](/images/febtabular1/output_6_0.png)




```python
plt.figure(figsize=(12,12))
sns.heatmap(train.corr(),vmax=.8,square=True,annot=True)
plt.show()
```



![png](/images/febtabular1/output_7_0.png)



Let us also look at the scatter plots between pairs of these columns.


```python
sns.pairplot(train.iloc[:,10:])
plt.show()
```



![png](/images/febtabular1/output_9_0.png)



Unfortunately, the scatter plots does not show any obvious relationships between the variables. For now, let us move onto the categorical variables.

### Categorical features <a name='categorical'>


```python
# get unique values of the categorical columns
alphabet=[]
for i in range(10):
    print('cat'+str(i),sorted(train.iloc[:,i].unique()))
    alphabet.append(sorted(train.iloc[:,i].unique()))
```

    cat0 ['A', 'B']
    cat1 ['A', 'B']
    cat2 ['A', 'B']
    cat3 ['A', 'B', 'C', 'D']
    cat4 ['A', 'B', 'C', 'D']
    cat5 ['A', 'B', 'C', 'D']
    cat6 ['A', 'B', 'C', 'D', 'E', 'G', 'H', 'I']
    cat7 ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'I']
    cat8 ['A', 'B', 'C', 'D', 'E', 'F', 'G']
    cat9 ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']



```python
# count plots
fig, ax = plt.subplots(2,5, figsize=(20,10))

for i in range(10):
    sns.countplot(x=train.columns[i],order=alphabet[i], data=train, ax = ax[i//5,i%5])

plt.show()
```



![png](/images/febtabular1/output_12_0.png)



As we can see, most of these are quite skewed. Let us try to see how pairs of these variables relate to each other.


```python
fig, ax = plt.subplots(9,5, figsize=(30,50))

counter = 0

for i in range(10):
    for j in range(i+1,10):
        sns.countplot(x=train.columns[i],order=alphabet[i],hue=train.columns[j],hue_order=alphabet[j],
                      data=train,ax=ax[counter//5,counter%5])
        counter += 1

plt.show()
```



![png](/images/febtabular1/output_14_0.png)



### Numerical and Categorical <a name='numcat'>

One can also plot numerical and categorical columns simultaneously. Since there are quite a few combinations, we will focus only on a few columns.


```python
fig, ax = plt.subplots(4,3,figsize=(20,20))
counter = 0

for i in range(12):
    if counter > 9:
        ax[counter//3,counter%3].set_axis_off()
    else:
        sns.scatterplot(data=train, x='cont0',y='cont1',hue='cat'+str(i),hue_order=alphabet[i],ax=ax[counter//3,counter%3])
    counter += 1

plt.show()
```

    d:\projects\funwithkaggle\venv\lib\site-packages\IPython\core\pylabtools.py:132: UserWarning: Creating legend with loc="best" can be slow with large amounts of data.
      fig.canvas.print_figure(bytes_io, **kw)




![png](/images/febtabular1/output_16_1.png)




```python
fig, ax = plt.subplots(4,3,figsize=(20,20))
counter = 0

for i in range(12):
    if counter > 9:
        ax[counter//3,counter%3].set_axis_off()
    else:
        sns.scatterplot(data=train, x='cont2',y='cont3',hue='cat'+str(i),hue_order=alphabet[i],ax=ax[counter//3,counter%3])
    counter += 1

plt.show()
```

    d:\projects\funwithkaggle\venv\lib\site-packages\IPython\core\pylabtools.py:132: UserWarning: Creating legend with loc="best" can be slow with large amounts of data.
      fig.canvas.print_figure(bytes_io, **kw)




![png](/images/febtabular1/output_17_1.png)




```python
fig, ax = plt.subplots(4,3,figsize=(20,20))
counter = 0

for i in range(12):
    if counter > 9:
        ax[counter//3,counter%3].set_axis_off()
    else:
        sns.scatterplot(data=train, x='cont4',y='cont5',hue='cat'+str(i),hue_order=alphabet[i],ax=ax[counter//3,counter%3])
    counter += 1

plt.show()
```

    d:\projects\funwithkaggle\venv\lib\site-packages\IPython\core\pylabtools.py:132: UserWarning: Creating legend with loc="best" can be slow with large amounts of data.
      fig.canvas.print_figure(bytes_io, **kw)




![png](/images/febtabular1/output_18_1.png)




```python
fig, ax = plt.subplots(4,3,figsize=(20,20))
counter = 0

for i in range(12):
    if counter > 9:
        ax[counter//3,counter%3].set_axis_off()
    else:
        sns.scatterplot(data=train, x='cont6',y='cont7',hue='cat'+str(i),hue_order=alphabet[i],ax=ax[counter//3,counter%3])
    counter += 1

plt.show()
```

    d:\projects\funwithkaggle\venv\lib\site-packages\IPython\core\pylabtools.py:132: UserWarning: Creating legend with loc="best" can be slow with large amounts of data.
      fig.canvas.print_figure(bytes_io, **kw)




![png](/images/febtabular1/output_19_1.png)




```python
fig, ax = plt.subplots(4,3,figsize=(20,20))
counter = 0

for i in range(12):
    if counter > 9:
        ax[counter//3,counter%3].set_axis_off()
    else:
        sns.scatterplot(data=train, x='cont8',y='cont9',hue='cat'+str(i),hue_order=alphabet[i],ax=ax[counter//3,counter%3])
    counter += 1

plt.show()
```

    d:\projects\funwithkaggle\venv\lib\site-packages\IPython\core\pylabtools.py:132: UserWarning: Creating legend with loc="best" can be slow with large amounts of data.
      fig.canvas.print_figure(bytes_io, **kw)




![png](/images/febtabular1/output_20_1.png)




```python
fig, ax = plt.subplots(4,3,figsize=(20,20))
counter = 0

for i in range(12):
    if counter > 9:
        ax[counter//3,counter%3].set_axis_off()
    else:
        sns.scatterplot(data=train, x='cont10',y='cont11',hue='cat'+str(i),hue_order=alphabet[i],ax=ax[counter//3,counter%3])
    counter += 1

plt.show()
```

    d:\projects\funwithkaggle\venv\lib\site-packages\IPython\core\pylabtools.py:132: UserWarning: Creating legend with loc="best" can be slow with large amounts of data.
      fig.canvas.print_figure(bytes_io, **kw)




![png](/images/febtabular1/output_21_1.png)




```python
fig, ax = plt.subplots(4,3,figsize=(20,20))
counter = 0

for i in range(12):
    if counter > 9:
        ax[counter//3,counter%3].set_axis_off()
    else:
        sns.scatterplot(data=train, x='cont12',y='cont13',hue='cat'+str(i),hue_order=alphabet[i],ax=ax[counter//3,counter%3])
    counter += 1

plt.show()
```

    d:\projects\funwithkaggle\venv\lib\site-packages\IPython\core\pylabtools.py:132: UserWarning: Creating legend with loc="best" can be slow with large amounts of data.
      fig.canvas.print_figure(bytes_io, **kw)




![png](/images/febtabular1/output_22_1.png)



Most of the plots look relatively uniform with a few exceptions. There are noticeable clusters involving `cat5`, `cat8` (and possibly `cat4`). Let us also look at the relationship between the categorical features and the target.


```python
fig, ax = plt.subplots(3,4,figsize=(20,15))
counter = 0

for i in range(12):
    if counter > 9:
        ax[counter//4,counter%4].set_axis_off()
    else:
        sns.boxplot(data=train, x='cat' + str(i),y='target',order=alphabet[i], ax=ax[counter//4,counter%4])
    counter += 1

plt.show()
```



![png](/images/febtabular1/output_24_0.png)



From the above plots, there are no obvious dependencies between the categorical columns and `target`.

### What's next?
In the next post, we will perform some benchmark predictions, and maybe a little bit of features selection.
