import type {ParameterType} from '@cucumber/cucumber-expressions'
import {test, type BrowserContext, type Page} from '@playwright/test'
import {compileFeature} from '../compile-feature'
import type {Hook} from '../hooks'
import type {StepDefinition} from '../step-definitions'

/**
 * @public
 */
export type PlaywrightContext = {
  playwright: {
    page: Page
    context: BrowserContext
  }
}

/**
 * @public
 */
export function Feature<
  TContext extends PlaywrightContext = PlaywrightContext,
>({
  featureText,
  hooks,
  stepDefinitions,
  parameterTypes,
}: {
  featureText: string
  hooks: Array<Hook<TContext>>
  stepDefinitions: Array<StepDefinition<TContext, any, any, any>>
  parameterTypes?: Array<ParameterType<unknown>>
}) {
  const feature = compileFeature({
    featureText,
    hooks,
    stepDefinitions,
    parameterTypes,
  })

  const describeFn =
    feature.tag === 'only'
      ? test.describe.only
      : feature.tag === 'skip'
        ? test.describe.skip
        : test.describe

  describeFn(feature.name, () => {
    for (const scenario of feature.scenarios) {
      const testFn =
        scenario.tag === 'only'
          ? test.only
          : scenario.tag === 'skip'
            ? test.skip
            : test

      testFn(scenario.name, async ({page, context}) => {
        for (const step of scenario.steps) {
          await step({
            playwright: {
              page,
              context,
            },
          })
        }
      })
    }
  })
}
