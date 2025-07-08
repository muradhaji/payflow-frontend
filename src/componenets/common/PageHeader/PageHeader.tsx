import type { ReactNode } from 'react';
import { Title, Breadcrumbs, Box, Flex, Anchor } from '@mantine/core';
import { Link } from 'react-router-dom';
import utilStyles from '../../../styles/utils.module.css';

type BreadcrumbItem = {
  label: string;
  to: string;
  active?: boolean;
};

type Props = {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode | ReactNode[];
};

const PageHeader = ({ title, breadcrumbs = [], actions = [] }: Props) => {
  return (
    <Box mb='lg' className={utilStyles.noSelect}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs separator={<Box c='dimmed'>/</Box>} mb='xs'>
          {breadcrumbs.map((item) =>
            item.active ? (
              <Box component='span' c='dimmed' key={item.to || item.label}>
                {item.label}
              </Box>
            ) : (
              <Anchor component={Link} to={item.to} key={item.to || item.label}>
                {item.label}
              </Anchor>
            )
          )}
        </Breadcrumbs>
      )}

      <Flex
        direction={{ base: 'column', sm: 'row' }}
        justify='space-between'
        align={{ base: 'stretch', sm: 'center' }}
        gap='xs'
      >
        <Title order={2}>{title}</Title>
        {actions && (
          <Flex justify='flex-end' wrap='wrap' gap='xs'>
            {Array.isArray(actions) ? (
              actions.map((action, index) => <Box key={index}>{action}</Box>)
            ) : (
              <Box>{actions}</Box>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default PageHeader;
