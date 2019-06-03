import React from 'react';
import Helmet from 'react-helmet';
import Sidebar from '../components/Sidebar';
import Project from '../components/Project';

class ProjectsRoute extends React.Component {
  render() {
    const { title, subtitle } = this.props.data.site.siteMetadata;
    const projects = this.props.data.allMarkdownRemark.edges;
    const items = projects.map(project =>
      (<Project data={project} key={project.node.fields.slug} />)
    );

    return (
      <div>
        <Helmet>
          <title>{title}</title>
          <meta name="description" content={subtitle} />
        </Helmet>
        <Sidebar siteMetadata={this.props.data.site.siteMetadata} />
        <div className="content">
          <div className="content__inner">
            {items}
          </div>
        </div>
      </div>
    );
  }
}

export default ProjectsRoute;

export const pageQuery = graphql`
  query ProjectsQuery {
    site {
      siteMetadata {
        ...sidebarFragment
      }
    }
    allMarkdownRemark(
        limit: 1000,
        filter: { frontmatter: { layout: { eq: "project" }, draft: { ne: true } } },
        sort: { order: DESC, fields: [frontmatter___date] }
      ){
      edges {
        node {
          fields {
            slug
            categorySlug
            tagSlugs
          }
          frontmatter {
            title
            date
            category
            description
            url
            tags
          }
        }
      }
    }
  }
`;
