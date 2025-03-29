const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateRecipe(category, ingredients, servings, dietaryFocus) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    generationConfig: {
      responseMimeType: "application/json",
    },
  });
  const dietaryOptions = {
    GYM: {
      focus: "high-protein",
      notes: ["muscle recovery", "post-workout nutrition"],
    },
    WEIGHT_LOSS: {
      focus: "low-calorie",
      notes: ["portion control", "satiety-focused"],
    },
    KETO: {
      focus: "low-carb",
      notes: ["high-fat", "ketosis-friendly"],
    },
    VEGAN: {
      focus: "plant-based",
      notes: ["animal-free", "plant-protein"],
    },
    BALANCED: {
      focus: "general wellness",
      notes: [],
    },
  };

  const prompt = `
  Create a detailed recipe for ${category} using primarily: ${ingredients.join(
    ", "
  )}.
  Adapt for ${
    dietaryFocus
      ? dietaryOptions[dietaryFocus].focus + " diet"
      : "general nutrition"
  }.
  
IMPORTANT: YOU MUST FOLLOW THESE RULES STRICTLY:
  1. Output must be valid JSON (no trailing commas, proper quotes)
  2. Check every ingredient against ${dietaryFocus || "general"} requirements
  3. For incompatible ingredients:
    - Mark as "incompatible"
    - Explain the issue
    - Provide an alternative
  4. Keep instructions simple and clear
  5. All measurements in metric units
  6. If no dietary focus, just list ingredients as-is
  7. Remove incompatible ingredients from the final ingredients list

  OUTPUT MUST BE IN THIS EXACT FORMAT (NO DEVIATIONS):
  {
    "title": "Recipe name",
    "description": "Brief description",
    "servingSize": ${servings || 2},
    "dietaryTags": ${
      dietaryFocus ? JSON.stringify(dietaryOptions[dietaryFocus].notes) : "[]"
    },
    "ingredients": [
      {
        "name": "ingredient",
        "baseAmount": "quantity (for 1 serving)",
        "servings": ${servings || 2},
        "notes": "preparation tips",
        "compatibility": {
          "isCompatible": boolean,
          "issues": ["list of dietary conflicts if any"],
          "alternatives": [
            {
              "name": "alternative ingredient",
              "amount": "equivalent amount",
              "reason": "why it's better for the diet"
            }
          ]
        }
      }
    ],
    "instructions": [
      {
        "step": number,
        "description": "detailed instruction",
        ${dietaryFocus === "GYM" ? '"optimalTiming": "pre/post-workout",' : ""}
        "duration": "step time"
      }
    ],
    "nutritionalAnalysis": {
      "perServing": {
        "calories": "kcal",
        "macros": {
          "protein": "g",
          "carbs": "g",
          "fats": "g",
          ${dietaryFocus === "KETO" ? '"netCarbs": "g",' : ""}
          "fiber": "g"
        }
      },
      "total": {
        "calories": "kcal",
        "protein": "g"
      },
      "healthBenefits": [
        "${
          dietaryFocus ? dietaryOptions[dietaryFocus].notes[0] : "balanced"
        } nutrition"
      ]
    },
    "dietaryAdaptations": {
      "${dietaryFocus || "default"}": [
        "${
          dietaryFocus
            ? dietaryOptions[dietaryFocus].notes.join(" • ")
            : "Standard preparation"
        }"
      ],
      "incompatibleIngredientsReplaced": [
        {
          "original": "ingredient name",
          "replacement": "substitute ingredient",
          "reason": "dietary conflict explanation"
        }
      ]
    },
    "dietaryComplianceReport": {
      "overallCompatibility": "percentage",
      "flaggedItems": number,
      "successfulSubstitutions": number,
      "warnings": [
        "list any remaining dietary concerns"
      ]
    }
  }
  
  Special Rules:
  1. Strictly follow ${dietaryFocus || "general"} dietary guidelines
  2. Show both base (1 serving) and scaled amounts
  3. ${
    dietaryFocus === "WEIGHT_LOSS" ? "Highlight low-calorie substitutions" : ""
  }
  4. ${
    dietaryFocus === "KETO" ? "Calculate net carbs (total carbs - fiber)" : ""
  }
  5. For GYM: Add protein timing recommendations
  6. For VEGAN: Suggest plant-protein alternatives
  7. Never include markdown or non-JSON text
  8. All measurements in metric/imperial units
  9. FLAG incompatible ingredients for ${dietaryFocus || "selected diet"} with:
     - Detailed reason for incompatibility
     - Recommended alternative
     - Nutritional comparison
  10. PROVIDE alternatives for all flagged ingredients
  11. Include dietary compliance report showing:
      - Percentage of compatible ingredients
      - Number of substitutions made
      - Any remaining dietary concerns
  12. For VEGAN: Flag all animal products (meat, dairy, eggs, honey)
  13. For KETO: Flag high-carb ingredients (>5g net carbs per serving)
  14. For GYM: Flag low-protein ingredients in main components
  15. For WEIGHT_LOSS: Flag high-calorie density ingredients
  16. For BALANCED: Ensure macronutrient balance (30% protein, 40% carbs, 30% fat)
  17. Clearly indicate in the compatibility object whether each ingredient is suitable
  18. When substituting, maintain similar texture/flavor profile where possible
  19. For all substitutions, include the reason and nutritional impact
  20. Include a summary of all modifications made for dietary compliance
  `;

  try {
    const result = await model.generateContent(prompt);
    const res = await result.response;

    if (!res) {
      throw new Error("No response from Gemini API");
    }

    const text = res.text();

    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate recipe");
  }
}

module.exports = { generateRecipe };
