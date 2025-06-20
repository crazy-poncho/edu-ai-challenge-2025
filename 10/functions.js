module.exports = [
  {
    name: "filter_products",
    description: "Filter products by user preferences",
    parameters: {
      type: "object",
      properties: {
        category: {
          type: "string",
          description: "Product category, e.g., Electronics, Kitchen, Fitness"
        },
        max_price: {
          type: "number",
          description: "Maximum price"
        },
        min_rating: {
          type: "number",
          description: "Minimum product rating"
        },
        in_stock: {
          type: "boolean",
          description: "Whether the product should be in stock"
        }
      },
      required: []
    }
  }
];
