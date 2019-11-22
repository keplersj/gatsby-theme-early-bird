import * as React from "react";
import { Link, useStaticQuery, graphql } from "gatsby";
import { Card } from "starstuff-components";
import { BlogPosting } from "schema-dts";
import { JsonLd } from "react-schemaorg";

const spanSeparatorCharacter = "⸱";
const spanSeparator = ` ${spanSeparatorCharacter} `;

interface Props {
  location: string;
  title: string;
  publishDate: string;
  wordCount?: string;
  minutesNeededToRead?: string;
  description: string;
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
    <Card
      title={props.title}
      location={props.location}
      customLinkComponent={(title, location): React.ReactElement => (
        <Link to={location}>
          <h2>{title}</h2>
        </Link>
      )}
      supporting={
        <>
          <JsonLd<BlogPosting>
            item={{
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "@id": `${data.site.siteMetadata.siteUrl}${props.location}`,
              headline: props.title,
              name: props.title,
              datePublished: props.publishDate,
              mainEntityOfPage: `${data.site.siteMetadata.siteUrl}${props.location}`
            }}
          />
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
  );
};
