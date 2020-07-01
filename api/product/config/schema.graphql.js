module.exports = {
  query: `
    productBySlug(slug: String!): Product
  `,

  resolver: {
    Query: {
      productBySlug: {
        description: "Find product by slug",
        resolver: "application::product.product.findBySlug",
      },
    },
  },
};
