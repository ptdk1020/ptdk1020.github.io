### Introduction
In another post, I scraped board games data from [boardgamegeek.com](https://boardgamegeek.com/) using its API, as well as beautifulsoup4. I also did some data processing to put these data into more usable format. 

This post is an attempt to address my original goal. I want to find similar games based on the games that I like. We'll try to do this with a K nearest neighbours algorithm. 


```python
# import the basic packages
import numpy as np
import pandas as pd
from sklearn.neighbors import NearestNeighbors
from sklearn.preprocessing import StandardScaler
```


```python
# get the data
games = pd.read_csv('bggdata/bgg_games_clean.csv', index_col=0)
games_mechanics = pd.read_csv('bggdata/games_mechanics.csv',index_col=0)
games_categories = pd.read_csv('bggdata/games_categories.csv',index_col=0)
```


```python
# dropping text columns from games
games_drop = games.drop(['Year','title','description'],axis=1)
```

### Nearest Neighbours

Here we have a naive idea of simply bundling all features together. We will use 8 columns from *games*, 182 columns from *games_mechanics*, 83 columns from *games_categories* for a total of 273 columns. 

Moreover, since the numbers in *games* have quite different order of maginitue, we will scale them using `StandardScaler` to centre the mean to 0, with standard deviation 1. 


```python
scaler = StandardScaler()
scaled_games = scaler.fit_transform(games_drop)
# putting index and column names back
scaled_games = pd.DataFrame(scaled_games,columns = games_drop.columns,
                            index = games_drop.index)
scaled_games.head()
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
      <th>avg_rating</th>
      <th>num_voters</th>
      <th>owners</th>
      <th>complexity</th>
      <th>minplayers</th>
      <th>maxplayers</th>
      <th>minplaytime</th>
      <th>maxplaytime</th>
    </tr>
    <tr>
      <th>game_id</th>
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
      <th>174430</th>
      <td>2.560079</td>
      <td>11.536048</td>
      <td>13.102335</td>
      <td>2.199680</td>
      <td>-1.481667</td>
      <td>-0.108935</td>
      <td>-0.010778</td>
      <td>0.053977</td>
    </tr>
    <tr>
      <th>161936</th>
      <td>2.364589</td>
      <td>11.528012</td>
      <td>12.632545</td>
      <td>0.999323</td>
      <td>-0.030304</td>
      <td>-0.108935</td>
      <td>-0.010778</td>
      <td>-0.056730</td>
    </tr>
    <tr>
      <th>224517</th>
      <td>2.413167</td>
      <td>5.023684</td>
      <td>5.203451</td>
      <td>2.275277</td>
      <td>-0.030304</td>
      <td>-0.108935</td>
      <td>-0.010778</td>
      <td>0.053977</td>
    </tr>
    <tr>
      <th>167791</th>
      <td>2.170114</td>
      <td>17.926426</td>
      <td>16.726030</td>
      <td>1.472366</td>
      <td>-1.481667</td>
      <td>-0.043388</td>
      <td>0.120966</td>
      <td>0.053977</td>
    </tr>
    <tr>
      <th>233078</th>
      <td>2.451964</td>
      <td>3.521670</td>
      <td>3.010162</td>
      <td>2.635219</td>
      <td>1.421058</td>
      <td>0.022158</td>
      <td>0.384454</td>
      <td>0.718217</td>
    </tr>
  </tbody>
</table>
</div>




```python
# putting all features together
df_all = pd.concat([scaled_games,games_mechanics,games_categories],axis=1)
```

Now, we are ready to use the nearest neighbours algorithm. Another thing to note is that we are in a high dimensional space. Due to curse of dimensionality, it makes more sense to use *cosine similarity* metric instead of Euclidean distance. 


```python
nbrs_all = NearestNeighbors(n_neighbors=10,metric='cosine',algorithm='brute')
nbrs_all.fit(df_all)
distances, indices = nbrs_all.kneighbors(df_all)
```


```python
# shape of indices
indices.shape
```




    (20115, 10)



Now, each row of *indices* corresponds to a game entry (say, of a game X), and it contains the indices of corresponding nearest neighbours of X. For example, the first row corresponds to the first game in *games*, meaning *Gloomhaven*. It is important to not be confused between position indices in *indices* and the database ids in our tables. 


```python
# indices of games close to index 0
indices[0]
```




    array([  0,  54,  25,  21,   1,  13, 327,  81,   3, 721], dtype=int64)




```python
# neighbours of Gloomhaven
games.iloc[indices[0]]
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
      <th>title</th>
      <th>Year</th>
      <th>description</th>
      <th>avg_rating</th>
      <th>num_voters</th>
      <th>owners</th>
      <th>complexity</th>
      <th>minplayers</th>
      <th>maxplayers</th>
      <th>minplaytime</th>
      <th>maxplaytime</th>
    </tr>
    <tr>
      <th>game_id</th>
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
      <th>174430</th>
      <td>Gloomhaven</td>
      <td>2017</td>
      <td>Gloomhaven  is a game of Euro-inspired tactica...</td>
      <td>8.79770</td>
      <td>41028</td>
      <td>66800</td>
      <td>3.8575</td>
      <td>1</td>
      <td>4</td>
      <td>60</td>
      <td>120</td>
    </tr>
    <tr>
      <th>121921</th>
      <td>Robinson Crusoe: Adventures on the Cursed Island</td>
      <td>2012</td>
      <td>Robinson Crusoe: Adventures on the Cursed Isla...</td>
      <td>7.84268</td>
      <td>33658</td>
      <td>52052</td>
      <td>3.7781</td>
      <td>1</td>
      <td>4</td>
      <td>60</td>
      <td>120</td>
    </tr>
    <tr>
      <th>96848</th>
      <td>Mage Knight Board Game</td>
      <td>2011</td>
      <td>The Mage Knight board game puts you in control...</td>
      <td>8.10245</td>
      <td>27601</td>
      <td>39168</td>
      <td>4.3086</td>
      <td>1</td>
      <td>4</td>
      <td>60</td>
      <td>240</td>
    </tr>
    <tr>
      <th>205637</th>
      <td>Arkham Horror: The Card Game</td>
      <td>2016</td>
      <td>Something evil stirs in Arkham, and only you c...</td>
      <td>8.18056</td>
      <td>27905</td>
      <td>49710</td>
      <td>3.4279</td>
      <td>1</td>
      <td>2</td>
      <td>60</td>
      <td>120</td>
    </tr>
    <tr>
      <th>161936</th>
      <td>Pandemic Legacy: Season 1</td>
      <td>2015</td>
      <td>Pandemic Legacy is a co-operative campaign gam...</td>
      <td>8.61484</td>
      <td>41000</td>
      <td>64455</td>
      <td>2.8397</td>
      <td>2</td>
      <td>4</td>
      <td>60</td>
      <td>60</td>
    </tr>
    <tr>
      <th>169786</th>
      <td>Scythe</td>
      <td>2016</td>
      <td>It is a time of unrest in 1920s Europa. The as...</td>
      <td>8.23946</td>
      <td>56761</td>
      <td>74108</td>
      <td>3.4098</td>
      <td>1</td>
      <td>5</td>
      <td>90</td>
      <td>115</td>
    </tr>
    <tr>
      <th>15987</th>
      <td>Arkham Horror</td>
      <td>2005</td>
      <td>&amp;#10;        The year is 1926, and it is the h...</td>
      <td>7.25816</td>
      <td>36647</td>
      <td>48324</td>
      <td>3.5767</td>
      <td>1</td>
      <td>8</td>
      <td>120</td>
      <td>240</td>
    </tr>
    <tr>
      <th>40834</th>
      <td>Dominion: Intrigue</td>
      <td>2009</td>
      <td>In Dominion: Intrigue (as with Dominion), each...</td>
      <td>7.72203</td>
      <td>29932</td>
      <td>43306</td>
      <td>2.4228</td>
      <td>2</td>
      <td>4</td>
      <td>30</td>
      <td>30</td>
    </tr>
    <tr>
      <th>167791</th>
      <td>Terraforming Mars</td>
      <td>2016</td>
      <td>In the 2400s, mankind begins to terraform the ...</td>
      <td>8.43293</td>
      <td>63292</td>
      <td>84888</td>
      <td>3.2408</td>
      <td>1</td>
      <td>5</td>
      <td>120</td>
      <td>120</td>
    </tr>
    <tr>
      <th>65244</th>
      <td>Forbidden Island</td>
      <td>2010</td>
      <td>Forbidden Island is a visually stunning cooper...</td>
      <td>6.79259</td>
      <td>41580</td>
      <td>71849</td>
      <td>1.7406</td>
      <td>2</td>
      <td>4</td>
      <td>30</td>
      <td>30</td>
    </tr>
  </tbody>
</table>
</div>



Let us try out another very popular game, say, *Ticket to Ride*, with id 9209.


```python
# find the position index of Ticket to ride
df_all.index.get_loc(9209)
```




    170




```python
# neighbours of Ticket to Ride
games.iloc[indices[170]]
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
      <th>title</th>
      <th>Year</th>
      <th>description</th>
      <th>avg_rating</th>
      <th>num_voters</th>
      <th>owners</th>
      <th>complexity</th>
      <th>minplayers</th>
      <th>maxplayers</th>
      <th>minplaytime</th>
      <th>maxplaytime</th>
    </tr>
    <tr>
      <th>game_id</th>
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
      <th>9209</th>
      <td>Ticket to Ride</td>
      <td>2004</td>
      <td>With elegantly simple gameplay, Ticket to Ride...</td>
      <td>7.42598</td>
      <td>70853</td>
      <td>96261</td>
      <td>1.8496</td>
      <td>2</td>
      <td>5</td>
      <td>30</td>
      <td>60</td>
    </tr>
    <tr>
      <th>14996</th>
      <td>Ticket to Ride: Europe</td>
      <td>2005</td>
      <td>Ticket to Ride: Europe takes you on a new trai...</td>
      <td>7.54833</td>
      <td>57709</td>
      <td>81626</td>
      <td>1.9399</td>
      <td>2</td>
      <td>5</td>
      <td>30</td>
      <td>60</td>
    </tr>
    <tr>
      <th>68448</th>
      <td>7 Wonders</td>
      <td>2010</td>
      <td>You are the leader of one of the 7 great citie...</td>
      <td>7.75314</td>
      <td>83484</td>
      <td>111185</td>
      <td>2.3302</td>
      <td>2</td>
      <td>7</td>
      <td>30</td>
      <td>30</td>
    </tr>
    <tr>
      <th>30549</th>
      <td>Pandemic</td>
      <td>2008</td>
      <td>In Pandemic, several virulent diseases have br...</td>
      <td>7.60782</td>
      <td>100934</td>
      <td>153172</td>
      <td>2.4117</td>
      <td>2</td>
      <td>4</td>
      <td>45</td>
      <td>45</td>
    </tr>
    <tr>
      <th>822</th>
      <td>Carcassonne</td>
      <td>2000</td>
      <td>Carcassonne is a tile-placement game in which ...</td>
      <td>7.41866</td>
      <td>100666</td>
      <td>147490</td>
      <td>1.9130</td>
      <td>2</td>
      <td>5</td>
      <td>30</td>
      <td>45</td>
    </tr>
    <tr>
      <th>36218</th>
      <td>Dominion</td>
      <td>2008</td>
      <td>&amp;quot;You are a monarch, like your parents bef...</td>
      <td>7.62049</td>
      <td>77432</td>
      <td>101070</td>
      <td>2.3582</td>
      <td>2</td>
      <td>4</td>
      <td>30</td>
      <td>30</td>
    </tr>
    <tr>
      <th>148228</th>
      <td>Splendor</td>
      <td>2014</td>
      <td>Splendor is a game of chip-collecting and card...</td>
      <td>7.45242</td>
      <td>57826</td>
      <td>81510</td>
      <td>1.7987</td>
      <td>2</td>
      <td>4</td>
      <td>30</td>
      <td>30</td>
    </tr>
    <tr>
      <th>13</th>
      <td>Catan</td>
      <td>1995</td>
      <td>In CATAN (formerly The Settlers of Catan), pla...</td>
      <td>7.15563</td>
      <td>100403</td>
      <td>152507</td>
      <td>2.3226</td>
      <td>3</td>
      <td>4</td>
      <td>60</td>
      <td>120</td>
    </tr>
    <tr>
      <th>230802</th>
      <td>Azul</td>
      <td>2017</td>
      <td>Introduced by the Moors, azulejos (originally ...</td>
      <td>7.83234</td>
      <td>52102</td>
      <td>77182</td>
      <td>1.7696</td>
      <td>2</td>
      <td>4</td>
      <td>30</td>
      <td>45</td>
    </tr>
    <tr>
      <th>70323</th>
      <td>King of Tokyo</td>
      <td>2011</td>
      <td>In King of Tokyo, you play mutant monsters, gi...</td>
      <td>7.18558</td>
      <td>57089</td>
      <td>82000</td>
      <td>1.4939</td>
      <td>2</td>
      <td>6</td>
      <td>30</td>
      <td>30</td>
    </tr>
  </tbody>
</table>
</div>



Let us try yet with another less known game, a personal favourite, *El Grande* id 93.


```python
# position index of El Grande
df_all.index.get_loc(93)
```




    75




```python
# neighbours of Risk
games.iloc[indices[75]]
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
      <th>title</th>
      <th>Year</th>
      <th>description</th>
      <th>avg_rating</th>
      <th>num_voters</th>
      <th>owners</th>
      <th>complexity</th>
      <th>minplayers</th>
      <th>maxplayers</th>
      <th>minplaytime</th>
      <th>maxplaytime</th>
    </tr>
    <tr>
      <th>game_id</th>
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
      <th>93</th>
      <td>El Grande</td>
      <td>1995</td>
      <td>In this award-winning game, players take on th...</td>
      <td>7.75546</td>
      <td>23419</td>
      <td>22471</td>
      <td>3.0531</td>
      <td>2</td>
      <td>5</td>
      <td>60</td>
      <td>120</td>
    </tr>
    <tr>
      <th>170216</th>
      <td>Blood Rage</td>
      <td>2015</td>
      <td>&amp;quot;Life is Battle; Battle is Glory; Glory i...</td>
      <td>7.99685</td>
      <td>33425</td>
      <td>39940</td>
      <td>2.8801</td>
      <td>2</td>
      <td>4</td>
      <td>60</td>
      <td>90</td>
    </tr>
    <tr>
      <th>2651</th>
      <td>Power Grid</td>
      <td>2004</td>
      <td>Power Grid is the updated release of the Fried...</td>
      <td>7.85678</td>
      <td>55881</td>
      <td>65978</td>
      <td>3.2723</td>
      <td>2</td>
      <td>6</td>
      <td>120</td>
      <td>120</td>
    </tr>
    <tr>
      <th>3076</th>
      <td>Puerto Rico</td>
      <td>2002</td>
      <td>In Puerto Rico, players assume the roles of co...</td>
      <td>7.99212</td>
      <td>62738</td>
      <td>73011</td>
      <td>3.2800</td>
      <td>3</td>
      <td>5</td>
      <td>90</td>
      <td>150</td>
    </tr>
    <tr>
      <th>31260</th>
      <td>Agricola</td>
      <td>2007</td>
      <td>Description from BoardgameNews&amp;#10;&amp;#10;In Agr...</td>
      <td>7.94674</td>
      <td>63103</td>
      <td>75261</td>
      <td>3.6397</td>
      <td>1</td>
      <td>5</td>
      <td>30</td>
      <td>150</td>
    </tr>
    <tr>
      <th>12333</th>
      <td>Twilight Struggle</td>
      <td>2005</td>
      <td>&amp;quot;Now the trumpet summons us again, not as...</td>
      <td>8.29353</td>
      <td>40433</td>
      <td>55623</td>
      <td>3.5847</td>
      <td>2</td>
      <td>2</td>
      <td>120</td>
      <td>180</td>
    </tr>
    <tr>
      <th>164928</th>
      <td>Orléans</td>
      <td>2014</td>
      <td>During the medieval goings-on around Orl&amp;eacut...</td>
      <td>8.08263</td>
      <td>21791</td>
      <td>26514</td>
      <td>3.0525</td>
      <td>2</td>
      <td>4</td>
      <td>90</td>
      <td>90</td>
    </tr>
    <tr>
      <th>6249</th>
      <td>Alhambra</td>
      <td>2003</td>
      <td>Granada, 1278.  At the foot of the Sierra Neva...</td>
      <td>7.03029</td>
      <td>28386</td>
      <td>34658</td>
      <td>2.1046</td>
      <td>2</td>
      <td>6</td>
      <td>45</td>
      <td>60</td>
    </tr>
    <tr>
      <th>28143</th>
      <td>Race for the Galaxy</td>
      <td>2007</td>
      <td>2018 UPDATE: The second edition of the game is...</td>
      <td>7.75971</td>
      <td>46051</td>
      <td>55731</td>
      <td>2.9824</td>
      <td>2</td>
      <td>4</td>
      <td>30</td>
      <td>60</td>
    </tr>
    <tr>
      <th>40834</th>
      <td>Dominion: Intrigue</td>
      <td>2009</td>
      <td>In Dominion: Intrigue (as with Dominion), each...</td>
      <td>7.72203</td>
      <td>29932</td>
      <td>43306</td>
      <td>2.4228</td>
      <td>2</td>
      <td>4</td>
      <td>30</td>
      <td>30</td>
    </tr>
  </tbody>
</table>
</div>



### Discussion
As someone who has played a few board games, this is quite interesting. 

Neighbours of *Gloomhaven* are fairly popular games, and many of them are cooperative games, i.e., games where players play together as a team against the game. They are also generally of higher complexity. 

Neighbours of *Ticket to Ride* are also very popular. But they are of fairly low complexities, making them ideal for new board games players.

Neighbours of *El Grande* seem to be more strategic games. People call them *Euro games*, maybe with *Blood Rage* as an exception (interestingly). 

### What now?
An advantage of KNN is that it is easy to implement. However, the disadvantage is that it has no performance metric, even though we saw some glimpse when looking at specific games. It would be nice to have an approach with a sensible measurement of success. 
