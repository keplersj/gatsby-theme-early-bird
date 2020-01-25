import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { Card } from "starstuff-components";
import { BlogPosting, ImageObject } from "schema-dts";
import { JsonLd } from "react-schemaorg";
import { FluidObject, default as Image } from "gatsby-image";
import styled from "@emotion/styled";

const spanSeparatorCharacter = "⸱";
const spanSeparator = ` ${spanSeparatorCharacter} `;

const PostContainer = styled(Card)`
  display: flex;

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

const StyledImage = styled(Image)`
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;

  @media screen and (max-width: 512px) {
    border-bottom-left-radius: 0;
    border-top-right-radius: 10px;
  }
`;

const Info = styled.div`
  margin: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

interface Props {
  location: string;
  title: string;
  publishDate: string;
  isoDate: string;
  wordCount?: string;
  minutesNeededToRead?: string;
  description: string;
  image?: FluidObject;
}

export const BlogPostItem = (properties: Props): React.ReactElement<Props> => {
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
          "@id": `${data.site.siteMetadata.siteUrl}${properties.location}`,
          headline: properties.title,
          name: properties.title,
          datePublished: properties.isoDate,
          mainEntityOfPage: `${data.site.siteMetadata.siteUrl}${properties.location}`,
          image: properties.image && {
            "@type": "ImageObject",
            "@id": `${data.site.siteMetadata.siteUrl}${properties.image.src}`
          }
        }}
      />
      {properties.image && (
        <Link to={properties.location}>
          <FeaturedImage>
            <JsonLd<ImageObject>
              item={{
                "@context": "https://schema.org",
                "@type": "ImageObject",
                "@id": `${data.site.siteMetadata.siteUrl}${properties.image.src}`,
                representativeOfPage: false,
                contentUrl: properties.image.src,
                url: properties.image.src
              }}
            />
            <StyledImage fluid={properties.image} />
          </FeaturedImage>
        </Link>
      )}
      <Info>
        <Link to={properties.location}>
          <h2>{properties.title}</h2>
        </Link>
        <span>Published {properties.publishDate}</span>
        {/* <span>{spanSeparator}</span>
        <span>{props.wordCount} words</span>
        <span>{spanSeparator}</span>
        <span>{props.minutesNeededToRead} minute read</span> */}
        <p>{properties.description}</p>
      </Info>
    </PostContainer>
  );
};
