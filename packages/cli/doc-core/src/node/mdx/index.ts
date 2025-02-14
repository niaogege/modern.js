import remarkGFM from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutoLink from 'rehype-autolink-headings';
import { Options } from '@mdx-js/loader';
import { UserConfig } from 'shared/types/index';
import { PluggableList } from 'unified';
import remarkPluginFrontMatter from 'remark-frontmatter';
import remarkPluginMDXFrontMatter from 'remark-mdx-frontmatter';
import rehypePluginExternalLinks from 'rehype-external-links';
import { remarkPluginContainer } from '@modern-js/remark-container';
import { remarkPluginToc } from './remarkPlugins/toc';
import { rehypePluginPreWrapper } from './rehypePlugins/preWrapper';
import { remarkPluginNormalizeLink } from './remarkPlugins/normalizeLink';
import { remarkCheckDeadLinks } from './remarkPlugins/checkDeadLink';

export async function createMDXOptions(
  userRoot: string,
  config: UserConfig,
  checkDeadLinks: boolean,
): Promise<Options> {
  const {
    remarkPlugins: remarkPluginsFromConfig = [],
    rehypePlugins: rehypePluginsFromConfig = [],
  } = config.doc?.markdown || {};
  const docPlugins = config.doc?.plugins || [];
  const remarkPluginsFromPlugins = docPlugins.flatMap(
    plugin => plugin.markdown?.remarkPlugins || [],
  ) as PluggableList;
  const rehypePluginsFromPlugins = docPlugins.flatMap(
    plugin => plugin.markdown?.rehypePlugins || [],
  ) as PluggableList;
  const defaultLang = config.doc?.lang || '';
  return {
    providerImportSource: '@mdx-js/react',
    remarkPlugins: [
      remarkPluginContainer,
      remarkGFM,
      remarkPluginFrontMatter,
      [remarkPluginMDXFrontMatter, { name: 'frontmatter' }],
      remarkPluginToc,
      [
        remarkPluginNormalizeLink,
        {
          base: config.doc?.base || '',
          defaultLang,
          root: userRoot,
        },
      ],
      checkDeadLinks && [
        remarkCheckDeadLinks,
        {
          root: userRoot,
          base: config.doc?.base || '',
        },
      ],
      ...remarkPluginsFromConfig,
      ...remarkPluginsFromPlugins,
    ].filter(Boolean) as PluggableList,
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutoLink,
        {
          properties: {
            class: 'header-anchor',
            ariaHidden: 'true',
          },
          content: {
            type: 'text',
            value: '#',
          },
        },
      ],
      rehypePluginPreWrapper,
      [
        rehypePluginExternalLinks,
        {
          target: '_blank',
          rel: 'noopener noreferrer',
        },
      ],
      ...rehypePluginsFromConfig,
      ...rehypePluginsFromPlugins,
    ],
  };
}
