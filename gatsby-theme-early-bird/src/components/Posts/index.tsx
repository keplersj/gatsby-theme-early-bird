import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../../layouts/Base";
import { BlogPostItem as Post } from "../BlogPostItem";
import { getDescription } from "../../util";
import { Blog, BlogPosting } from "schema-dts";
import { useStaticQuery, graphql } from "gatsby";
import { JsonLd } from "react-schemaorg";
import { FluidObject } from "gatsby-image";

const PostsContainer = styled.div`
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
    allBlogPost: {
      edges: {
        node: {
          id: string;
          excerpt: string;
          slug: string;
          title: string;
          isoDate: string;
          date: string;
          featuredImage?: {
            childImageSharp: {
              fluid: FluidObject;
            };
          };
        };
      }[];
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

export const Posts = ({ data, location }: Props): React.ReactElement<Props> => {
  const staticQuery = useStaticQuery(graphql`
    query EarlyBirdPostsQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  return (
    <BaseLayout title="Blog" location={location}>
      <PostsContainer>
        <JsonLd<Blog>
          item={{
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${staticQuery.site.siteMetadata.siteUrl}${location.pathname}`,
            blogPost: data.allBlogPost.edges.map(
              ({ node: post }): BlogPosting => ({
                "@type": "BlogPosting",
                "@id": `${staticQuery.site.siteMetadata.siteUrl}${post.slug}`
              })
            )
          }}
        />
        <h1>Blog</h1>
        <div>
          {data.allBlogPost.edges.map(
            ({ node: post }): React.ReactElement => (
              <Post
                key={post.id}
                location={post.slug}
                title={post.title}
                publishDate={post.date}
                isoDate={post.isoDate}
                // wordCount={post.wordCount.words}
                // minutesNeededToRead={post.timeToRead}
                description={getDescription(
                  post.excerpt
                  // post.frontmatter.description
                )}
                image={
                  post.featuredImage && post.featuredImage.childImageSharp.fluid
                }
              />
            )
          )}
        </div>
      </PostsContainer>
    </BaseLayout>
  );
};
