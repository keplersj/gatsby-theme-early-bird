module.exports = options => ({
  plugins: [
    {
      resolve: "gatsby-theme-blog-core",
      options: {
        basePath: options.basePath,
        contentPath: options.contentPath,
        assetPath: options.assetPath
      }
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          query SiteMetadataForRSS {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({
              query: {
                site,
                allBlogPost: { edges: posts }
              }
            }) =>
              posts.map(({ node: post }) => ({
                title: post.title,
                description: post.excerpt,
                date: post.date,
                url: site.siteMetadata.siteUrl + post.slug,
                guid: site.siteMetadata.siteUrl + post.slug
              })),
            query: `
              query BlogPostsForRSS {
                allBlogPost(sort: {order: DESC, fields: date}) {
                  edges {
                    node {
                      date
                      slug
                      title
                      excerpt
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "RSS Feed",
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: "^/blog/"
          }
        ]
      }
    },
    "gatsby-plugin-typescript"
  ]
});
