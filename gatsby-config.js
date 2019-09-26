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
                allFile: { edges: posts }
              }
            }) =>
              posts.map(({ node: { childMarkdownRemark: post } }) => ({
                ...post.frontmatter,
                description: post.excerpt,
                date: post.frontmatter.date,
                url: site.siteMetadata.siteUrl + post.fields.slug,
                guid: site.siteMetadata.siteUrl + post.fields.slug,
                custom_elements: [{ "content:encoded": post.html }]
              })),
            query: `
              query BlogPostsForRSS {
                allFile(filter: {sourceInstanceName: {eq: "blog"}}, sort: {order: DESC, fields: [childMarkdownRemark___frontmatter___date]}) {
                  edges {
                    node {
                      id
                      name
                      sourceInstanceName
                      childMarkdownRemark {
                        excerpt
                        html
                        fields {
                          slug
                        }
                        frontmatter {
                          title
                          date
                        }
                      }
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
