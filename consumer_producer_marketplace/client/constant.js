const products = [
    {
      id: 1,
      category: "Oil",
      low: {
        productName: "Ayurdevic Low Quality Oil",
        productQuality: "low",
        productPrice: 5,
        productCost: 2,
        value: 8,
        productImage: "/graphics/StandardToothpasteAI.png"
      },
      high: {
        productName: "Ayurvdeic High Quality Oil",
        productQuality: "high",
        productPrice: 10,
        productCost: 6,
        value: 15,
        productImage: "/graphics/PremiumToothpasteAI.png"
      },
      productWarrants: [
        {
          icon: "https://res.cloudinary.com/dgccztjql/image/upload/v1704638438/SimPPL/Gum_Protection_onbo0t.png",
          description: "Advanced Cavity Protection for Lasting Oral Heatlh",
          multiplier: 3,
          challengeMultiplier: 0.1,
        },
        {
          icon: "https://res.cloudinary.com/dgccztjql/image/upload/v1704638434/SimPPL/Fresh_Breath_he5jws.png",
          description: "Fresh Dreath Assurance with Enhanced Whitening",
          multiplier: 4,
          challengeMultiplier: 0.1,
        },
        {
          icon: "https://res.cloudinary.com/dgccztjql/image/upload/v1704638437/SimPPL/Healthy_Gum_domd4m.png",
          description: "Gentle Care for Sensitivity and Healthy Gums",
          multiplier: 5,
          challengeMultiplier: 0.1,
        },
      ],
    },
    {
        id: 2,
        category: "Toothpaste",
        low: {
          productName: "Ayurdevic Low Quality Toothpaste",
          productQuality: "low",
          productPrice: 5,
          productCost: 2,
          value: 8,
          productImage:
          "/graphics/StandardToothpasteAI.png"        },
        high: {
          productName: "Ayurdevic High Quality Toothpaste",
          productQuality: "high",
          productPrice: 10,
          productCost: 6,
          value: 15,
          productImage: "/graphics/PremiumToothpasteAI.png"        },
        productWarrants: [
          {
            icon: "https://res.cloudinary.com/dgccztjql/image/upload/v1704638438/SimPPL/Gum_Protection_onbo0t.png",
            description: "Advanced Cavity Protection for Lasting Oral Heatlh",
            multiplier: 3,
            challengeMultiplier: 0.1,
          },
          {
            icon: "https://res.cloudinary.com/dgccztjql/image/upload/v1704638434/SimPPL/Fresh_Breath_he5jws.png",
            description: "Fresh Dreath Assurance with Enhanced Whitening",
            multiplier: 4,
            challengeMultiplier: 0.1,
          },
          {
            icon: "https://res.cloudinary.com/dgccztjql/image/upload/v1704638437/SimPPL/Healthy_Gum_domd4m.png",
            description: "Gentle Care for Sensitivity and Healthy Gums",
            multiplier: 5,
            challengeMultiplier: 0.1,
          },
        ],
      },
  ];
  
  export { products };
  