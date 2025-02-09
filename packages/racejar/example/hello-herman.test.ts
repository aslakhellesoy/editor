import {expect} from 'vitest'
import {After, Before} from '../src/hooks'
import {Given, Then, When} from '../src/step-definitions'
import {Feature} from '../src/vitest'

function greet(prefix: string, greeting: string, name: string) {
  return `${prefix} ${name}, ${greeting}`
}

type Context = {
  greetingPrefix: string
  person: string
  greeting: string
}

Feature({
  featureText: `
    Feature: Greeting
      Scenario: Greeting a person
        Given the person "Herman"
        When greeting the person with:
          | how are you? |
        Then the greeting is "Hello Herman, how are you?"`,
  hooks: [
    Before((context: Context) => {
      context.greetingPrefix = 'Hello'
    }),
    After((context: Context) => {
      expect(context.greeting).toBe('Hello Herman, how are you?')
    }),
  ],
  stepDefinitions: [
    Given('the person {string}', (context: Context, person: string) => {
      context.person = person
    }),
    When(
      'greeting the person with:',
      (context: Context, greeting: string[][]) => {
        context.greeting = greet(
          context.greetingPrefix,
          greeting[0][0],
          context.person,
        )
      },
    ),
    Then('the greeting is {string}', (context: Context, greeting: string) => {
      expect(context.greeting).toBe(greeting)
    }),
  ],
})
