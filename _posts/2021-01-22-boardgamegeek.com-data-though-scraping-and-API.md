## Table of contents
1. [Introduction](#intro)
2. [Obtain games id with beautifulsoup4](#bs4)
3. [Additional information through API calls](#bggapi)
4. [Some data processing](#processing)

----
<a href="https://boardgamegeek.com/" target="_blank">
<img src="data:image/jpeg;base64,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" alt="Board Game Geek Logo" >
</a>

### Introduction <a name="intro">

I enjoy playing board games. Sometimes, I wish to find similar games to the ones I like. But since they come in a variety of genres and categories, it can be hard to find similar games. So, let us obtain data and use the power of algorithms.

In this post, my goal is to (responsibly) collect data from [BGG](https://boardgamegeek.com/), and process them into a clean format. Using [beautifulsoup4](https://pypi.org/project/beautifulsoup4/) and [BGG API](https://boardgamegeek.com/wiki/page/BGG_XML_API2), we will collect a list of board games, together with the following features:
   - Game ID
   - Year Published
   - Designer
   - Geek Rating/Average Rating
   - Number of Voters
   - Mechanisms
   - Categories
   - Complexity

I stumbled upon this very nice [post](http://sdsawtelle.github.io/blog/output/boardgamegeek-data-scraping.html) doing this task. I have incorporated many of the author's great ideas here.

### Obtain games id with beautifulsoup4

Through the API, one can obtain all information that we want. However, in order to send queries, one would need to know the games id in the database. We will obtain these information by scraping through `https://boardgamegeek.com/browse/boardgame/page/<page number>` by incrementing `page number`. There are a lot of games, so we will only collect games that have a board game rank. At the time of writing, this means that we will go through about 200 pages.


```python
# import libraris for scraping, parsing, and storing
import requests
from bs4 import BeautifulSoup
import pandas as pd
from time import sleep
import lxml
```

To responsibly collect data, let us introduce a wrapper function that includes an internal timer, so that we don't ping the server too quickly.


```python
def request(msg, slp=2):
    status_code = 500 # initialization, we want a status code 200
    while status_code != 200:
        sleep(slp)
        try:
            r = requests.get(msg)
            status_code = r.status_code
            if status_code != 200:
                print('Server error, code %i. Retrying...' % status_code)
        except:
            print('An exception has occured. Retrying...')
    return r
```


```python
# scraping function, returning a dataframe containing rank and id
def scrape():
    main = pd.DataFrame(columns=['rank', 'game_id'])
    rank_val = True #initialize rank validation
    page_num = 1 #initialize page number
    basic_url = 'https://boardgamegeek.com/browse/boardgame/page/'
    while rank_val==True:
        # Get HTML from request
        r = request(basic_url + str(page_num))
        soup = BeautifulSoup(r.text)
        # For the current page, define a Pandas dataframe with the same columns as main
        rows = soup.find_all("tr", attrs={"id":"row_"})
        table = pd.DataFrame(columns=['rank', 'game_id'], index=range(len(rows)))
        for i in range(len(rows)):
            try: #get rank if applicable
                rank = int(rows[i].select("td.collection_rank a")[0].get('name'))
            except:
                rank_val = False
                break # stop looping through rows since rank_val is already False
            gameid = int(rows[i].select("td.collection_thumbnail a")[0].get("href").split("/")[2])

            table.iloc[i,:] = [rank, gameid]
        table = table.dropna() # only take the nonnull  rows

        # Concatenate the current page's dataframe into the main table
        print('page {} scraped' .format(page_num))
        main = pd.concat([main,table], axis = 0)
        page_num += 1
        sleep(1)
    main.reset_index(inplace=True,drop=True)
    return main

```


```python
# scraping data, coffee recommended
index = scrape()
```



*Note: for some reason, there are games occupying multiple ranks, leading to duplicate game ids in our table. If I have to guess, it might be database updating delays, but I'm not so sure. In any case, we need to take only the unique ones*.


```python
index_unique = pd.DataFrame(index.game_id.unique())
index_unique.columns=['game_id']
index_unique
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
      <th>game_id</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>174430</td>
    </tr>
    <tr>
      <th>1</th>
      <td>161936</td>
    </tr>
    <tr>
      <th>2</th>
      <td>224517</td>
    </tr>
    <tr>
      <th>3</th>
      <td>167791</td>
    </tr>
    <tr>
      <th>4</th>
      <td>233078</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>20110</th>
      <td>16398</td>
    </tr>
    <tr>
      <th>20111</th>
      <td>7316</td>
    </tr>
    <tr>
      <th>20112</th>
      <td>5048</td>
    </tr>
    <tr>
      <th>20113</th>
      <td>5432</td>
    </tr>
    <tr>
      <th>20114</th>
      <td>11901</td>
    </tr>
  </tbody>
</table>
<p>20115 rows × 1 columns</p>
</div>




```python
# output to csv
index_unique.to_csv("bggdata/bgg_index.csv", index=False, encoding="utf-8")
```

*Note: We could have also obtained the titles, certain ratings and number of voters. However, let us obtain these information through API calls instead.*

One can definitely take nice break here.

### Additional information through API calls



```python
# resuming our work, let's create a fresh index table here
df = pd.read_csv('bggdata/bgg_index.csv')
```

#### What we want and example API call
We will use [BGG XML API 2](https://boardgamegeek.com/wiki/page/BGG_XML_API2).
For example, to obtain information on the rank 1 game *Gloomhaven*, we make a request using the following URL:
https://www.boardgamegeek.com/xmlapi2/thing?id=174430&stats=1

This gives us an XML file that we can parse. We might want the following information:

* Title
* Description
* Number of players
* Game categories
* Game families
* Average rating
* Number of ratings
* Various ranks: overall, thematic, strategy, etc.
* Number of owners
* Complexity weight

#### API calls
It is possible to obtain information from multiple games at once. We limit the number to 1000 games per call. Since things like mechanics and categories have their own ids, we also make sure to record them.


```python
def api_calls():
    cols = ['game_id','title','Year', 'description', 'players_range','playtime', 'categories',
            'mechanics','families', 'avg_rating','num_voters', 'owners',
            'ranks', 'complexity']
    main = pd.DataFrame(columns= cols)
    URL = 'https://www.boardgamegeek.com/xmlapi2/thing?stats=1&id='
    # Create dictionaries for these for later use
    category_dict={}
    mechanism_dict={}
    family_dict={}
    rank_dict={}
    for k in range(len(df)//1000 + 1):
        # slicing index table to get the parts we want
        if 1000*(k+1) < len(df.index):
            table = df.loc[1000*k:1000*(k+1)-1]
        else:
            table = df.loc[1000*k:]
        # Concatenate game IDs into string
        extension = ','.join(table.game_id.astype(str))

        # API calls for current list of games
        r = request(URL + extension)
        soup = BeautifulSoup(r.text, "xml")

        # Info gathering
        # Table slice containing slice info
        table = pd.DataFrame(columns=cols, index = range(1000))

        # Getting a list of item tags, one per game
        item_list = soup.find_all('item', type='boardgame')

        # Looping over item_list, acquire info into table
        for i in range(len(item_list)):
            game_id = item_list[i].get('id')
            title = item_list[i].find('name',type='primary').get('value')
            year = int(item_list[i].find('yearpublished').get('value'))
            description = item_list[i].find('description').getText()
            players_range = [int(item_list[i].find('minplayers').get('value')),
                              int(item_list[i].find('maxplayers').get('value'))]
            playtime=[int(item_list[i].find('minplaytime').get('value')),
                              int(item_list[i].find('maxplaytime').get('value'))]


            categories = []
            for entry in item_list[i].find_all('link', type='boardgamecategory'):
                categories.append(int(entry.get('id')))
                if entry.get('id') not in category_dict:
                    category_dict[entry.get('id')] = entry.get('value')



            mechanics = []
            for entry in item_list[i].find_all('link', type='boardgamemechanic'):
                mechanics.append(int(entry.get('id')))
                if entry.get('id') not in mechanism_dict:
                    mechanism_dict[entry.get('id')] = entry.get('value')

            families = []
            for entry in item_list[i].find_all('link', type='boardgamefamily'):
                families.append(int(entry.get('id')))
                if entry.get('id') not in family_dict:
                    family_dict[entry.get('id')] = entry.get('value')

            avg_rating = item_list[i].find('average').get('value')
            num_voters = item_list[i].find('usersrated').get('value')
            owners = item_list[i].find('owned').get('value')
            complexity = item_list[i].find('averageweight').get('value')

            ranks = []
            for entry in item_list[i].find_all('rank'):
                ranks.append((int(entry.get('id')),int(entry.get('value'))))
                if entry.get('id') not in rank_dict:
                    rank_dict[entry.get('id')] = entry.get('name')


            table.loc[i,:] = [game_id,title,year,description,players_range,
                              playtime,
                               categories,mechanics,families,avg_rating,
                               num_voters,owners,ranks,complexity]
        table.dropna(inplace=True)
        main = pd.concat([main,table], axis=0)
        main.reset_index(inplace=True,drop=True)
        print('{}-th round succeeded' .format(k+1))
        sleep(5)
    category_frame = pd.Series(category_dict)
    mechanism_frame = pd.Series(mechanism_dict)
    family_frame = pd.Series(family_dict)
    rank_frame = pd.Series(rank_dict)
    return main,category_frame, mechanism_frame, family_frame,rank_frame
```


```python
all_data = api_calls()
```

  

*Note: when running the calls, there are some warning about deprecation of ndarray and nested lists, but let's not worry about them...*

We also have the list of categories, mechanics, families and ranks in the form of dictionaries. Let us also convert them to dataframes in alphabetical order.


```python
categories = pd.DataFrame(all_data[1], columns =['category']).sort_values('category')
mechanics = pd.DataFrame(all_data[2], columns =['mechanic']).sort_values('mechanic')
families = pd.DataFrame(all_data[3], columns =['family']).sort_values('family')
ranks = pd.DataFrame(all_data[4], columns =['rank']).sort_values('rank')
```

Let us take a look at these tables.


```python
# the "main" games table
all_data[0].info()
```

    <class 'pandas.core.frame.DataFrame'>
    RangeIndex: 20115 entries, 0 to 20114
    Data columns (total 14 columns):
     #   Column         Non-Null Count  Dtype
    ---  ------         --------------  -----
     0   game_id        20115 non-null  object
     1   title          20115 non-null  object
     2   Year           20115 non-null  object
     3   description    20115 non-null  object
     4   players_range  20115 non-null  object
     5   playtime       20115 non-null  object
     6   categories     20115 non-null  object
     7   mechanics      20115 non-null  object
     8   families       20115 non-null  object
     9   avg_rating     20115 non-null  object
     10  num_voters     20115 non-null  object
     11  owners         20115 non-null  object
     12  ranks          20115 non-null  object
     13  complexity     20115 non-null  object
    dtypes: object(14)
    memory usage: 2.1+ MB



```python
# categories
categories
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
      <th>category</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>1009</th>
      <td>Abstract Strategy</td>
    </tr>
    <tr>
      <th>1032</th>
      <td>Action / Dexterity</td>
    </tr>
    <tr>
      <th>1022</th>
      <td>Adventure</td>
    </tr>
    <tr>
      <th>2726</th>
      <td>Age of Reason</td>
    </tr>
    <tr>
      <th>1048</th>
      <td>American Civil War</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>1019</th>
      <td>Wargame</td>
    </tr>
    <tr>
      <th>1025</th>
      <td>Word Game</td>
    </tr>
    <tr>
      <th>1065</th>
      <td>World War I</td>
    </tr>
    <tr>
      <th>1049</th>
      <td>World War II</td>
    </tr>
    <tr>
      <th>2481</th>
      <td>Zombies</td>
    </tr>
  </tbody>
</table>
<p>83 rows × 1 columns</p>
</div>




```python
# mechanics
mechanics
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
      <th>mechanic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2073</th>
      <td>Acting</td>
    </tr>
    <tr>
      <th>2838</th>
      <td>Action Drafting</td>
    </tr>
    <tr>
      <th>2001</th>
      <td>Action Points</td>
    </tr>
    <tr>
      <th>2689</th>
      <td>Action Queue</td>
    </tr>
    <tr>
      <th>2839</th>
      <td>Action Retrieval</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>2017</th>
      <td>Voting</td>
    </tr>
    <tr>
      <th>2082</th>
      <td>Worker Placement</td>
    </tr>
    <tr>
      <th>2935</th>
      <td>Worker Placement with Dice Workers</td>
    </tr>
    <tr>
      <th>2933</th>
      <td>Worker Placement, Different Worker Types</td>
    </tr>
    <tr>
      <th>2974</th>
      <td>Zone of Control</td>
    </tr>
  </tbody>
</table>
<p>182 rows × 1 columns</p>
</div>




```python
# families
families
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
      <th>family</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>22783</th>
      <td>Admin: Better Description Needed!</td>
    </tr>
    <tr>
      <th>22185</th>
      <td>Admin: Cancelled Games</td>
    </tr>
    <tr>
      <th>49247</th>
      <td>Admin: Game System Entries</td>
    </tr>
    <tr>
      <th>4347</th>
      <td>Admin: Miscellaneous Placeholder</td>
    </tr>
    <tr>
      <th>49282</th>
      <td>Admin: Outside the Scope of BGG</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
    </tr>
    <tr>
      <th>21731</th>
      <td>Webcomics: Dork Tower</td>
    </tr>
    <tr>
      <th>19529</th>
      <td>Webcomics: Penny Arcade</td>
    </tr>
    <tr>
      <th>62862</th>
      <td>Word Games: First Letter Given</td>
    </tr>
    <tr>
      <th>62861</th>
      <td>Word Games: Guess the Word</td>
    </tr>
    <tr>
      <th>62039</th>
      <td>Word Games: Spelling / Letters</td>
    </tr>
  </tbody>
</table>
<p>3200 rows × 1 columns</p>
</div>




```python
# ranks
ranks
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
      <th>rank</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>4666</th>
      <td>abstracts</td>
    </tr>
    <tr>
      <th>4415</th>
      <td>amiga</td>
    </tr>
    <tr>
      <th>4781</th>
      <td>arcade</td>
    </tr>
    <tr>
      <th>4976</th>
      <td>atarist</td>
    </tr>
    <tr>
      <th>1</th>
      <td>boardgame</td>
    </tr>
    <tr>
      <th>62</th>
      <td>boardgameaccessory</td>
    </tr>
    <tr>
      <th>4667</th>
      <td>cgs</td>
    </tr>
    <tr>
      <th>4665</th>
      <td>childrensgames</td>
    </tr>
    <tr>
      <th>4420</th>
      <td>commodore64</td>
    </tr>
    <tr>
      <th>5499</th>
      <td>familygames</td>
    </tr>
    <tr>
      <th>5498</th>
      <td>partygames</td>
    </tr>
    <tr>
      <th>16</th>
      <td>rpgitem</td>
    </tr>
    <tr>
      <th>5497</th>
      <td>strategygames</td>
    </tr>
    <tr>
      <th>5496</th>
      <td>thematic</td>
    </tr>
    <tr>
      <th>32</th>
      <td>videogame</td>
    </tr>
    <tr>
      <th>4664</th>
      <td>wargames</td>
    </tr>
  </tbody>
</table>
</div>




```python
# output to csv
all_data[0].to_csv("bggdata/bgg_games.csv", index=False, encoding="utf-8")
categories.to_csv("bggdata/bgg_categories.csv", index=True, encoding="utf-8")
mechanics.to_csv("bggdata/bgg_mechanics.csv", index=True, encoding="utf-8")
families.to_csv("bggdata/bgg_families.csv", index=True, encoding="utf-8")
ranks.to_csv("bggdata/bgg_ranks.csv", index=True, encoding="utf-8")
```

### Some data processing
Note that the columns in our games table are currently not in a desirable format. Some columns like `mechanics`, `ranks`, `families` contain lists of information, which are all strings. So, let us deal with these issues by extracting the information into other tables.


```python
# let us get a clean dataframe
games = pd.read_csv('bggdata/bgg_games.csv', index_col=0)
```


```python
# it turns out that description was missing from one game
games.fillna('missing description',inplace=True)
```


```python
# clearing the brackets "[" and "]"
for game_id in games.index:
    games.at[game_id,'playtime'] = games.at[game_id,'playtime'].replace("[","").replace("]","")
    games.at[game_id,'players_range'] = games.at[game_id,'players_range'].replace("[","").replace("]","")
    games.at[game_id,'categories'] = games.at[game_id,'categories'].replace("[","").replace("]","")
    games.at[game_id,'mechanics'] = games.at[game_id,'mechanics'].replace("[","").replace("]","")
    games.at[game_id,'families'] = games.at[game_id,'families'].replace("[","").replace("]","")
    games.at[game_id,'ranks'] = games.at[game_id,'ranks'].replace("[","").replace("]","")
```


```python
games.head(2)
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
      <th>players_range</th>
      <th>playtime</th>
      <th>categories</th>
      <th>mechanics</th>
      <th>families</th>
      <th>avg_rating</th>
      <th>num_voters</th>
      <th>owners</th>
      <th>ranks</th>
      <th>complexity</th>
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
      <td>1, 4</td>
      <td>60, 120</td>
      <td>1022, 1020, 1010, 1046, 1047</td>
      <td>2689, 2839, 2018, 2857, 2893, 2023, 3004, 2664...</td>
      <td>59218, 25158, 65191, 8374, 45610, 24281, 25404...</td>
      <td>8.79770</td>
      <td>41028</td>
      <td>66800</td>
      <td>(1, 1), (5496, 1), (5497, 1)</td>
      <td>3.8575</td>
    </tr>
    <tr>
      <th>161936</th>
      <td>Pandemic Legacy: Season 1</td>
      <td>2015</td>
      <td>Pandemic Legacy is a co-operative campaign gam...</td>
      <td>2, 4</td>
      <td>60, 60</td>
      <td>1084, 2145</td>
      <td>2001, 2023, 2040, 2824, 2078, 2004, 2008, 2015</td>
      <td>64952, 3430, 24281, 25404, 61854, 62881, 62899</td>
      <td>8.61484</td>
      <td>41000</td>
      <td>64455</td>
      <td>(1, 2), (5496, 2), (5497, 2)</td>
      <td>2.8397</td>
    </tr>
  </tbody>
</table>
</div>




```python
# Create columns for min_players, max_players, min_playtime, max_playtime
for game_id in games.index:
    # players range
    temp1 = games.players_range.loc[game_id].split(',')
    games.loc[game_id,'minplayers'] = int(temp1[0])
    games.loc[game_id,'maxplayers'] = int(temp1[1])
    # playtime
    temp2 = games.playtime.loc[game_id].split(',')
    games.loc[game_id,'minplaytime'] = int(temp2[0])
    games.loc[game_id,'maxplaytime'] = int(temp2[1])
```


```python
# for some reason, these new columns are of type float. So, let's change it
games['minplayers'] = games['minplayers'].astype('int64')
games['maxplayers'] = games['maxplayers'].astype('int64')
games['minplaytime'] = games['minplaytime'].astype('int64')
games['maxplaytime'] = games['maxplaytime'].astype('int64')

# drop the redundant columns
games.drop(['players_range','playtime'],axis=1,inplace=True)
```


```python
games.head(2)
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
      <th>categories</th>
      <th>mechanics</th>
      <th>families</th>
      <th>avg_rating</th>
      <th>num_voters</th>
      <th>owners</th>
      <th>ranks</th>
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
      <td>1022, 1020, 1010, 1046, 1047</td>
      <td>2689, 2839, 2018, 2857, 2893, 2023, 3004, 2664...</td>
      <td>59218, 25158, 65191, 8374, 45610, 24281, 25404...</td>
      <td>8.79770</td>
      <td>41028</td>
      <td>66800</td>
      <td>(1, 1), (5496, 1), (5497, 1)</td>
      <td>3.8575</td>
      <td>1</td>
      <td>4</td>
      <td>60</td>
      <td>120</td>
    </tr>
    <tr>
      <th>161936</th>
      <td>Pandemic Legacy: Season 1</td>
      <td>2015</td>
      <td>Pandemic Legacy is a co-operative campaign gam...</td>
      <td>1084, 2145</td>
      <td>2001, 2023, 2040, 2824, 2078, 2004, 2008, 2015</td>
      <td>64952, 3430, 24281, 25404, 61854, 62881, 62899</td>
      <td>8.61484</td>
      <td>41000</td>
      <td>64455</td>
      <td>(1, 2), (5496, 2), (5497, 2)</td>
      <td>2.8397</td>
      <td>2</td>
      <td>4</td>
      <td>60</td>
      <td>60</td>
    </tr>
  </tbody>
</table>
</div>



#### Create the games_mechanics table


```python
mechanics=pd.read_csv('bggdata/bgg_mechanics.csv', index_col=0)
games_mechanics=pd.DataFrame(columns=mechanics.index, index=games.index)

for game_id in games_mechanics.index:
    try:
        temp = games.mechanics.loc[game_id].split(',')
        for tag in temp: # Note that tag is still a string here
            try:
                if int(tag) in games_mechanics.columns:
                    games_mechanics.loc[game_id,int(tag)]=1
            except:
                pass
    except:
        pass
games_mechanics.fillna(0,inplace=True)
games_mechanics.head()
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
      <th>2073</th>
      <th>2838</th>
      <th>2001</th>
      <th>2689</th>
      <th>2839</th>
      <th>2834</th>
      <th>2840</th>
      <th>2847</th>
      <th>2916</th>
      <th>2080</th>
      <th>...</th>
      <th>2826</th>
      <th>2079</th>
      <th>2015</th>
      <th>2897</th>
      <th>2874</th>
      <th>2017</th>
      <th>2082</th>
      <th>2935</th>
      <th>2933</th>
      <th>2974</th>
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
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>161936</th>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>224517</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>167791</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>233078</th>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>...</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 182 columns</p>
</div>



#### Create the games_categories table


```python
categories = pd.read_csv('bggdata/bgg_categories.csv', index_col=0)
games_categories = pd.DataFrame(columns=categories.index,index=games.index)

for game_id in games_categories.index:
    try:
        temp = games.categories.loc[game_id].split(',')
        for tag in temp: # Note that tag is still a string here
            if int(tag) in games_categories.columns:
                    games_categories.loc[game_id,int(tag)]=1
    except:
        pass
games_categories.fillna(0,inplace=True)
games_categories.head()
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
      <th>1009</th>
      <th>1032</th>
      <th>1022</th>
      <th>2726</th>
      <th>1048</th>
      <th>1108</th>
      <th>1075</th>
      <th>1055</th>
      <th>1050</th>
      <th>1089</th>
      <th>...</th>
      <th>1011</th>
      <th>1097</th>
      <th>1027</th>
      <th>1101</th>
      <th>1109</th>
      <th>1019</th>
      <th>1025</th>
      <th>1065</th>
      <th>1049</th>
      <th>2481</th>
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
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>161936</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>224517</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>167791</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>233078</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 83 columns</p>
</div>



#### Create the games_families table


```python
families = pd.read_csv('bggdata/bgg_families.csv', index_col=0)
games_families = pd.DataFrame(columns=families.index,index=games.index)

for game_id in games_families.index:
    try:
        temp = games.families.loc[game_id].split(',')
        for tag in temp: # Note that tag is still a string here
            if int(tag) in games_families.columns:
                    games_families.loc[game_id,int(tag)]=1
    except:
        pass
games_families.fillna(0,inplace=True)
games_families.head()
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
      <th>22783</th>
      <th>22185</th>
      <th>49247</th>
      <th>4347</th>
      <th>49282</th>
      <th>22184</th>
      <th>27524</th>
      <th>67857</th>
      <th>52373</th>
      <th>67873</th>
      <th>...</th>
      <th>11340</th>
      <th>5634</th>
      <th>19279</th>
      <th>19291</th>
      <th>9700</th>
      <th>21731</th>
      <th>19529</th>
      <th>62862</th>
      <th>62861</th>
      <th>62039</th>
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
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>161936</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>224517</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>167791</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>233078</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>...</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
<p>5 rows × 3200 columns</p>
</div>



### Create the ranks table


```python
ranks = pd.read_csv('bggdata/bgg_ranks.csv', index_col=0)
games_ranks = pd.DataFrame(columns=ranks.index,index=games.index)

for game_id in games_ranks.index:
    try:
        temp=games.ranks.loc[game_id].split('),')
        R = []
        for entry in temp:
            R.append(entry.replace('(','').replace(')','').split(','))
        for tag in R:
            games_ranks.loc[game_id, int(tag[0])]=int(tag[1])
    except:
        pass

games_ranks.fillna(0,inplace=True)
games_ranks.head()
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
      <th>4666</th>
      <th>4415</th>
      <th>4781</th>
      <th>4976</th>
      <th>1</th>
      <th>62</th>
      <th>4667</th>
      <th>4665</th>
      <th>4420</th>
      <th>5499</th>
      <th>5498</th>
      <th>16</th>
      <th>5497</th>
      <th>5496</th>
      <th>32</th>
      <th>4664</th>
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
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>1</td>
      <td>1</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>161936</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>2</td>
      <td>2</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>224517</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>167791</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>4</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
    </tr>
    <tr>
      <th>233078</th>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>5</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>0</td>
      <td>4</td>
      <td>3</td>
      <td>0</td>
      <td>0</td>
    </tr>
  </tbody>
</table>
</div>



From the look of it, these newly created table are quite sparse. I'm curious, let's compute them.


```python
games_categories.sum().sum()/games_categories.size
```




    0.03148821984432884




```python
games_mechanics.sum().sum()/games_mechanics.size
```




    0.01528382132408978




```python
games_families.sum().sum()/games_families.size
```




    0.0005822147651006711



We will save these as csv, but it makes more sense to save them in sparse format using [scipy.sparse.save_npz](https://docs.scipy.org/doc/scipy/reference/generated/scipy.sparse.save_npz.html#scipy.sparse.save_npz).


```python
games_mechanics.to_csv("bggdata/games_mechanics.csv",index=True,encoding="utf-8")
games_categories.to_csv("bggdata/games_categories.csv",index=True,encoding="utf-8")
games_families.to_csv("bggdata/games_families.csv",index=True,encoding="utf-8")
games_ranks.to_csv("bggdata/games_ranks.csv",index=True,encoding="utf-8")
```


```python
games.drop(['ranks','categories','mechanics','families'],axis=1,inplace=True)
```


```python
games.to_csv("bggdata/bgg_games_clean.csv",index=True,encoding="utf-8")
```

### Other ideas. Next?
It is not our focus, but we can definitely import these files into a small SQL database. My original goal is to find similar games, it would be natural to run a KNN on these games.

There are also some additional information that I did not record with the api calls, such as `suggested player count`, or `designer`. It would be fun to look at these as well.
