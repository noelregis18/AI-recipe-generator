
// Sample recipes to use as fallback when API calls fail
export const mockRecipes = [
  {
    id: "sample-1",
    title: "Demo Recipe: Pasta Primavera",
    description: "A light pasta dish with fresh vegetables.",
    ingredients: [
      "8 oz pasta (any shape)",
      "1 cup cherry tomatoes, halved",
      "1 zucchini, diced",
      "1 bell pepper, sliced",
      "2 cloves garlic, minced",
      "1/4 cup olive oil",
      "1/4 cup grated Parmesan cheese",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Boil pasta according to package directions.",
      "Heat olive oil in a large pan and add garlic, cook until fragrant.",
      "Add vegetables and sauté for 5 minutes until tender.",
      "Drain pasta and add to the pan with vegetables.",
      "Toss with Parmesan cheese, salt, and pepper."
    ],
    difficulty: "Easy",
    cookTime: "20 mins",
    imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8"
  },
  {
    id: "sample-2",
    title: "Demo Recipe: Simple Stir-Fry",
    description: "A quick and nutritious stir-fry that works with any vegetables you have on hand.",
    ingredients: [
      "2 cups mixed vegetables (bell peppers, carrots, broccoli)",
      "1 cup protein of choice (tofu, chicken, beef)",
      "2 tbsp vegetable oil",
      "3 tbsp soy sauce",
      "1 tbsp honey or maple syrup",
      "1 clove garlic, minced",
      "1 tsp ginger, grated",
      "2 cups cooked rice for serving"
    ],
    instructions: [
      "Heat oil in a wok or large pan over high heat.",
      "Add protein and cook until nearly done.",
      "Add vegetables and stir-fry for 3-5 minutes.",
      "Mix soy sauce, honey, garlic, and ginger in a small bowl.",
      "Pour sauce over the stir-fry and cook for another minute.",
      "Serve over rice."
    ],
    difficulty: "Easy",
    cookTime: "15 mins",
    imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
  },
  {
    id: "sample-3",
    title: "Demo Recipe: Quick Quesadilla",
    description: "A simple quesadilla that can be made with ingredients you likely already have.",
    ingredients: [
      "2 large flour tortillas",
      "1 cup shredded cheese",
      "1/2 cup beans (black or pinto)",
      "1/4 cup salsa",
      "1/4 cup diced onion",
      "Optional toppings: avocado, sour cream, cilantro"
    ],
    instructions: [
      "Heat a large pan over medium heat.",
      "Place one tortilla in the pan and sprinkle half with cheese.",
      "Add beans and onions on top of the cheese.",
      "Fold the tortilla in half and cook until golden brown, about 2 minutes.",
      "Flip and cook the other side until crisp and cheese is melted.",
      "Serve with salsa and optional toppings."
    ],
    difficulty: "Easy",
    cookTime: "10 mins",
    imageUrl: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71"
  }
];

// Default food images for recipes that don't provide their own
export const foodImages = [
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'https://images.unsplash.com/photo-1563379926898-05f4575a45d8',
  'https://images.unsplash.com/photo-1505576399279-565b52d4ac71'
];
