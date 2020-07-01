const { sanitizeEntity } = require("strapi-utils");

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve a product by slug.
   *
   * @return {Promise<object>}
   */

  async findBySlug(ctx) {
    const { _slug } = ctx.params;

    const product = await strapi
      .query("product")
      .model.findOne({ slug: _slug });

    return sanitizeEntity(product, { model: strapi.models.product });
  },
};
