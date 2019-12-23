import React from "react";
import styled from "@emotion/styled";
import BaseLayout from "../../layouts/Base";
import Image, { FluidObject } from "gatsby-image";
import { BlogPosting, ImageObject } from "schema-dts";
import { useStaticQuery, graphql, PageRendererProps } from "gatsby";
import { JsonLd } from "react-schemaorg";
import { Helmet } from "react-helmet-async";

const Post = styled.article`
  max-width: 55em;
  margin-left: auto;
  margin-right: auto;

  @media (max-width: 55em) {
    margin-left: 2em;
    margin-right: 2em;
  }
`;

interface Props extends PageRendererProps {
  data: {
    blogPost: {
      id: string;
      excerpt: string;
      html: string;
      slug: string;
      title: string;
      tags: string[];
      keywords: string[];
      isoDate: string;
      date: string;
      featuredImage?: {
        childImageSharp: {
          fluid: FluidObject;
        };
      };
    };
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
      location={props.location}
    >
      <Helmet>
        <meta property="og:type" content="article" />
        <meta
          property="article:published_time"
          content={props.data.blogPost.isoDate}
        />

        {props.data.blogPost.featuredImage && (
          <>
            <meta
              property="og:image"
              content={
                props.data.blogPost.featuredImage.childImageSharp.fluid.src
              }
            />
            <meta property="og:image:width" content="7680" />
            <meta property="og:image:height" content="4320" />
          </>
        )}
      </Helmet>
      <Post>
        <JsonLd<BlogPosting>
          item={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${staticQuery.site.siteMetadata.siteUrl}${props.location.pathname}`,
            url: `${staticQuery.site.siteMetadata.siteUrl}${props.location.pathname}`,
            headline: post.title,
            name: post.title,
            datePublished: post.isoDate,
            mainEntityOfPage: `${staticQuery.site.siteMetadata.siteUrl}${props.location.pathname}`,
            image: post.featuredImage && {
              "@type": "ImageObject",
              "@id": `${staticQuery.site.siteMetadata.siteUrl}${post.featuredImage.childImageSharp.fluid.src}`
            }
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
            <figure id="featured-image">
              <JsonLd<ImageObject>
                item={{
                  "@context": "https://schema.org",
                  "@type": "ImageObject",
                  "@id": `${staticQuery.site.siteMetadata.siteUrl}${post.featuredImage.childImageSharp.fluid.src}`,
                  representativeOfPage: true,
                  contentUrl: post.featuredImage.childImageSharp.fluid.src,
                  url: post.featuredImage.childImageSharp.fluid.src
                }}
              />
              <Image fluid={post.featuredImage.childImageSharp.fluid} />
            </figure>
          )}
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
      </Post>
    </BaseLayout>
  );
};

export const fragment = graphql`
  fragment EarlyBirdPostPage on BlogPost {
    id
    excerpt
    html
    slug
    title
    tags
    keywords
    isoDate: date
    date(formatString: "MMMM DD, YYYY")
    featuredImage {
      childImageSharp {
        # Generate Picture up to 8K 16:9 ratio, crop and cover as appropriate
        fluid(
          maxWidth: 7680
          maxHeight: 4320
          cropFocus: CENTER
          fit: COVER
          srcSetBreakpoints: [
            256
            512
            768
            1024
            # 720p
            1280
            # 1080p
            1920
            # 4k
            3840
            # 5k
            5120
            # 8k
            7680
          ]
        ) {
          ...GatsbyImageSharpFluid
        }
      }
    }
  }
`;
