import * as React from "react";
import renderer from "react-test-renderer";
import { useStaticQuery } from "gatsby";
import { HelmetProvider } from "react-helmet-async";
import Layout from "./Base";

beforeEach((): void => {
  (useStaticQuery as jest.Mock).mockImplementation((): object => ({
    site: {
      siteMetadata: {
        title: "Test Site",
        siteUrl: "https://example.dev"
      }
    }
  }));
});

describe("Base Layout", (): void => {
  it("renders correctly", (): void => {
    const context: { helmet?: any } = {};
    const tree = renderer
      .create(
        <HelmetProvider context={context}>
          <Layout>
            <span>Test</span>
          </Layout>
        </HelmetProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
    expect(context.helmet).toMatchSnapshot();
  });

  it("renders correctly with metadata provided", (): void => {
    const context: { helmet?: any } = {};
    const tree = renderer
      .create(
        <HelmetProvider context={context}>
          <Layout
            title="Test Post"
            location={
              {
                pathname: "/2016-11-9-test-post"
              } as any
            }
          >
            <span>Test</span>
          </Layout>
        </HelmetProvider>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
    expect(context.helmet).toMatchSnapshot();
  });
});
