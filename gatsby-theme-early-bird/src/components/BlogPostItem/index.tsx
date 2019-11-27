import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { Card } from "starstuff-components";
import { BlogPosting, ImageObject } from "schema-dts";
import { JsonLd } from "react-schemaorg";
import { FluidObject, default as Image } from "gatsby-image";
import styled from "@emotion/styled";

const spanSeparatorCharacter = "⸱";
const spanSeparator = ` ${spanSeparatorCharacter} `;

const PostContainer = styled.article`
  display: flex;
  border: 1px solid;

  @media screen and (min-width: 512px) {
    min-height: 192px;
  }

  @media screen and (max-width: 512px) {
    flex-direction: column;
  }
`;

const FeaturedImage = styled.figure`
  height: 100%;
  min-width: 256px;

  @media screen and (max-width: 321px) {
    display: none;
  }
`;

const Info = styled(Card)`
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

interface Props {
  location: string;
  title: string;
  publishDate: string;
  wordCount?: string;
  minutesNeededToRead?: string;
  description: string;
  image?: FluidObject;
}

export const BlogPostItem = (props: Props): React.ReactElement<Props> => {
  const data = useStaticQuery(graphql`
    query EarlyBirdBlogPostItemQuery {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `);

  return (
    <PostContainer>
      <JsonLd<BlogPosting>
        item={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${data.site.siteMetadata.siteUrl}${props.location}`,
          headline: props.title,
          name: props.title,
          datePublished: props.publishDate,
          mainEntityOfPage: `${data.site.siteMetadata.siteUrl}${props.location}`,
          image: props.image && {
            "@type": "ImageObject",
            "@id": `${data.site.siteMetadata.siteUrl}${props.image.src}`
          }
        }}
      />
      {props.image && (
        <Link to={props.location}>
          <FeaturedImage>
            <JsonLd<ImageObject>
              item={{
                "@context": "https://schema.org",
                "@type": "ImageObject",
                "@id": `${data.site.siteMetadata.siteUrl}${props.image.src}`,
                representativeOfPage: false,
                contentUrl: props.image.src,
                url: props.image.src
              }}
            />
            <Image fluid={props.image} />
          </FeaturedImage>
        </Link>
      )}
      <Info
        title={props.title}
        location={props.location}
        customLinkComponent={(title, location): React.ReactElement => (
          <Link to={location}>
            <h2>{title}</h2>
          </Link>
        )}
        supporting={
          <>
            <div>
              <span>Published {props.publishDate}</span>
              {/* <span>{spanSeparator}</span>
          <span>{props.wordCount} words</span>
          <span>{spanSeparator}</span>
          <span>{props.minutesNeededToRead} minute read</span> */}
            </div>
          </>
        }
      />
    </PostContainer>
  );
};
