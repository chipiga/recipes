import fs from "fs";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(fs.readFileSync("serviceAccountKey.json", "utf8"));
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

// const rawData = fs.readFileSync("../public/recipes.json");
const rawData = fs.readFileSync("recipes.json");
const recipes = JSON.parse(rawData);

async function importRecipes() {
  const batchSize = 500;
  let batch = db.batch();
  let counter = 0;

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    delete recipe.id; // Remove id if present, Firestore will auto-generate
    const ref = db.collection("recipes").doc();
    batch.set(ref, {
      ...recipe,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    counter++;

    if (counter === batchSize || i === recipes.length - 1) {
      await batch.commit();
      console.log(`✅ Imported ${counter} docs`);
      counter = 0;
      batch = db.batch();
    }
  }
}

importRecipes().catch(console.error);
