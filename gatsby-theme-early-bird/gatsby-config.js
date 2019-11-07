const withDefaults = require(`./utils/default-options`);

module.exports = themeOptions => {
  const options = withDefaults(themeOptions);
  const { mdx = true } = themeOptions;

  return {
    plugins: [
      mdx && {
        resolve: `gatsby-plugin-mdx`,
        options: {
          extensions: [`.mdx`, `.md`],
          gatsbyRemarkPlugins: [
            {
              resolve: `gatsby-remark-images`,
              options: {
                // should this be configurable by the end-user?
                maxWidth: 1380,
                linkImagesToOriginal: false
              }
            },
            { resolve: `gatsby-remark-copy-linked-files` },
            { resolve: `gatsby-remark-smartypants` }
          ],
          remarkPlugins: [require(`remark-slug`)]
        }
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: options.contentPath || `content/posts`,
          name: options.contentPath || `content/posts`
        }
      },
      {
        resolve: `gatsby-source-filesystem`,
        options: {
          path: options.assetPath || `content/assets`,
          name: options.assetPath || `content/assets`
        }
      },
      `gatsby-transformer-sharp`,
      `gatsby-plugin-sharp`,
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
    ].filter(Boolean)
  };
};
