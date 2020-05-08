import React from 'react';
import TextPage from '../src/client/components/main_layout/TextPage'
import Typography from '@material-ui/core/Typography'

export default {
    title: 'Sampo-UI/introduction'
  }

export const welcome = () => 
    <TextPage>
        <Typography component='h1' variant='h2'>Welcome to Sampo-UI</Typography>
        <Typography paragraph>
            This Storybook is used for documenting the reusable component library of 
            the Sampo-UI framework. These components are designed for building user interfaces for semantic portals.
        </Typography>
        <Typography paragraph>
            The source code of Sampo-UI is published on <a target='_blank' href='https://github.com/SemanticComputing/sampo-ui'>GitHub</a>. 
            The folders in this Storybook reflect the <a target='_blank' href='https://github.com/SemanticComputing/sampo-ui/tree/master/src/client/components'>folders</a> in 
            the GitHub repository, where the components are split into four categories:
        </Typography>
        <ul>
            <li><Typography>facet_bar</Typography></li>
            <li><Typography>facet_results</Typography></li>
            <li><Typography>main_layout</Typography></li>
            <li><Typography>perspectives</Typography></li>
        </ul>
    </TextPage>