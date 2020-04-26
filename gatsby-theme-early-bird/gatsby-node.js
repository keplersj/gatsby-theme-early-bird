const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const crypto = require("crypto");
const Debug = require("debug");
const { createFilePath } = require("gatsby-source-filesystem");
const { urlResolve } = require("gatsby-core-utils");

const debug = Debug("gatsby-theme-early-bird");
const withDefaults = require("./utils/default-options");

// Ensure that content directories exist at site-level
exports.onPreBootstrap = ({ store }, themeOptions) => {
  const { program } = store.getState();
  const { contentPath, assetPath } = withDefaults(themeOptions);

  const dirs = [
    path.join(program.directory, contentPath),
    path.join(program.directory, assetPath),
  ];

  dirs.forEach((dir) => {
    debug(`Initializing ${dir} directory`);
    if (!fs.existsSync(dir)) {
      mkdirp.sync(dir);
    }
  });
};

const remarkResolverPassthrough = (fieldName) => async (
  source,
  args,
  context,
  info
) => {
  const type = info.schema.getType("MarkdownRemark");
  const remarkNode = context.nodeModel.getNodeById({
    id: source.parent,
  });
  if (type.getFields()[fieldName].extensions.needsResolve) {
    const resolver = type.getFields()[fieldName].resolve;
    const result = await resolver(remarkNode, args, context, {
      fieldName,
    });
    return result;
  } else {
    return remarkNode[fieldName];
  }
};

exports.createSchemaCustomization = ({ actions, schema }) => {
  const { createTypes } = actions;
  createTypes(`interface BlogPost @nodeInterface {
      id: ID!
      title: String!
      html: String!
      slug: String!
      date: Date! @dateformat
      tags: [String]!
      keywords: [String]!
      excerpt: String!
      featuredImage: File
      fileRelativePath: String!
      rawFrontmatter: String!
      rawMarkdownBody: String!
  }`);

  createTypes(
    schema.buildObjectType({
      name: "RemarkBlogPost",
      fields: {
        id: { type: "ID!" },
        title: {
          type: "String!",
        },
        slug: {
          type: "String!",
        },
        date: { type: "Date!", extensions: { dateformat: {} } },
        tags: { type: "[String]!" },
        keywords: { type: "[String]!" },
        excerpt: {
          type: "String!",
          args: {
            pruneLength: {
              type: "Int",
              defaultValue: 140,
            },
          },
          resolve: remarkResolverPassthrough("excerpt"),
        },
        html: {
          type: "String!",
          resolve: remarkResolverPassthrough("html"),
        },
        featuredImage: { type: "File", extensions: { fileByRelativePath: {} } },
        fileRelativePath: {
          type: "String!",
          resolve: remarkResolverPassthrough("fileRelativePath"),
        },
        rawFrontmatter: {
          type: "String!",
          resolve: remarkResolverPassthrough("rawFrontmatter"),
        },
        rawMarkdownBody: {
          type: "String!",
          resolve: remarkResolverPassthrough("rawMarkdownBody"),
        },
        frontmatter: {
          type: "MarkdownRemarkFrontmatter",
          resolve: remarkResolverPassthrough("frontmatter"),
        },
      },
      interfaces: ["Node", "BlogPost"],
    })
  );
};

// Create fields for post slugs and source
// This will change with schema customization with work
exports.onCreateNode = async (
  { node, actions, getNode, createNodeId },
  themeOptions
) => {
  const { createNode, createParentChildLink } = actions;
  const { contentPath, basePath } = withDefaults(themeOptions);

  if (node.internal.type !== "MarkdownRemark") {
    return;
  }

  // Create source field (according to contentPath)
  const fileNode = getNode(node.parent);
  const source = fileNode.sourceInstanceName;

  if (node.internal.type === "MarkdownRemark" && source === contentPath) {
    let slug;
    if (node.frontmatter.slug) {
      if (path.isAbsolute(node.frontmatter.slug)) {
        // absolute paths take precedence
        slug = node.frontmatter.slug;
      } else {
        // otherwise a relative slug gets turned into a sub path
        slug = urlResolve(basePath, node.frontmatter.slug);
      }
    } else {
      // otherwise use the filepath function from gatsby-source-filesystem
      const filePath = createFilePath({
        node: fileNode,
        getNode,
        basePath: contentPath,
      });

      slug = urlResolve(basePath, filePath);
    }
    // normalize use of trailing slash
    slug = slug.replace(/\/*$/, "/");

    const fieldData = {
      title: node.frontmatter.title,
      tags: node.frontmatter.tags || [],
      slug,
      date: node.frontmatter.date,
      keywords: node.frontmatter.keywords || [],
      featuredImage: node.frontmatter.featured_image,
    };

    const remarkBlogPostId = createNodeId(`${node.id} >>> RemarkBlogPost`);
    await createNode({
      ...fieldData,
      // Required fields.
      id: remarkBlogPostId,
      parent: node.id,
      children: [],
      internal: {
        type: "RemarkBlogPost",
        contentDigest: crypto
          .createHash("md5")
          .update(JSON.stringify(fieldData))
          .digest("hex"),
        content: JSON.stringify(fieldData),
        description: "Remark implementation of the BlogPost interface",
      },
    });
    createParentChildLink({ parent: node, child: getNode(remarkBlogPostId) });
  }
};

// These templates are simply data-fetching wrappers that import components
const PostTemplate = require.resolve("./src/templates/post-query.ts");
const PostsTemplate = require.resolve("./src/templates/posts-query.ts");

exports.createPages = async ({ graphql, actions, reporter }, themeOptions) => {
  const { createPage } = actions;
  const { basePath } = withDefaults(themeOptions);

  const result = await graphql(`
    {
      allBlogPost(sort: { fields: [date, title], order: DESC }, limit: 1000) {
        edges {
          node {
            id
            slug
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panic(result.errors);
  }

  // Create Posts and Post pages.
  const { allBlogPost } = result.data;
  const posts = allBlogPost.edges;

  // Create a page for each Post
  posts.forEach(({ node: post }, index) => {
    const { slug } = post;
    createPage({
      path: slug,
      component: PostTemplate,
      context: {
        id: post.id,
      },
    });
  });

  // // Create the Posts page
  createPage({
    path: basePath,
    component: PostsTemplate,
    context: {},
  });
};
