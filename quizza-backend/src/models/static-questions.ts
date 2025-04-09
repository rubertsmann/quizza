import { Category, Question } from "./backendmodels";

export const questions: Question[] = [
    // HUMAN
    {
        id: 1,
        category: Category.HUMAN,
        question: "What is the average human body temperature?",
        answers: [
            { answerId: 1, answerText: "36.5°C" },
            { answerId: 2, answerText: "37°C" },
            { answerId: 3, answerText: "37.5°C" },
            { answerId: 4, answerText: "38°C" },
            { answerId: 5, answerText: "36°C" }
        ],
        correctAnswerId: 2
    },
    {
        id: 2,
        category: Category.HUMAN,
        question: "How many bones are in an adult human body?",
        answers: [
            { answerId: 1, answerText: "206" },
            { answerId: 2, answerText: "205" },
            { answerId: 3, answerText: "214" },
            { answerId: 4, answerText: "207" },
            { answerId: 5, answerText: "210" }
        ],
        correctAnswerId: 1
    },
    {
        id: 3,
        category: Category.HUMAN,
        question: "What is the largest organ in the human body?",
        answers: [
            { answerId: 1, answerText: "Heart" },
            { answerId: 2, answerText: "Skin" },
            { answerId: 3, answerText: "Liver" },
            { answerId: 4, answerText: "Lung" },
            { answerId: 5, answerText: "Kidney" }
        ],
        correctAnswerId: 2
    },
    {
        id: 4,
        category: Category.HUMAN,
        question: "What is the main function of red blood cells?",
        answers: [
            { answerId: 1, answerText: "Fight infection" },
            { answerId: 2, answerText: "Transport oxygen" },
            { answerId: 3, answerText: "Clot blood" },
            { answerId: 4, answerText: "Regulate temperature" },
            { answerId: 5, answerText: "Transport carbon dioxide" }
        ],
        correctAnswerId: 2
    },
    {
        id: 5,
        category: Category.HUMAN,
        question: "Which part of the brain regulates balance?",
        answers: [
            { answerId: 1, answerText: "Cerebrum" },
            { answerId: 2, answerText: "Cerebellum" },
            { answerId: 3, answerText: "Medulla" },
            { answerId: 4, answerText: "Thalamus" },
            { answerId: 5, answerText: "Hypothalamus" }
        ],
        correctAnswerId: 2
    },
    {
        id: 6,
        category: Category.HUMAN,
        question: "What is the average lifespan of a red blood cell?",
        answers: [
            { answerId: 1, answerText: "120 days" },
            { answerId: 2, answerText: "90 days" },
            { answerId: 3, answerText: "60 days" },
            { answerId: 4, answerText: "30 days" },
            { answerId: 5, answerText: "150 days" }
        ],
        correctAnswerId: 1
    },
    {
        id: 7,
        category: Category.HUMAN,
        question: "What waste product do humans exhale?",
        answers: [
            { answerId: 1, answerText: "Oxygen" },
            { answerId: 2, answerText: "Carbon Dioxide" },
            { answerId: 3, answerText: "Nitrogen" },
            { answerId: 4, answerText: "Hydrogen" },
            { answerId: 5, answerText: "Methane" }
        ],
        correctAnswerId: 2
    },
    {
        id: 8,
        category: Category.HUMAN,
        question: "How many chambers does the human heart have?",
        answers: [
            { answerId: 1, answerText: "2" },
            { answerId: 2, answerText: "3" },
            { answerId: 3, answerText: "4" },
            { answerId: 4, answerText: "5" },
            { answerId: 5, answerText: "6" }
        ],
        correctAnswerId: 3
    },
    {
        id: 9,
        category: Category.HUMAN,
        question: "What is the primary function of the liver?",
        answers: [
            { answerId: 1, answerText: "Filter blood" },
            { answerId: 2, answerText: "Produce insulin" },
            { answerId: 3, answerText: "Regulate heartbeat" },
            { answerId: 4, answerText: "Produce bile" },
            { answerId: 5, answerText: "Store vitamins" }
        ],
        correctAnswerId: 1
    },
    {
        id: 10,
        category: Category.HUMAN,
        question: "Which vitamin is obtained primarily from sunlight?",
        answers: [
            { answerId: 1, answerText: "Vitamin A" },
            { answerId: 2, answerText: "Vitamin D" },
            { answerId: 3, answerText: "Vitamin B12" },
            { answerId: 4, answerText: "Vitamin C" },
            { answerId: 5, answerText: "Vitamin E" }
        ],
        correctAnswerId: 2
    },

    // SPORT
    {
        id: 11,
        category: Category.SPORT,
        question: "How many players are on a soccer team?",
        answers: [
            { answerId: 1, answerText: "9" },
            { answerId: 2, answerText: "10" },
            { answerId: 3, answerText: "11" },
            { answerId: 4, answerText: "12" },
            { answerId: 5, answerText: "13" }
        ],
        correctAnswerId: 3
    },
    {
        id: 12,
        category: Category.SPORT,
        question: "Which sport is known as the 'king of sports'?",
        answers: [
            { answerId: 1, answerText: "Cricket" },
            { answerId: 2, answerText: "Soccer" },
            { answerId: 3, answerText: "Basketball" },
            { answerId: 4, answerText: "Tennis" },
            { answerId: 5, answerText: "Baseball" }
        ],
        correctAnswerId: 2
    },
    {
        id: 13,
        category: Category.SPORT,
        question: "In which year did the first modern Olympic Games take place?",
        answers: [
            { answerId: 1, answerText: "1896" },
            { answerId: 2, answerText: "1900" },
            { answerId: 3, answerText: "1904" },
            { answerId: 4, answerText: "1912" },
            { answerId: 5, answerText: "1920" }
        ],
        correctAnswerId: 1
    },
    {
        id: 14,
        category: Category.SPORT,
        question: "Which country won the FIFA World Cup in 2014?",
        answers: [
            { answerId: 1, answerText: "Brazil" },
            { answerId: 2, answerText: "Germany" },
            { answerId: 3, answerText: "Argentina" },
            { answerId: 4, answerText: "Italy" },
            { answerId: 5, answerText: "France" }
        ],
        correctAnswerId: 2
    },
    {
        id: 15,
        category: Category.SPORT,
        question: "How many points is a touchdown worth in American football?",
        answers: [
            { answerId: 1, answerText: "6" },
            { answerId: 2, answerText: "7" },
            { answerId: 3, answerText: "3" },
            { answerId: 4, answerText: "8" },
            { answerId: 5, answerText: "10" }
        ],
        correctAnswerId: 1
    },
    {
        id: 16,
        category: Category.SPORT,
        question: "Which sport uses a shuttlecock?",
        answers: [
            { answerId: 1, answerText: "Tennis" },
            { answerId: 2, answerText: "Badminton" },
            { answerId: 3, answerText: "Volleyball" },
            { answerId: 4, answerText: "Basketball" },
            { answerId: 5, answerText: "Football" }
        ],
        correctAnswerId: 2
    },
    {
        id: 17,
        category: Category.SPORT,
        question: "What is the highest score possible in a single game of ten-pin bowling?",
        answers: [
            { answerId: 1, answerText: "200" },
            { answerId: 2, answerText: "250" },
            { answerId: 3, answerText: "300" },
            { answerId: 4, answerText: "400" },
            { answerId: 5, answerText: "350" }
        ],
        correctAnswerId: 3
    },
    {
        id: 18,
        category: Category.SPORT,
        question: "Who is known as the fastest man in the world?",
        answers: [
            { answerId: 1, answerText: "Usain Bolt" },
            { answerId: 2, answerText: "Carl Lewis" },
            { answerId: 3, answerText: "Jesse Owens" },
            { answerId: 4, answerText: "Mo Farah" },
            { answerId: 5, answerText: "Michael Johnson" }
        ],
        correctAnswerId: 1
    },
    {
        id: 19,
        category: Category.SPORT,
        question: "Which sport is played on a diamond-shaped field?",
        answers: [
            { answerId: 1, answerText: "Soccer" },
            { answerId: 2, answerText: "Baseball" },
            { answerId: 3, answerText: "Hockey" },
            { answerId: 4, answerText: "Cricket" },
            { answerId: 5, answerText: "Football" }
        ],
        correctAnswerId: 2
    },
    {
        id: 20,
        category: Category.SPORT,
        question: "Which game is played on a circular table?",
        answers: [
            { answerId: 1, answerText: "Hockey" },
            { answerId: 2, answerText: "Table Tennis" },
            { answerId: 3, answerText: "Foosball" },
            { answerId: 4, answerText: "Curling" },
            { answerId: 5, answerText: "Snooker" }
        ],
        correctAnswerId: 5
    },

    // GROCERIES
    {
        id: 21,
        category: Category.GROCERIES,
        question: "Which vegetable is known as a courgette in British English?",
        answers: [
            { answerId: 1, answerText: "Zucchini" },
            { answerId: 2, answerText: "Eggplant" },
            { answerId: 3, answerText: "Bell Pepper" },
            { answerId: 4, answerText: "Squash" },
            { answerId: 5, answerText: "Carrot" }
        ],
        correctAnswerId: 1
    },
    {
        id: 22,
        category: Category.GROCERIES,
        question: "Which fruit is typically sliced to make a sandwich?",
        answers: [
            { answerId: 1, answerText: "Apple" },
            { answerId: 2, answerText: "Banana" },
            { answerId: 3, answerText: "Orange" },
            { answerId: 4, answerText: "Peach" },
            { answerId: 5, answerText: "Tomato" }
        ],
        correctAnswerId: 5
    },
    {
        id: 23,
        category: Category.GROCERIES,
        question: "Which grain is used to make bread?",
        answers: [
            { answerId: 1, answerText: "Rice" },
            { answerId: 2, answerText: "Wheat" },
            { answerId: 3, answerText: "Oats" },
            { answerId: 4, answerText: "Barley" },
            { answerId: 5, answerText: "Corn" }
        ],
        correctAnswerId: 2
    },
    {
        id: 24,
        category: Category.GROCERIES,
        question: "What is the main ingredient in guacamole?",
        answers: [
            { answerId: 1, answerText: "Tomato" },
            { answerId: 2, answerText: "Avocado" },
            { answerId: 3, answerText: "Chili" },
            { answerId: 4, answerText: "Onion" },
            { answerId: 5, answerText: "Garlic" }
        ],
        correctAnswerId: 2
    },
    {
        id: 25,
        category: Category.GROCERIES,
        question: "Which type of pasta is shaped like little ears?",
        answers: [
            { answerId: 1, answerText: "Fettuccine" },
            { answerId: 2, answerText: "Penne" },
            { answerId: 3, answerText: "Orecchiette" },
            { answerId: 4, answerText: "Fusilli" },
            { answerId: 5, answerText: "Rigatoni" }
        ],
        correctAnswerId: 3
    },
    {
        id: 26,
        category: Category.GROCERIES,
        question: "Which vegetable is known for having layers?",
        answers: [
            { answerId: 1, answerText: "Garlic" },
            { answerId: 2, answerText: "Onion" },
            { answerId: 3, answerText: "Carrot" },
            { answerId: 4, answerText: "Lettuce" },
            { answerId: 5, answerText: "Potato" }
        ],
        correctAnswerId: 2
    },
    {
        id: 27,
        category: Category.GROCERIES,
        question: "What fruit is known for its high vitamin C content?",
        answers: [
            { answerId: 1, answerText: "Banana" },
            { answerId: 2, answerText: "Orange" },
            { answerId: 3, answerText: "Grapes" },
            { answerId: 4, answerText: "Melon" },
            { answerId: 5, answerText: "Kiwi" }
        ],
        correctAnswerId: 2
    },
    {
        id: 28,
        category: Category.GROCERIES,
        question: "What type of nut is used to make marzipan?",
        answers: [
            { answerId: 1, answerText: "Almond" },
            { answerId: 2, answerText: "Walnut" },
            { answerId: 3, answerText: "Pistachio" },
            { answerId: 4, answerText: "Cashew" },
            { answerId: 5, answerText: "Peanut" }
        ],
        correctAnswerId: 1
    },
    {
        id: 29,
        category: Category.GROCERIES,
        question: "Which leafy vegetable can be used to make pesto?",
        answers: [
            { answerId: 1, answerText: "Spinach" },
            { answerId: 2, answerText: "Basil" },
            { answerId: 3, answerText: "Kale" },
            { answerId: 4, answerText: "Chard" },
            { answerId: 5, answerText: "Lettuce" }
        ],
        correctAnswerId: 2
    },
    {
        id: 30,
        category: Category.GROCERIES,
        question: "Which spice is known as the 'king of spices'?",
        answers: [
            { answerId: 1, answerText: "Cumin" },
            { answerId: 2, answerText: "Black Pepper" },
            { answerId: 3, answerText: "Cinnamon" },
            { answerId: 4, answerText: "Cardamom" },
            { answerId: 5, answerText: "Nutmeg" }
        ],
        correctAnswerId: 2
    },

    // STARS
    {
        id: 31,
        category: Category.STARS,
        question: "What is the closest star to Earth?",
        answers: [
            { answerId: 1, answerText: "Alpha Centauri" },
            { answerId: 2, answerText: "Proxima Centauri" },
            { answerId: 3, answerText: "Sirius" },
            { answerId: 4, answerText: "Betelgeuse" },
            { answerId: 5, answerText: "Vega" }
        ],
        correctAnswerId: 2
    },
    {
        id: 32,
        category: Category.STARS,
        question: "Which star is known as the North Star?",
        answers: [
            { answerId: 1, answerText: "Polaris" },
            { answerId: 2, answerText: "Betelgeuse" },
            { answerId: 3, answerText: "Sirius" },
            { answerId: 4, answerText: "Aldebaran" },
            { answerId: 5, answerText: "Hercules" }
        ],
        correctAnswerId: 1
    },
    {
        id: 33,
        category: Category.STARS,
        question: "What is the largest star known to exist?",
        answers: [
            { answerId: 1, answerText: "VY Canis Majoris" },
            { answerId: 2, answerText: "Betelgeuse" },
            { answerId: 3, answerText: "Antares" },
            { answerId: 4, answerText: "Sirius" },
            { answerId: 5, answerText: "Rigel" }
        ],
        correctAnswerId: 1
    },
    {
        id: 34,
        category: Category.STARS,
        question: "Which star is often referred to as the 'Dog Star'?",
        answers: [
            { answerId: 1, answerText: "Aldebaran" },
            { answerId: 2, answerText: "Sirius" },
            { answerId: 3, answerText: "Vega" },
            { answerId: 4, answerText: "Canopus" },
            { answerId: 5, answerText: "Capella" }
        ],
        correctAnswerId: 2
    },
    {
        id: 35,
        category: Category.STARS,
        question: "What type of star is the Sun?",
        answers: [
            { answerId: 1, answerText: "Red Giant" },
            { answerId: 2, answerText: "White Dwarf" },
            { answerId: 3, answerText: "Main Sequence" },
            { answerId: 4, answerText: "Supernova" },
            { answerId: 5, answerText: "Neutron Star" }
        ],
        correctAnswerId: 3
    },
    {
        id: 36,
        category: Category.STARS,
        question: "What is the scientific study of stars called?",
        answers: [
            { answerId: 1, answerText: "Astronomy" },
            { answerId: 2, answerText: "Astrophysics" },
            { answerId: 3, answerText: "Astrology" },
            { answerId: 4, answerText: "Cosmology" },
            { answerId: 5, answerText: "Astrogeography" }
        ],
        correctAnswerId: 1
    },
    {
        id: 37,
        category: Category.STARS,
        question: "Which star is the brightest in the night sky?",
        answers: [
            { answerId: 1, answerText: "Sirius" },
            { answerId: 2, answerText: "Canopus" },
            { answerId: 3, answerText: "Arcturus" },
            { answerId: 4, answerText: "Vega" },
            { answerId: 5, answerText: "Antares" }
        ],
        correctAnswerId: 1
    },
    {
        id: 38,
        category: Category.STARS,
        question: "What is a star's life cycle primarily based on?",
        answers: [
            { answerId: 1, answerText: "Temperature" },
            { answerId: 2, answerText: "Mass" },
            { answerId: 3, answerText: "Color" },
            { answerId: 4, answerText: "Distance" },
            { answerId: 5, answerText: "Brightness" }
        ],
        correctAnswerId: 2
    },
    {
        id: 39,
        category: Category.STARS,
        question: "What is the end stage of a star's life cycle?",
        answers: [
            { answerId: 1, answerText: "Black Hole" },
            { answerId: 2, answerText: "Supernova" },
            { answerId: 3, answerText: "Neutron Star" },
            { answerId: 4, answerText: "White Dwarf" },
            { answerId: 5, answerText: "All of the above" }
        ],
        correctAnswerId: 5
    },
    {
        id: 40,
        category: Category.STARS,
        question: "What is a group of stars called?",
        answers: [
            { answerId: 1, answerText: "Galaxy" },
            { answerId: 2, answerText: "Constellation" },
            { answerId: 3, answerText: "Nebula" },
            { answerId: 4, answerText: "Star Cluster" },
            { answerId: 5, answerText: "Quasar" }
        ],
        correctAnswerId: 4
    },

    // HISTORY
    {
        id: 41,
        category: Category.HISTORY,
        question: "Who was the first emperor of China?",
        answers: [
            { answerId: 1, answerText: "Qin Shi Huang" },
            { answerId: 2, answerText: "Wu Zetian" },
            { answerId: 3, answerText: "Sun Yat-sen" },
            { answerId: 4, answerText: "Confucius" },
            { answerId: 5, answerText: "Cao Cao" }
        ],
        correctAnswerId: 1
    },
    {
        id: 42,
        category: Category.HISTORY,
        question: "In which year did the Berlin Wall fall?",
        answers: [
            { answerId: 1, answerText: "1987" },
            { answerId: 2, answerText: "1989" },
            { answerId: 3, answerText: "1991" },
            { answerId: 4, answerText: "1990" },
            { answerId: 5, answerText: "1988" }
        ],
        correctAnswerId: 2
    },
    {
        id: 43,
        category: Category.HISTORY,
        question: "Which war lasted from 1914 to 1918?",
        answers: [
            { answerId: 1, answerText: "World War I" },
            { answerId: 2, answerText: "World War II" },
            { answerId: 3, answerText: "The Civil War" },
            { answerId: 4, answerText: "The Vietnam War" },
            { answerId: 5, answerText: "The Korean War" }
        ],
        correctAnswerId: 1
    },
    {
        id: 44,
        category: Category.HISTORY,
        question: "Who was the first President of the United States?",
        answers: [
            { answerId: 1, answerText: "Thomas Jefferson" },
            { answerId: 2, answerText: "Abraham Lincoln" },
            { answerId: 3, answerText: "George Washington" },
            { answerId: 4, answerText: "John Adams" },
            { answerId: 5, answerText: "James Madison" }
        ],
        correctAnswerId: 3
    },
    {
        id: 45,
        category: Category.HISTORY,
        question: "What year did the Titanic sink?",
        answers: [
            { answerId: 1, answerText: "1912" },
            { answerId: 2, answerText: "1914" },
            { answerId: 3, answerText: "1905" },
            { answerId: 4, answerText: "1910" },
            { answerId: 5, answerText: "1898" }
        ],
        correctAnswerId: 1
    },
    {
        id: 46,
        category: Category.HISTORY,
        question: "Which ancient civilization built the pyramids?",
        answers: [
            { answerId: 1, answerText: "Mayans" },
            { answerId: 2, answerText: "Aztecs" },
            { answerId: 3, answerText: "Egyptians" },
            { answerId: 4, answerText: "Greeks" },
            { answerId: 5, answerText: "Romans" }
        ],
        correctAnswerId: 3
    },
    {
        id: 47,
        category: Category.HISTORY,
        question: "Which empire was known for its road system and Cornelia's other infrastructures?",
        answers: [
            { answerId: 1, answerText: "Roman Empire" },
            { answerId: 2, answerText: "Ottoman Empire" },
            { answerId: 3, answerText: "Persian Empire" },
            { answerId: 4, answerText: "Mongolian Empire" },
            { answerId: 5, answerText: "Byzantine Empire" }
        ],
        correctAnswerId: 1
    },
    {
        id: 48,
        category: Category.HISTORY,
        question: "Which country was ruled by King Louis XVI during the French Revolution?",
        answers: [
            { answerId: 1, answerText: "England" },
            { answerId: 2, answerText: "France" },
            { answerId: 3, answerText: "Spain" },
            { answerId: 4, answerText: "Italy" },
            { answerId: 5, answerText: "Germany" }
        ],
        correctAnswerId: 2
    },
    {
        id: 49,
        category: Category.HISTORY,
        question: "What was the primary cause of the Cold War?",
        answers: [
            { answerId: 1, answerText: "Economic sanctions" },
            { answerId: 2, answerText: "Capitalism vs. Communism" },
            { answerId: 3, answerText: "Disarmament talks" },
            { answerId: 4, answerText: "Imperial competition" },
            { answerId: 5, answerText: "Nationalism" }
        ],
        correctAnswerId: 2
    },
    {
        id: 50,
        category: Category.HISTORY,
        question: "Who assassinated Archduke Franz Ferdinand of Austria?",
        answers: [
            { answerId: 1, answerText: "Vladimir Lenin" },
            { answerId: 2, answerText: "Gavrilo Princip" },
            { answerId: 3, answerText: "Grigori Rasputin" },
            { answerId: 4, answerText: "Adolf Hitler" },
            { answerId: 5, answerText: "Mahatma Gandhi" }
        ],
        correctAnswerId: 2
    },

    // STORIES
    {
        id: 51,
        category: Category.STORIES,
        question: "Who wrote 'The Tale of Peter Rabbit'?",
        answers: [
            { answerId: 1, answerText: "Beatrix Potter" },
            { answerId: 2, answerText: "A. A. Milne" },
            { answerId: 3, answerText: "Lewis Carroll" },
            { answerId: 4, answerText: "J.K. Rowling" },
            { answerId: 5, answerText: "Dr. Seuss" }
        ],
        correctAnswerId: 1
    },
    {
        id: 52,
        category: Category.STORIES,
        question: "In which book series does the character 'Gollum' appear?",
        answers: [
            { answerId: 1, answerText: "Harry Potter" },
            { answerId: 2, answerText: "The Hobbit" },
            { answerId: 3, answerText: "The Lord of the Rings" },
            { answerId: 4, answerText: "The Chronicles of Narnia" },
            { answerId: 5, answerText: "The Dark Tower" }
        ],
        correctAnswerId: 3
    },
    {
        id: 53,
        category: Category.STORIES,
        question: "Who is the author of 'Moby-Dick'?",
        answers: [
            { answerId: 1, answerText: "Herman Melville" },
            { answerId: 2, answerText: "Mark Twain" },
            { answerId: 3, answerText: "Ernest Hemingway" },
            { answerId: 4, answerText: "F. Scott Fitzgerald" },
            { answerId: 5, answerText: "John Steinbeck" }
        ],
        correctAnswerId: 1
    },
    {
        id: 54,
        category: Category.STORIES,
        question: "Which character says, 'To be or not to be, that is the question'?",
        answers: [
            { answerId: 1, answerText: "Hamlet" },
            { answerId: 2, answerText: "Macbeth" },
            { answerId: 3, answerText: "Othello" },
            { answerId: 4, answerText: "King Lear" },
            { answerId: 5, answerText: "Romeo" }
        ],
        correctAnswerId: 1
    },
    {
        id: 55,
        category: Category.STORIES,
        question: "What is the name of the lion in 'The Chronicles of Narnia'?",
        answers: [
            { answerId: 1, answerText: "Aslan" },
            { answerId: 2, answerText: "Simba" },
            { answerId: 3, answerText: "Mufasa" },
            { answerId: 4, answerText: "Scar" },
            { answerId: 5, answerText: "Shere Khan" }
        ],
        correctAnswerId: 1
    },
    {
        id: 56,
        category: Category.STORIES,
        question: "Which fairy tale features a girl with long hair?",
        answers: [
            { answerId: 1, answerText: "Cinderella" },
            { answerId: 2, answerText: "Snow White" },
            { answerId: 3, answerText: "Rapunzel" },
            { answerId: 4, answerText: "Sleeping Beauty" },
            { answerId: 5, answerText: "Beauty and the Beast" }
        ],
        correctAnswerId: 3
    },
    {
        id: 57,
        category: Category.STORIES,
        question: "Who wrote 'Charlotte's Web'?",
        answers: [
            { answerId: 1, answerText: "E.B. White" },
            { answerId: 2, answerText: "J.K. Rowling" },
            { answerId: 3, answerText: "Roald Dahl" },
            { answerId: 4, answerText: "Mark Twain" },
            { answerId: 5, answerText: "Louisa May Alcott" }
        ],
        correctAnswerId: 1
    },
    {
        id: 58,
        category: Category.STORIES,
        question: "What is the title of the first Harry Potter book?",
        answers: [
            { answerId: 1, answerText: "Harry Potter and the Philosopher's Stone" },
            { answerId: 2, answerText: "Harry Potter and the Chamber of Secrets" },
            { answerId: 3, answerText: "Harry Potter and the Prisoner of Azkaban" },
            { answerId: 4, answerText: "Harry Potter and the Goblet of Fire" },
            { answerId: 5, answerText: "Harry Potter and the Order of the Phoenix" }
        ],
        correctAnswerId: 1
    },
    {
        id: 59,
        category: Category.STORIES,
        question: "Which character is known for enjoying adventures and features in 'The Adventures of Tom Sawyer'?",
        answers: [
            { answerId: 1, answerText: "Huck Finn" },
            { answerId: 2, answerText: "Oliver Twist" },
            { answerId: 3, answerText: "Peter Pan" },
            { answerId: 4, answerText: "Winnie the Pooh" },
            { answerId: 5, answerText: "Frodo Baggins" }
        ],
        correctAnswerId: 1
    },
    {
        id: 60,
        category: Category.STORIES,
        question: "What is the title of Lewis Carroll's famous poem that begins with 'Twas brillig, and the slithy toves'?",
        answers: [
            { answerId: 1, answerText: "The Jabberwocky" },
            { answerId: 2, answerText: "The Walrus and The Carpenter" },
            { answerId: 3, answerText: "The Hunting of the Snark" },
            { answerId: 4, answerText: "The Lobster Quadrille" },
            { answerId: 5, answerText: "The Queen's Croquet Ground" }
        ],
        correctAnswerId: 1
    },

    // SCHOOL
    {
        id: 61,
        category: Category.SCHOOL,
        question: "In what subject would you learn about equations and variables?",
        answers: [
            { answerId: 1, answerText: "History" },
            { answerId: 2, answerText: "Mathematics" },
            { answerId: 3, answerText: "Science" },
            { answerId: 4, answerText: "English" },
            { answerId: 5, answerText: "Art" }
        ],
        correctAnswerId: 2
    },
    {
        id: 62,
        category: Category.SCHOOL,
        question: "What is the chemical symbol for water?",
        answers: [
            { answerId: 1, answerText: "O2" },
            { answerId: 2, answerText: "H2O" },
            { answerId: 3, answerText: "HO" },
            { answerId: 4, answerText: "H2O2" },
            { answerId: 5, answerText: "OH" }
        ],
        correctAnswerId: 2
    },
    {
        id: 63,
        category: Category.SCHOOL,
        question: "What is the process by which plants make their food?",
        answers: [
            { answerId: 1, answerText: "Photosynthesis" },
            { answerId: 2, answerText: "Respiration" },
            { answerId: 3, answerText: "Decomposition" },
            { answerId: 4, answerText: "Fermentation" },
            { answerId: 5, answerText: "Evaporation" }
        ],
        correctAnswerId: 1
    },
    {
        id: 64,
        category: Category.SCHOOL,
        question: "Which planet is known as the 'Red Planet'?",
        answers: [
            { answerId: 1, answerText: "Venus" },
            { answerId: 2, answerText: "Mars" },
            { answerId: 3, answerText: "Jupiter" },
            { answerId: 4, answerText: "Saturn" },
            { answerId: 5, answerText: "Neptune" }
        ],
        correctAnswerId: 2
    },
    {
        id: 65,
        category: Category.SCHOOL,
        question: "What is the longest river in the world?",
        answers: [
            { answerId: 1, answerText: "Amazon" },
            { answerId: 2, answerText: "Nile" },
            { answerId: 3, answerText: "Yangtze" },
            { answerId: 4, answerText: "Mississippi" },
            { answerId: 5, answerText: "Ganges" }
        ],
        correctAnswerId: 2
    },
    {
        id: 66,
        category: Category.SCHOOL,
        question: "What is the main language spoken in France?",
        answers: [
            { answerId: 1, answerText: "English" },
            { answerId: 2, answerText: "Spanish" },
            { answerId: 3, answerText: "French" },
            { answerId: 4, answerText: "German" },
            { answerId: 5, answerText: "Italian" }
        ],
        correctAnswerId: 3
    },
    {
        id: 67,
        category: Category.SCHOOL,
        question: "Which subject would you study at a lab?",
        answers: [
            { answerId: 1, answerText: "Mathematics" },
            { answerId: 2, answerText: "History" },
            { answerId: 3, answerText: "Science" },
            { answerId: 4, answerText: "Geography" },
            { answerId: 5, answerText: "English" }
        ],
        correctAnswerId: 3
    },
    {
        id: 68,
        category: Category.SCHOOL,
        question: "What is the capital city of Japan?",
        answers: [
            { answerId: 1, answerText: "Tokyo" },
            { answerId: 2, answerText: "Kyoto" },
            { answerId: 3, answerText: "Osaka" },
            { answerId: 4, answerText: "Hiroshima" },
            { answerId: 5, answerText: "Nagasaki" }
        ],
        correctAnswerId: 1
    },
    {
        id: 69,
        category: Category.SCHOOL,
        question: "In which subject would you learn about ecosystems?",
        answers: [
            { answerId: 1, answerText: "Math" },
            { answerId: 2, answerText: "Science" },
            { answerId: 3, answerText: "History" },
            { answerId: 4, answerText: "English" },
            { answerId: 5, answerText: "Geography" }
        ],
        correctAnswerId: 2
    },
    {
        id: 70,
        category: Category.SCHOOL,
        question: "Who wrote the play 'Romeo and Juliet'?",
        answers: [
            { answerId: 1, answerText: "George Orwell" },
            { answerId: 2, answerText: "Charles Dickens" },
            { answerId: 3, answerText: "Mark Twain" },
            { answerId: 4, answerText: "William Shakespeare" },
            { answerId: 5, answerText: "Jane Austen" }
        ],
        correctAnswerId: 4
    },

    // COMPUTER
    {
        id: 71,
        category: Category.COMPUTER,
        question: "What does 'HTML' stand for?",
        answers: [
            { answerId: 1, answerText: "Hypertext Markup Language" },
            { answerId: 2, answerText: "Hyperlink Markup Language" },
            { answerId: 3, answerText: "Hypotext Markup Language" },
            { answerId: 4, answerText: "Hypertext Multi-Language" },
            { answerId: 5, answerText: "Hypertext Machine Learning" }
        ],
        correctAnswerId: 1
    },
    {
        id: 72,
        category: Category.COMPUTER,
        question: "What is the binary equivalent of decimal 10?",
        answers: [
            { answerId: 1, answerText: "1010" },
            { answerId: 2, answerText: "1100" },
            { answerId: 3, answerText: "1110" },
            { answerId: 4, answerText: "1001" },
            { answerId: 5, answerText: "1000" }
        ],
        correctAnswerId: 1
    },
    {
        id: 73,
        category: Category.COMPUTER,
        question: "What does 'CPU' stand for?",
        answers: [
            { answerId: 1, answerText: "Central Processing Unit" },
            { answerId: 2, answerText: "Computer Personal Unit" },
            { answerId: 3, answerText: "Core Processing Unit" },
            { answerId: 4, answerText: "Central Program Unit" },
            { answerId: 5, answerText: "Central Power Unit" }
        ],
        correctAnswerId: 1
    },
    {
        id: 74,
        category: Category.COMPUTER,
        question: "What is the main function of an operating system?",
        answers: [
            { answerId: 1, answerText: "Manage hardware and software resources" },
            { answerId: 2, answerText: "Run antivirus software" },
            { answerId: 3, answerText: "Format hard drives" },
            { answerId: 4, answerText: "Create backups" },
            { answerId: 5, answerText: "Develop software" }
        ],
        correctAnswerId: 1
    },
    {
        id: 75,
        category: Category.COMPUTER,
        question: "What is the term for malicious software?",
        answers: [
            { answerId: 1, answerText: "Malware" },
            { answerId: 2, answerText: "Firmware" },
            { answerId: 3, answerText: "Adware" },
            { answerId: 4, answerText: "Spyware" },
            { answerId: 5, answerText: "Shareware" }
        ],
        correctAnswerId: 1
    },
    {
        id: 76,
        category: Category.COMPUTER,
        question: "Who is known as the father of the computer?",
        answers: [
            { answerId: 1, answerText: "Alan Turing" },
            { answerId: 2, answerText: "Charles Babbage" },
            { answerId: 3, answerText: "Bill Gates" },
            { answerId: 4, answerText: "Steve Jobs" },
            { answerId: 5, answerText: "Ada Lovelace" }
        ],
        correctAnswerId: 2
    },
    {
        id: 77,
        category: Category.COMPUTER,
        question: "What does 'RAM' stand for?",
        answers: [
            { answerId: 1, answerText: "Read Access Memory" },
            { answerId: 2, answerText: "Random Access Memory" },
            { answerId: 3, answerText: "Rapid Access Memory" },
            { answerId: 4, answerText: "Reliable Access Memory" },
            { answerId: 5, answerText: "Red Access Memory" }
        ],
        correctAnswerId: 2
    },
    {
        id: 78,
        category: Category.COMPUTER,
        question: "What is a common output device used to print documents?",
        answers: [
            { answerId: 1, answerText: "Monitor" },
            { answerId: 2, answerText: "Scanner" },
            { answerId: 3, answerText: "Printer" },
            { answerId: 4, answerText: "Keyboard" },
            { answerId: 5, answerText: "Mouse" }
        ],
        correctAnswerId: 3
    },
    {
        id: 79,
        category: Category.COMPUTER,
        question: "What is the function of a web browser?",
        answers: [
            { answerId: 1, answerText: "Create websites" },
            { answerId: 2, answerText: "Access and view web pages" },
            { answerId: 3, answerText: "Store files" },
            { answerId: 4, answerText: "Send emails" },
            { answerId: 5, answerText: "Secure networks" }
        ],
        correctAnswerId: 2
    },
    {
        id: 80,
        category: Category.COMPUTER,
        question: "What does 'URL' stand for?",
        answers: [
            { answerId: 1, answerText: "Uniform Resource Locator" },
            { answerId: 2, answerText: "Universal Resource Locator" },
            { answerId: 3, answerText: "Uniform Resource Link" },
            { answerId: 4, answerText: "Universal Resource Link" },
            { answerId: 5, answerText: "Uniform Results Locator" }
        ],
        correctAnswerId: 1
    }
];