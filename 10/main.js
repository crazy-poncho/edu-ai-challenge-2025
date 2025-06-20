const readline = require("readline-sync");
const openai = require("./openai");
const functions = require("./functions");

const products = require("./products");

async function main() {
  const userInput = readline.question("What are you looking for? ");

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that filters products based on user preferences."
      },
      {
        role: "user",
        content: userInput
      }
    ],
    functions,
    function_call: { name: "filter_products" }
  });

  const funcArgs = JSON.parse(response.choices[0].message.function_call.arguments);

  // Call OpenAI again to let it do the filtering based on arguments
  const filterResult = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: "You are a product filtering engine. Given filter criteria and a list of products, return only matching products."
      },
      {
        role: "user",
        content: `Filter the following products: ${JSON.stringify(products)} using filters: ${JSON.stringify(funcArgs)}`
      }
    ]
  });

  console.log("\nFiltered Products:\n");
  JSON.parse(filterResult.choices[0].message.content).forEach((product, i) => {    
    console.log(`${i + 1}. ${product.name} - $${product.price}, Rating: ${product.rating}, ${product.in_stock ? 'In Stock' : 'Out of Stock'}`);
  });
}

main();
