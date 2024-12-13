 Food Item Calorie Calculator

Authors: Michael Fields, Mirko Gijsen, Maria Soto Losada
License File: 

Our project involves designing a webpage to display the caloric values of various food items organized by their food categories. Initially, our idea was to create a complete nutritional profile for food items across five categories: fruits, vegetables, meats, dairy, and seeds/grains. However, we encountered limitations with the publicly available data on Wikidata, which prompted us to narrow our focus specifically to the caloric values of these food items.

To make the tool more interactive and useful, we decided to include a calorie counter that allows users to sum up the calories of different foods. This feature enables users to build a profile for a meal or an entire day's worth of food intake. With this goal in mind, we dove into the project.

After experimenting with Wikidata and attempting to construct a query, we realized that the caloric value data for many food items was missing or incomplete. To overcome this challenge, we manually added caloric data for 20 food items within each category (so 100 entries in total). This data was sourced from a reliable calorie-tracking website (https://calories-info.com/) to show values per 100 grams of each food item. Additionally, we included the subclass information for each food item in wikidata (e.g., fruit, vegetable, etc.), which helped us categorize and organize the data effectively for querying.

Simultaneously, we worked on the design and functionality of the webpage, incorporating CSS styling and other tools to enhance its appearance and usability. To visualize the data, we initially planned to use a pie chart. However, based on feedback from our class, we opted for a bar plot created with D3.js. This change allowed for a clearer and more intuitive comparison of caloric values across food items and categories.

The final product is a webpage that successfully displays the caloric values of food items per 100 grams. Users can interact with the calorie counter to calculate totals and make informed decisions about balanced meal planning. The tool enables users to browse through different food categories, offering a practical and engaging way to consider caloric intake as part of a balanced diet.

The files available in this repository are as follows. First we have a final product folder with 3 files: the main page, the css of the main page, and the javascript code. Running the main page should result in the main page showing up in your browser (it automatically connects the 3 files). If that for some reason wouldn’t work there is a backup folder with 1 file called main page running that should give you the same result as running it in the final product folder (just that everything here is in 1 big file). 
