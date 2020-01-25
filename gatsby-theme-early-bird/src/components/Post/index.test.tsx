import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import { PostTemplate } from ".";
import { WindowLocation } from "@reach/router";
import { HelmetProvider } from "react-helmet-async";

describe("Post Page Component", () => {
  beforeEach(() => {
    (useStaticQuery as jest.Mock).mockImplementation((): object => ({
      site: {
        siteMetadata: {
          title: "Test Site",
          siteUrl: "http://example.dev"
        }
      }
    }));
  });

  it("renders as expected (with a featured image)", () => {
    const helmetContext: { helmet?: {} } = {};
    const tree = renderer.create(
      <HelmetProvider context={helmetContext}>
        <PostTemplate
          data={{
            blogPost: {
              id: "42",
              excerpt: "This is a sample from a test post",
              html:
                "<span>This is a sample from a test post</span><p>The quick brown fox jumped over the lazy dog.</p>",
              slug: "/2019-12-14-test-post-with-featured-image",
              title: "Test Post (with Featured Image)",
              tags: [],
              keywords: [],
              isoDate: "2019-12-14",
              date: "Dec 24, 2019",
              featuredImage: {
                childImageSharp: {
                  fluid: {
                    aspectRatio: 1,
                    src: "/static/example_image_1_hash/1/example_image.jpeg",
                    srcSet:
                      "/static/example_image_1_hash/1/example_image.jpeg 1x",
                    sizes: "(max-width: 512px)"
                  }
                }
              }
            }
          }}
          location={
            {
              pathname: "/2019-12-14-test-post-with-featured-image"
            } as WindowLocation
          }
        />
      </HelmetProvider>
    );
    expect(tree).toMatchSnapshot();
    expect(helmetContext.helmet).toMatchSnapshot();
  });

  it("renders as expected (without a featured image)", () => {
    const helmetContext: { helmet?: {} } = {};
    const tree = renderer.create(
      <HelmetProvider context={helmetContext}>
        <PostTemplate
          data={{
            blogPost: {
              id: "42",
              excerpt: "This is a sample from a test post",
              html:
                "<span>This is a sample from a test post</span><p>The quick brown fox jumped over the lazy dog.</p>",
              slug: "/2019-12-14-test-post-with-featured-image",
              title: "Test Post (without Featured Image)",
              tags: [],
              keywords: [],
              isoDate: "2019-12-14",
              date: "Dec 24, 2019"
            }
          }}
          location={
            {
              pathname: "/2019-12-14-test-post-with-featured-image"
            } as WindowLocation
          }
        />
      </HelmetProvider>
    );
    expect(tree).toMatchSnapshot();
    expect(helmetContext.helmet).toMatchSnapshot();
  });
});
