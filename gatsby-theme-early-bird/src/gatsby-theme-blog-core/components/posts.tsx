import React from "react";
import { graphql } from "gatsby";
import styled from "@emotion/styled";
import BaseLayout from "../../layouts/Base";
import { Helmet } from "react-helmet";
import { BlogPostItem as Post } from "../../components/BlogPostItem";
import { getDescription } from "../../util";

const Posts = styled.div`
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
          body: any;
          slug: string;
          title: string;
          tags: string[];
          keywords: string[];
          date: string;
        };
      }[];
    };
  };
}

const BlogPage = ({ data }: Props): React.ReactElement<Props> => (
  <>
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "http://www.schema.org",
          "@type": "CollectionPage",
          name: "Blog | Kepler Sticka-Jones",
          url: "/blog",
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@id": "https://keplersj.com/",
                  name: "Kepler Sticka-Jones"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@id": "https://keplersj.com/blog/",
                  name: "Blog"
                }
              }
            ]
          },
          about: {
            "@type": "Blog",
            url: "/blog",
            blogPosts: data.allBlogPost.edges.map(({ node: post }): object => ({
              "@type": "BlogPosting",
              url: post.slug,
              name: post.title,
              headline: post.title,
              datePublished: post.date,
              // wordCount: post.wordCount.words,
              description: getDescription(
                post.excerpt
                // post.frontmatter.description
              ),
              author: {
                "@type": "Person",
                name: "Kepler Sticka-Jones",
                url: "https://keplersj.com"
              },
              publisher: {
                "@type": "Person",
                name: "Kepler Sticka-Jones",
                url: "https://keplersj.com"
              }
            }))
          }
        })}
      </script>
    </Helmet>

    <BaseLayout title="Blog">
      <Posts>
        <h1>Blog</h1>
        <div>
          {data.allBlogPost.edges.map(
            ({ node: post }): React.ReactElement => (
              <Post
                key={post.id}
                location={post.slug}
                title={post.title}
                publishDate={post.date}
                // wordCount={post.wordCount.words}
                // minutesNeededToRead={post.timeToRead}
                description={getDescription(
                  post.excerpt
                  // post.frontmatter.description
                )}
              />
            )
          )}
        </div>
      </Posts>
    </BaseLayout>
  </>
);

export default BlogPage;
