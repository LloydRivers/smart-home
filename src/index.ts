import { Bucket } from "./components/Bucket";

const b = new Bucket();

async function runTheApp() {
  try {
    console.log("Storing data...");
    await b.store("temperature", 72);

    console.log("Retrieving data...");
    const data = await b.retrieve("temperature");
    console.log("Retrieved data:", data);
  } catch (error) {
    console.log("Something went wrong:", error);
  }
}

runTheApp()
  .then(() => {
    console.log("App run complete");
  })
  .catch(console.error);
