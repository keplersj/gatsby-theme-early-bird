import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../../layouts/Base";
import { Helmet } from "react-helmet";
import { MDXRenderer } from "gatsby-plugin-mdx";
import Image, { FluidObject } from "gatsby-image";
import { getDescription } from "../../util";
import { BlogPosting } from "schema-dts";
import { useStaticQuery, graphql } from "gatsby";

const Post = styled.article`
  max-width: 55em;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 55em) {
    margin-left: 2em;
    margin-right: 2em;
  }
`;

interface Props {
  data: {
    blogPost: {
      id: string;
      excerpt: string;
      body: any;
      slug: string;
      title: string;
      tags: string[];
      keywords: string[];
      date: string;
      featuredImage?: {
        childImageSharp: {
          fluid: FluidObject;
        };
      };
    };
  };

  location: {
    key: string;
    pathname: string;
    search: string;
    hash: string;
    state: object;
  };
}

export const PostTemplate = (props: Props): React.ReactElement<Props> => {
  const post = props.data.blogPost;
  const staticQuery = useStaticQuery(graphql`
    query EarlyBirdPostQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  return (
    <BaseLayout
      title={post.title}
      // description={getDescription(post.excerpt, post.description)}
      description={post.excerpt}
    >
      <Post>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "http://www.schema.org",
              "@type": "BlogPosting",
              "@id": `${staticQuery.site.siteMetadata.siteUrl}${props.location.pathname}`,
              url: `${staticQuery.site.siteMetadata.siteUrl}${props.location.pathname}`,
              headline: post.title,
              name: post.title,
              datePublished: post.date,
              image:
                post.featuredImage &&
                `${staticQuery.site.siteMetadata.siteUrl}${post.featuredImage.childImageSharp.fluid.src}`
            } as BlogPosting)
          }}
        />
        <header>
          <h1>{post.title}</h1>
          <div>
            <span>Published {post.date}</span>
            {/* <span>{" | "}</span>
              <span>{post.words} words</span>
              <span>{" | "}</span>
              <span>{post.timeToRead} minute read</span> */}
          </div>
          {post.featuredImage && (
            <figure>
              <Image fluid={post.featuredImage.childImageSharp.fluid} />
            </figure>
          )}
        </header>
        <MDXRenderer>{post.body}</MDXRenderer>
      </Post>
    </BaseLayout>
  );
};
