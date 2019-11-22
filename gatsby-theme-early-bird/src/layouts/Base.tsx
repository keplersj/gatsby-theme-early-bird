import * as React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";
import { ListItem, BreadcrumbList } from "schema-dts";
import "modern-normalize";
import "starstuff-style";
import { JsonLd } from "react-schemaorg";

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
              "@context": "https://schema.org/",
              "@type": "BreadcrumbList",
              itemListElement: props.location.pathname
                // Remove Trailing Slash
                .substr(0, props.location.pathname.length - 1)
                // Break the path down to its (assumed hiearchy)
                .split("/")
                // Assuming every part of the path is a page, create all of the paths
                .reduce((accumulator, value, currentIndex, array) => {
                  if (accumulator.length === 0) {
                    accumulator.push(["/", data.site.siteMetadata.title]);
                  } else {
                    accumulator.push([
                      `${accumulator[accumulator.length - 1][0]}${value}/`,
                      // If we're on the last crumb in the trail and there is a page title, use it. Otherwise...
                      currentIndex === array.length - 1 && props.title
                        ? props.title
                        : // Take the value we have and capitalize it
                          `${value[0].toUpperCase()}${value.slice(1)}`
                    ]);
                  }
                  return accumulator;
                }, [] as [string, string][])
                // Make the path a schema.org ListItem
                .map(
                  ([part, name], index): ListItem => ({
                    "@type": "ListItem",
                    position: index + 1,
                    item: {
                      "@id": `${data.site.siteMetadata.siteUrl}${part}`,
                      "@type": "WebPage",
                      name
                    }
                  })
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
