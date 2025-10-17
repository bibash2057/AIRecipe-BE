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
  "servingSize": ${servings || 1},
  "cookingTime": "Total time in minutes (e.g., 20 minutes)",
  "dietaryTags": ${
    dietaryFocus ? JSON.stringify(dietaryOptions[dietaryFocus].notes) : "[]"
  },
  "ingredients": [
    {
      "name": "ingredient",
      "baseAmount": "quantity (for 1 serving)",
      "servingSize": ${servings || 1},
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
      "description": "detailed instruction"${
        dietaryFocus === "GYM" ? ', "optimalTiming": "pre/post-workout"' : ""
      },
      "duration": "step time"
    }
  ],
  "nutritionalAnalysis": {
    "perServing": {
      "calories": "kcal",
      "macros": {
        "protein": "g",
        "carbs": "g",
        "fats": "g"${dietaryFocus === "KETO" ? ', "netCarbs": "g"' : ""},
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
  }
}
  
  Special Rules:
  Use ${ingredients.join(
    ", "
  )} as primary ingredients and adapt the recipe for ${
    dietaryFocus
      ? dietaryOptions[dietaryFocus].focus + " diet"
      : "general nutrition"
  }.
  Ensure output is strictly valid JSON with no markdown or extra text.
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

async function generateRecipeImage(promptText, imageName = "recipe-image.png") {
  try {
    const response = await genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      contents: promptText,
      config: {
        responseModalities: [Modality.TEXT, Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync(imageName, buffer);
        console.log(`✅ Image saved as ${imageName}`);
      }
    }
  } catch (error) {}
}

module.exports = { generateRecipe };
