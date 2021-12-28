import { useContext, useMemo, useEffect, useState } from 'react'

import cn from 'classnames'
import { MDXRemote } from 'next-mdx-remote'
import { IPrecompiled, IPrecompiledDoc, IPrecompiledGasDoc } from 'types'

import { EthereumContext } from 'context/ethereumContext'

import { GITHUB_REPO_URL } from 'util/constants'
import { parseGasPrices, findMatchingForkName } from 'util/gas'

import * as Doc from 'components/ui/Doc'

import DynamicFee from './DynamicFee'

type Props = {
  precompiledDoc: IPrecompiledDoc
  precompiled: IPrecompiled
  gasDocs: IPrecompiledGasDoc
  dynamicFeeForkName: string
}

const docComponents = {
  h1: Doc.H1,
  h2: Doc.H2,
  h3: Doc.H3,
  p: Doc.P,
  ul: Doc.UL,
  ol: Doc.OL,
  li: Doc.LI,
  table: Doc.Table,
  th: Doc.TH,
  td: Doc.TD,
  a: Doc.A,
  pre: Doc.Pre,
}

const API_DYNAMIC_FEE_DOC_URL = '/api/getDynamicDoc'

const DocRow = ({
  precompiledDoc,
  precompiled,
  gasDocs,
  dynamicFeeForkName,
}: Props) => {
  const { common, forks, selectedFork } = useContext(EthereumContext)
  const [dynamicFeeDocMdx, setDynamicFeeDocMdx] = useState()

  const dynamicFeeDoc = useMemo(() => {
    if (!gasDocs) {
      return null
    }
    const fork = findMatchingForkName(forks, Object.keys(gasDocs), selectedFork)
    return fork && common ? parseGasPrices(common, gasDocs[fork]) : null
  }, [forks, selectedFork, gasDocs, common])

  useEffect(() => {
    let controller: AbortController | null = new AbortController()

    const fetchDynamicFeeDoc = async () => {
      try {
        const response = await fetch(API_DYNAMIC_FEE_DOC_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: dynamicFeeDoc }),
          signal: controller?.signal,
        })
        const data = await response.json()
        setDynamicFeeDocMdx(data.mdx)
        controller = null
      } catch (error) {
        setDynamicFeeDocMdx(undefined)
      }
    }

    if (dynamicFeeDoc) {
      fetchDynamicFeeDoc()
    }

    return () => controller?.abort()
  }, [dynamicFeeDoc])

  return (
    <div className="text-sm px-4 md:px-8 py-8 bg-indigo-50 dark:bg-black-600">
      {precompiledDoc && (
        <>
          <table className="table-auto mb-6 bg-indigo-100 dark:bg-black-500 rounded font-medium">
            <thead>
              <tr className="text-gray-500 uppercase text-xs">
                <td className="pt-3 px-4">Since</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="pb-3 px-4">{precompiledDoc.fork}</td>
              </tr>
            </tbody>
          </table>

          <div className="flex flex-col lg:flex-row">
            <div
              className={cn({
                'flex-1 lg:pr-8': precompiled.dynamicFee,
              })}
            >
              <MDXRemote
                {...precompiledDoc.mdxSource}
                components={docComponents}
              />
              {dynamicFeeForkName && dynamicFeeDocMdx && (
                <MDXRemote {...dynamicFeeDocMdx} components={docComponents} />
              )}
            </div>

            {dynamicFeeForkName && (
              <DynamicFee precompiled={precompiled} fork={dynamicFeeForkName} />
            )}
          </div>
        </>
      )}
      {!precompiledDoc && (
        <div>
          There is no reference doc for this precompiled yet. Why not{' '}
          <a
            className="underline font-medium"
            href={`${GITHUB_REPO_URL}/new/main/docs/precompiled`}
            target="_blank"
            rel="noreferrer"
          >
            contribute?
          </a>{' '}
          ;)
        </div>
      )}
    </div>
  )
}

export default DocRow
