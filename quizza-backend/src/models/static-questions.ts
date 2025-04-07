import { Question } from "./backendmodels";

export const questions: Question[] = [
    {
        id: 1,
        question: "What is the capital of France?",
        answers: [
            { answerId: 1, answerText: "Paris" },
            { answerId: 2, answerText: "Berlin" },
            { answerId: 3, answerText: "Madrid" },
            { answerId: 4, answerText: "Rome" },
        ],
        correctAnswerId: 1,
    },
    {
        id: 2,
        question: "Which planet is known as the Red Planet?",
        answers: [
            { answerId: 5, answerText: "Earth" },
            { answerId: 6, answerText: "Venus" },
            { answerId: 7, answerText: "Mars" },
            { answerId: 8, answerText: "Jupiter" },
        ],
        correctAnswerId: 7,
    },
    {
        id: 3,
        question: "Who wrote 'Romeo and Juliet'?",
        answers: [
            { answerId: 9, answerText: "William Shakespeare" },
            { answerId: 10, answerText: "Charles Dickens" },
            { answerId: 11, answerText: "Jane Austen" },
            { answerId: 12, answerText: "Mark Twain" },
        ],
        correctAnswerId: 9,
    },
    {
        id: 4,
        question: "What is the largest ocean on Earth?",
        answers: [
            { answerId: 13, answerText: "Indian Ocean" },
            { answerId: 14, answerText: "Atlantic Ocean" },
            { answerId: 15, answerText: "Arctic Ocean" },
            { answerId: 16, answerText: "Pacific Ocean" },
        ],
        correctAnswerId: 16,
    },
    {
        id: 5,
        question: "Which language is primarily used for Android app development?",
        answers: [
            { answerId: 17, answerText: "Swift" },
            { answerId: 18, answerText: "Kotlin" },
            { answerId: 19, answerText: "JavaScript" },
            { answerId: 20, answerText: "Ruby" },
        ],

        correctAnswerId: 18,
    },
    {
        id: 6,
        question: "How many continents are there?",
        answers: [
            { answerId: 21, answerText: "5" },
            { answerId: 22, answerText: "6" },
            { answerId: 23, answerText: "7" },
            { answerId: 24, answerText: "8" },
        ],

        correctAnswerId: 23,
    },
    {
        id: 7,
        question: "What is the square root of 64?",
        answers: [
            { answerId: 25, answerText: "6" },
            { answerId: 26, answerText: "7" },
            { answerId: 27, answerText: "8" },
            { answerId: 28, answerText: "9" },
        ],

        correctAnswerId: 27,
    },
    {
        id: 8,
        question: "Which gas do plants absorb from the atmosphere?",
        answers: [
            { answerId: 29, answerText: "Oxygen" },
            { answerId: 30, answerText: "Carbon Dioxide" },
            { answerId: 31, answerText: "Hydrogen" },
            { answerId: 32, answerText: "Nitrogen" },
        ],

        correctAnswerId: 30,
    },
    {
        id: 9,
        question: "In what year did the first man land on the moon?",
        answers: [
            { answerId: 33, answerText: "1965" },
            { answerId: 34, answerText: "1969" },
            { answerId: 35, answerText: "1972" },
            { answerId: 36, answerText: "1959" },
        ],

        correctAnswerId: 34,
    },
    {
        id: 10,
        question: "Which data type is not primitive in JavaScript?",
        answers: [
            { answerId: 37, answerText: "String" },
            { answerId: 38, answerText: "Number" },
            { answerId: 39, answerText: "Object" },
            { answerId: 40, answerText: "Boolean" },
        ],

        correctAnswerId: 39,
    },
];