const gatsbyTinaCMSRemark = jest.requireActual("gatsby-tinacms-remark");

export const remarkForm = jest
  .fn()
  .mockImplementation((component) => component);

export const RemarkCreatorPlugin = gatsbyTinaCMSRemark.RemarkCreatorPlugin;
