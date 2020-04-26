import { RemarkCreatorPlugin } from "gatsby-tinacms-remark";
import slugify from "slugify";

interface Form {
  title: string;
  date: Date;
}

export const CreatePostPlugin = new RemarkCreatorPlugin({
  label: "New Blog Post",
  filename: (form: Form) => {
    return `content/posts/${form.date.getFullYear()}-${form.date.getMonth()}-${form.date.getDate()}-${slugify(
      form.title,
      { lower: true }
    )}.md`;
  },
  fields: [
    {
      name: "title",
      label: "Title",
      component: "text",
      defaultValue: "New Blog Post",
    },
    {
      name: "date",
      label: "Date",
      component: "date",
      defaultValue: new Date(),
    },
  ],
  frontmatter: (form: Form) => ({
    title: form.title,
    date: form.date,
  }),
  body: () => `This is a new blog post. Please write some content.`,
});
