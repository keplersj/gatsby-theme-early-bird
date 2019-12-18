import * as React from "react";
import { Helmet } from "react-helmet-async";
import { useStaticQuery, graphql } from "gatsby";
import { ListItem, BreadcrumbList } from "schema-dts";
import "modern-normalize";
import "starstuff-style";
import { JsonLd } from "react-schemaorg";
import { breakdownURIPath } from "uri-path-breakdown";

interface Props {
  title?: string;
  description?: string;
  location?: {
    key: string;
    pathname: string;
    search: string;
    hash: string;
    state: object;
  };
}

const BaseLayout = (
  props: React.PropsWithChildren<Props>
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
        {props.title && <title>{props.title}</title>}
        {props.description && (
          <meta name="description" content={props.description} />
        )}
        <meta
          property="og:title"
          content={
            (props.title &&
              `${props.title} | ${data.site.siteMetadata.title}`) ||
            data.site.siteMetadata.title
          }
        />
        {props.description && (
          <meta property="og:description" content={props.description} />
        )}

        {props.location && (
          <JsonLd<BreadcrumbList>
            item={{
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: breakdownURIPath(props.location.pathname).map(
                (segment, index, baseArray): ListItem => {
                  const getName = (): string => {
                    if (segment === "/") {
                      return data.site.siteMetadata.title;
                    } else if (index === baseArray.length - 1 && props.title) {
                      return props.title;
                    }

                    const [splitSegment] = segment
                      .split("/")
                      .filter(value => value != "")
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
                      name: getName()
                    }
                  };
                }
              )
            }}
          />
        )}
      </Helmet>

      {props.children}
    </main>
  );
};

export default BaseLayout;
