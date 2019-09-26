import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../../layouts/Base";
import { Helmet } from "react-helmet";
import { MDXRenderer } from "gatsby-plugin-mdx";
import { getDescription } from "../../util";

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
    };
  };
}

export const PostTemplate = (props: Props): React.ReactElement<Props> => {
  const post = props.data.blogPost;

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "http://www.schema.org",
            "@type": "WebPage",
            name: `${post.title} | Kepler Sticka-Jones`,
            // description: getDescription(post.excerpt, post.description),
            description: post.excerpt,
            url: post.slug,
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
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  item: {
                    "@id": `https://keplersj.com${post.slug}`,
                    name: post.title
                  }
                }
              ]
            },
            about: {
              "@type": "BlogPosting",
              headline: post.title,
              name: post.title,
              // description: getDescription(post.excerpt, post.description),
              description: post.excerpt,
              // wordCount: post.wordCount.words,
              datePublished: post.date,
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
            }
          })}
        </script>
      </Helmet>

      <BaseLayout
        title={post.title}
        // description={getDescription(post.excerpt, post.description)}
        description={post.excerpt}
      >
        <Post>
          <header>
            <h1>{post.title}</h1>
            <div>
              <span>Published {post.date}</span>
              {/* <span>{" | "}</span>
              <span>{post.words} words</span>
              <span>{" | "}</span>
              <span>{post.timeToRead} minute read</span> */}
            </div>
          </header>
          {/* <br /> */}
          <MDXRenderer>{post.body}</MDXRenderer>
        </Post>
      </BaseLayout>
    </>
  );
};
