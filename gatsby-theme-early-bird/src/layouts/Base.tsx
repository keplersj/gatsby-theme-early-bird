import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useStaticQuery, graphql } from "gatsby";
import { ListItem, BreadcrumbList } from "schema-dts";
import "modern-normalize";
import "starstuff-style";
import { JsonLd } from "react-schemaorg";
import { breakdownURIPath } from "uri-path-breakdown";
import { WindowLocation } from "@reach/router";

interface Props {
  title?: string;
  description?: string;
  location?: WindowLocation;
}

const BaseLayout = (
  properties: React.PropsWithChildren<Props>
): React.ReactElement<React.PropsWithChildren<Props>> => {
  const data = useStaticQuery(graphql`
    query EarlyBirdBaseLayoutData {
      site {
        siteMetadata {
          title
          siteUrl
        }
      }
    }
  `);

  return (
    <main>
      <Helmet
        titleTemplate={`%s | ${data.site.siteMetadata.title}`}
        defaultTitle={data.site.siteMetadata.title}
      >
        <html lang="en" />
        {properties.title && <title>{properties.title}</title>}
        {properties.description && (
          <meta name="description" content={properties.description} />
        )}
        <meta
          property="og:title"
          content={
            (properties.title &&
              `${properties.title} | ${data.site.siteMetadata.title}`) ||
            data.site.siteMetadata.title
          }
        />
        {properties.description && (
          <meta property="og:description" content={properties.description} />
        )}
      </Helmet>

      {properties.location && (
        <JsonLd<BreadcrumbList>
          item={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: breakdownURIPath(properties.location.pathname).map(
              (segment, index, baseArray): ListItem => {
                const getName = (): string => {
                  if (segment === "/") {
                    return data.site.siteMetadata.title;
                  } else if (
                    index === baseArray.length - 1 &&
                    properties.title
                  ) {
                    return properties.title;
                  }

                  const [splitSegment] = segment
                    .split("/")
                    .filter((value) => value != "")
                    .slice(-1);
                  return `${splitSegment[0].toUpperCase()}${splitSegment.slice(
                    1
                  )}`;
                };

                return {
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@id": `${data.site.siteMetadata.siteUrl}${segment}`,
                    "@type": "WebPage",
                    name: getName(),
                  },
                };
              }
            ),
          }}
        />
      )}

      {properties.children}
    </main>
  );
};

export default BaseLayout;
