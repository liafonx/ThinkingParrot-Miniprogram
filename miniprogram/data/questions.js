var json = {
  "001": [
    {
      "question": "The milk is off%c",
      
      "cases": [
        {
          "case": 2,
          "sampleAnswer": "the milk is gone bad.",
          "keyWords": {
            "k1": ["milk"],
            "k2": ["bad", "spoiled"],
            },
        },
        {
          "case": 3,
          "sampleAnswer": "牛奶已经变质了。",
          "keyWords": {
            "k1": ["牛奶"],
            "k2": ["变质", "坏"],
            },
        }
      ],
    },
    {
      "question": "He has been offed.",
      "cases": [
        {
          "case": 2,
          "keyWords": {
            "k1": ["he"],
            "k2": ["killed", "dead"],
          },
        },
        {
          "case": 3,
          "keyWords": {
            "k1": ["他"],
            "k2": ["被杀", "死"],
          },
        }
      ],
    }
  ],
  "002": [
   
  ],
}

module.exports = {
  questionList: json
}