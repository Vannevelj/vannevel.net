import React from 'react';
import Helmet from 'react-helmet';
import ProjectTemplateDetails from '../components/ProjectTemplateDetails';

class ProjectTemplate extends React.Component {
  render() {
    const siteMetadata = this.props.data.site.siteMetadata;
    const { title, subtitle } = siteMetadata;
    const project = this.props.data.markdownRemark;
    const { title: projectTitle, description: projectDescription } = project.frontmatter;
    const description = projectDescription !== null ? projectDescription : subtitle;

    return (
      <div>
        <Helmet>
          <title>{`${projectTitle} - ${title}`}</title>
          <meta name="description" content={description} />
        </Helmet>
        <ProjectTemplateDetails siteMetadata={siteMetadata} project={project} />
      </div>
    );
  }
}

export default ProjectTemplate;

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        subtitle
        author {
          name
          twitter
        }
        disqusShortname
        url
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      html
      fields {
        tagSlugs
      }
      frontmatter {
        title
        tags
        date
        description
        url
      }
    }
  }
`;
