const withDefaults = require(`./utils/default-options`);

module.exports = themeOptions => {
  const options = withDefaults(themeOptions);
  const { remark = true } = themeOptions;

  return {
    siteMetadata: {
      title: "Blog Site",
      description: "This is a blog built using gatsby-theme-early-bird"
    },
    plugins: [
      {
        resolve: "gatsby-plugin-tinacms",
        options: {
          sidebar: {
            hidden: process.env.NODE_ENV === "production",
            position: "displace"
          },
          plugins: ["gatsby-tinacms-git", "gatsby-tinacms-remark"]
        }
      },
      remark && {
        resolve: "gatsby-transformer-remark",
        options: {
          plugins: [
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
          ]
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
      "gatsby-transformer-sqip",
      `gatsby-transformer-sharp`,
      `gatsby-plugin-sharp`,
      "gatsby-plugin-react-helmet-async",
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
                  guid: site.siteMetadata.siteUrl + post.slug,
                  custom_elements: [{ "content:encoded": post.html }]
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
                      html
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
