You have been helping me with a project to implement a Javascript code library for the CITE Architecture. The project is in a repository at: <https://github.com/Eumaeus/cite-architecture.js>.

The point of all of this work is to enable building cool, useful, stable, and reproducible applications in Javascript for sharing, presenting, browsing, and analyzing digital editions of texts, on a foundation of self-describing plain-text libraries.

In that repository, the directory `ai_queries` has a record of (my side of) our conversation thus far. 

The API documentation, evolving as the code is built, is at `apis.md`.

Our last conversation was at <https://x.com/i/grok/share/5fe50d56aabe4f038b2b796dc4a3ca97>.

We were working on the `CtsCorpus.getValidReff()`, `CtsCorpus.countValidReff()`, and `CtsCorpus.isValidRef()` methods.

## What I have done since we talked

I added the `CtsCorpus.getValidReff()`, `CtsCorpus.countValidReff()`, and `CtsCorpus.isValidRef()` methods to `js/ctscorpus.js`.

I started writing tests for this.

Without much suprise I learned that I need better logic for URN comparison, which is in `js/ctsurn.js`.

The problem is simple: 

1. `CtsUrn.isCongruentWith(other)` is too permissive, being bi-directionarl.
2. `CtsUrn.passageContains(other)` is too restrictive, insisting that the `urn.bibliocomponent` properties of both `this` and `other` match.

`CtsCorpus.getValidReff()` was using `CtsUrn.passageContains(other)`, which would prevent `urn:cts:greekLit:tlg0012.tlg001.murray.tok:1.1` from being returned when `urn:cts:greekLit:tlg0012.tlg001.murray:` was a parameter, as it ought to be.

Making `CtsCorpus.getValidReff()` use `CtsUrn.isCongruentWith(other)` would cause the reverse problem. With `urn:cts:greekLit:tlg0012.tlg001.murray.tok:` as a parameter, the fuction would return `urn:cts:greekLit:tlg0012.tlg001.murray:1.1`, as it should *not*.

I have renamed the (now former) method `CtsUrn.isCongruentWith(other)` to `areCongruent(other)`, to reflect its bi-directionality.

I have written a new, directional, `isCongruentWith(other)`. I have tested these and updated `apis.md` with an explanation of how they work.



