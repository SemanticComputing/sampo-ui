import React from 'react'
import ResultTableCell from './ResultTableCell'
import { has } from 'lodash'
import Center from '../../../../.storybook/Center'
import PaperContainer from '../../../../.storybook/PaperContainer'

export default {
  component: ResultTableCell,
  title: 'Sampo-UI/facet_results/ResultTableCell',
  decorators: [storyFn => <Center><PaperContainer>{storyFn()}</PaperContainer></Center>]
}

const column = {
  externalLink: false,
  id: 'productionPlace',
  makeLink: true,
  minWidth: 200,
  numberedList: false,
  showSource: true,
  sortValues: true,
  sourceExternalLink: true,
  valueType: 'object'
}

const columnData = [
  {
    id: 'http://ldf.fi/mmm/place/tgn_7008038',
    prefLabel: 'Paris',
    source: {
      id: 'http://ldf.fi/schema/mmm/Bodley',
      prefLabel: 'Medieval Manuscripts in Oxford Libraries'
    },
    dataProviderUrl: '/places/page/tgn_7008038'
  },
  {
    id: 'http://ldf.fi/mmm/place/tgn_1000080',
    prefLabel: 'Italy',
    source: {
      id: 'http://ldf.fi/schema/mmm/Bodley',
      prefLabel: 'Medieval Manuscripts in Oxford Libraries'
    },
    dataProviderUrl: '/places/page/tgn_1000080'
  },
  {
    id: 'http://ldf.fi/mmm/place/tgn_1000070',
    prefLabel: 'France',
    source: {
      id: 'http://ldf.fi/schema/mmm/Bodley',
      prefLabel: 'Medieval Manuscripts in Oxford Libraries'
    },
    dataProviderUrl: '/places/page/tgn_1000070'
  }
]

export const collapsed = () => {
  return (
    <div style={{ width: 150 }}>
      <ResultTableCell
        key={column.id}
        columnId={column.id}
        data={columnData}
        valueType={column.valueType}
        makeLink={column.makeLink}
        externalLink={column.externalLink}
        sortValues={column.sortValues}
        sortBy={column.sortBy}
        numberedList={column.numberedList}
        minWidth={column.minWidth}
        container='div'
        expanded={false}
        linkAsButton={has(column, 'linkAsButton')
          ? column.linkAsButton
          : null}
        collapsedMaxWords={has(column, 'collapsedMaxWords')
          ? column.collapsedMaxWords
          : null}
        renderAsHTML={has(column, 'renderAsHTML')
          ? column.renderAsHTML
          : null}
      />
    </div>
  )
}

export const expanded = () => {
  return (
    <div style={{ width: 150 }}>
      <ResultTableCell
        key={column.id}
        columnId={column.id}
        data={columnData}
        valueType={column.valueType}
        makeLink={column.makeLink}
        externalLink={column.externalLink}
        sortValues={column.sortValues}
        sortBy={column.sortBy}
        numberedList={column.numberedList}
        minWidth={column.minWidth}
        container='div'
        expanded
        linkAsButton={has(column, 'linkAsButton')
          ? column.linkAsButton
          : null}
        collapsedMaxWords={has(column, 'collapsedMaxWords')
          ? column.collapsedMaxWords
          : null}
        renderAsHTML={has(column, 'renderAsHTML')
          ? column.renderAsHTML
          : null}
      />
    </div>
  )
}
