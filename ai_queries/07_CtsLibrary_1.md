You have been helping me with a project to implement a Javascript code library for the CITE Architecture. The project is in a repository at: <https://github.com/Eumaeus/cite-architecture.js>.

The point of all of this work is to enable building cool, useful, stable, and reproducible applications in Javascript for sharing, presenting, browsing, and analyzing digital editions of texts, on a foundation of self-describing plain-text libraries.

In that repository, the directory `ai_queries` has a record of (my side of) our conversation thus far. 

The API documentation, evolving as the code is built, is at `apis.md`.

Our last conversation was at <https://x.com/i/grok/share/9bdf8712ed684d71876d9f1bbe8538ab>.

The Classes we have worked on thus far at:

- `CtsUrn`
- `CtsPassage`
- `CtsCorpus`
- `CtsCatalogEntry`

We had gotten to the point where `CtsUrn.js`, `CtsPassage.js`, and `CtsCorpus.js` were working well enough to proceed, and `apis.js` was an accurate reflection of the code. You had helped me flesh out the code for `CtsCatalogEntry`, with some tests.

## What I have done since we talked

I have gone through the code in `js/` and normalized Class properties to camel-case. Any Class that has a `CtsUrn` as a property-value now names that property `ctsUrn` (as opposed to `urn`). 

With the exception of `CtsUrn.getPassage()`, which returns `""` instead of `null`, we accessing properties by grabbing them directly, without a `getFoo()` function.

For `CtsCatalogEntry`, I renamed the properties according to how they have been named for some years in `CEX` serializations (stupid of me not to have done that initially):

	urn#citationScheme#groupName#workTitle#versionLabel#exemplarLabel#online#lang

All four libraries are passing all their tests.

I believe that that API in `apis.md` reflects this.

I have added tests for the `CtsCatalogEntry` code you gave me. 

## Specific request

- `CtsLibrary` - Conbines a `CtsCatalog` with a `CtsCorpus`.

I have tried to write this up in `apis.md`, clearly and consistently.

The spec starts, in `apis.md` with:

~~~markdown
## CTS Data & Metadata: The `CtsLibrary` Class
~~~

Before adding any code or tests, let's do this properly by making sure the specification is clear and consistant. If you would take a look at it with an eye for detail and best-practices, I would welcome your suggestions.

Thanks!