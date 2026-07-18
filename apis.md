
# `cite-architecture.js` API Documentation

This library provides tools for parsing, validating, comparing, and retrieving data associated with the CITE Architecture, consisting of CTS (Canonical Text Services) URNs, CITE2 URNs, and the CEX format for serialization.

## Table of Contents

[ TBD Table of Contents Here]

---

## The `CiteCex` Class

- `citelibrary`: Describes the current CEX file
- `ctscatalog`: Metadata for texts represented in #!ctsdata corpora.
- `ctsdata`: A corpus of passages of text, in text order (important!), cited by CtsUrn.
- `citecollections`: A list of, and metadata for, collections of objects with defined properties.
- `citeproperties`: A list of properties shared by objects in a CITE Collection; each property is identified by a Cite2Urn that is an extension of a collection's URN.
- `citedata`: a list of objects and their property-values, cited by Cite2Urn
- `datamodels`: Allow further specification for properties in CITE Collection Objects. For example, using `datamodesl` we can identify a specific property of type `text` as, further, containing Markdown, GEO-JSON, an HTTP link, etc.
- `relations`: Triplets relating one URN (CtsUrn or Cite2Urn) to another, with a relation defined by a Cite2Urn.

### Validity of a CEX Library

- A CEX file is plain-text, UTF-8, the equivalent of `text/plain; charset=utf-8`, although this is not stated explicitly in contents of the CEX file.
- Each block of data is preceded by a header-line beginning with `#!`.
- Commented line `//` and blank lines are ignored in processing.
- There may be zero or one `#!citelibrary` blocks.
- There may be zero or more `#!ctscatalog` blocks.
- There may be zero or more `#!ctsdata` blocks. There *should* be a `#!ctscatalog` block describing any cited passage in any `#!ctsdata` block.
- There may be zero or more `#!citecollections` blocks.
- There may be zero or more `#!citeproperties` blocks. There *should* be a `#!citeproperty` block documenting the properties for every CITE Collection in any present `#!citecollections` block.
- There may be zero or more `#!citedata` blocks. There *should* be a `#!citeproperty` block documenting the properties for any cited object in any `#!citedata` block. There *should* be a `#!citecollections` block documenting the collection containing any cited object in any `#!citedata` block.

**Note on *should*:** A CEX Library is intended to be entirely self-describing. For expedience in a specific application context, a CEX Library *may* containing only a `#!ctsdata` block or only a `#!citedata` block. 

### The Blocks of a CEX File

#### The `#!citelibrary` Block

[ TBD Description of `#!citelibrary` block here. ]

#### The `#!ctscatalog` Block

[ TBD Description of `#!ctscatalog` block here. ]

#### Ths `#!ctsdata` Block

[ TBD Description of `#!ctsdata` block here. ]

#### Ths `#!citecollections` Block

[ TBD Description of `#!citecollections` block here. ]

#### Ths `#!citeproperties` Block

[ TBD Description of `#!citeproperties` block here. ]

#### Ths `#!citedata` Block

[ TBD Description of `#!citedata` block here. ]

#### Ths `#!datamodels` Block

[ TBD Description of `#!datamodels` block here. ]

#### Ths `#!relations` Block

[ TBD Description of `#!relations` block here. ]

---

## The `CtsUrn` Class

A CTS-URN (Canonical Text Services URN) is a machine-actionable identfier for *identification and retrieval of passages of text* where "text" is defined as "an ordered hierarchy of citation-objects."

This library offers functions for working with CTS URNs.

CTS URNs have 5 components: `urn:cts:<namespace>:<bibliographic-component>:<passage-component>`

This library implements this with the `CtsUrn` class.

Create a new `CtsUrn` object with:

~~~javascript

my_ctsurn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1-1.10");

~~~

### `CtsUrn` Properties

The `CtsUrn` constructor parses and validates a Canonical Text Services (CTS) URN string and exposes the following read-only instance properties:

`nid` — Namespace identifier (always "cts", lower-cased).

`nss` — Namespace-specific string (*e.g.*, "greekLit").

`textgroup` — Required first component of the bibliographic hierarchy.

`workid` — Optional second component of the bibliographic hierarchy.

`version` — Optional third component of the bibliographic hierarchy.

`exemplar` — Optional fourth component of the bibliographic hierarchy.

`passage` — Optional passage component (a string of dot-separated labels). May contain a single hyphen to denote a range. `undefined` when no passage component is present.

`urnstring` — The canonical input string (trimmed).

`bibliocomponent` — Array of the dot-separated parts of the bibliographic component (in order).

*Note on sub-referencing:* This JavaScript implementation does not support CTS URN sub-referencing using the @ syntax or bracketed indices (e.g., [1]). Such constructs are not parsed or preserved.All properties are set during construction. The constructor throws a CtsUrnError for any invalid input.

### `CtsUrn` Methods

The `CtsUrn` class provides the following instance methods. All manipulation methods return new `CtsUrn` instances (the original object is never mutated). Methods that cannot succeed throw a `CtsUrnError` with a descriptive message.

**Classification**

`hasPassage()` — Returns `true` if a passage component is present.

`isRange()` — Returns `true` if the passage component contains a hyphen (range syntax).

`isTextGroupUrn()` — Returns `true` only if the URN is at the textgroup level (no `workid`).

`isWorkUrn()` — Returns `true` only if the URN is at the work level (has workid but no `version`).

`isVersionUrn()` — Returns `true` only if the URN is at the version level (has version but no `exemplar`).

`isExemplarUrn()` — Returns `true` only if the URN is at the exemplar level.

`passageDepth()` — Returns the number of dot-separated fields in the passage component (non-range URNs only).

`rangeDepth()` — Returns a two-element array [startDepth, endDepth] for range URNs.

**Comparison**

`equals(other: CtsUrn)` — Returns `true` if the two URNs have identical canonical string representations.

`versionEquals(other: CtsUrn)` — Returns `true` if the two URNs are identical when both are reduced to version level.

`isCongruentWith(other: CtsUrn)` — Returns `true` if the URNs identify the same content under hierarchical prefix-matching rules for both bibliographic and passage components (ranges must match ranges).

`passageEquals(other: CtsUrn)` — Returns `true` if the bibliographic hierarchy of this includes that of `other` and their passage components are identical.

`passageIncludes(other: CtsUrn)` - Returns `true` if the bibliographic hierarchies of the two URNs match, and if the passage-component of `this` "includes" the passage-component of `other`. **This a the function most likely to be used in most applications, for retrieving text from a corpus.**

**Retrieval**

`toString()` — Returns the canonical URN string (also used for primitive coercion via Symbol.toPrimitive).

`getPassage()` — Returns the passage component as a string, or an empty string if none is present.

**Manipulation**

`dropPassage()` — Returns a new CtsUrn with the passage component removed (always terminated by `:`).

`replacePassage(newPassage: string)` — Returns a new CtsUrn with the passage component replaced.

`splitRange()` — For range URNs, returns a two-element array containing the start and end CtsUrn objects.

`rangeFrom()` / `rangeStart()` — Returns the starting CtsUrn of a range.

`rangeTo()` / `rangeEnd()` — Returns the ending CtsUrn of a range.

`makeRange(other: CtsUrn)` — Constructs a new range URN spanning from this (or its start) to other (or its end).

`versionLevelUrn()` — Returns a new CtsUrn reduced to the version level (drops passage and any exemplar).

`workLevelUrn()` — Returns a new CtsUrn reduced to the work level.

`versionFromExemplar()` — For exemplar-level URNs, returns the corresponding version-level URN (preserves passage if present).

`addExemplar(exemplarId: string)` — Adds (or replaces) the exemplar component on a version-or-higher URN.

`addPassage(psgString: string)` — Adds (or replaces) the passage component after validating its format.

`chopPassage()` — Returns a new CtsUrn with the passage hierarchy reduced by one level (single passages only; drops passage entirely at depth 1).

`extendPassage(citeString: string)` — Extends the passage hierarchy by one level with the supplied label (single passages only).

`passageToDepth(depth: number)` — Reduces the passage hierarchy (both sides of a range) to the specified depth.

`equalizePassageDepths(other: CtsUrn)` — Returns a pair of CtsUrn objects with passages chopped to the minimum common depth.


---

## CTS Data: The `CtsPassage` Class.

A `CtsPassage` unites text-content with a citation. A `CtsPassage` object has two components:

1. A `CtsUrn` (which may **not** be a range-urn).
2. A `string`.

Create a new `CtsPassage` object with, *e.g.*:

~~~javascript

my_ctsurn = new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1");
my_text = "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος";

my_ctspassage = new CtsPassage(my_ctsurn, my_text);

~~~

### `CtsPassage` Validation

The constructor validates its input `ctsurn, text` and throws a `CtsPassageError` on failure. 

- `ctsurn` must not be a range-urn.
- The `bibliocomponent` of `ctsurn` must be at the version-level or exemplar-level.
- `text` must be of type `string`.
- `text` may not be empty or consisting only of white-space.

### `CtsPassage` Properties.

The `CtsPassage` constructor accepts a `CtsUrn` object and a `string` and exposes the following read-only instance properties:

`urn` - The `CtsUrn` citation.
`text` - The text of the passage.

### `CtsPassage` Methods.

The `CtsPassage` class provides the following instance methods. The original object is never mutated. Methods that cannot succeed throw a `CtsPassageError` with a descriptive message.

`getUrn()` - Returns the `CtsUrn` citation of the passage. Functionally equivalent to accessing the `.urn` property.

`getText()` - Returns the text of the passage. Functionally equivalent to accessing the `.text` property.

`toString(delimiter:char = '#')` - Returns a `string` serializing the `urn` and `text` separated by `delimiter`. The optional `delimiter` parameter defaults to the character `'#'`.

`equals(other: CtsPassage)` - Uses this `toString()` methods of `this` and `other` to judge equality.

---

## CTS Data Retrieval: The `CtsCorpus` Class.

A `CtsCorpus` is an Array of `CtsPassage` objects. 

**The order of the elements in the array is significant.**

Create a new `CtsCorpus` object with:

~~~javascript

psg1 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.1"), "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος");
psg2 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.2"),  "οὐλομένην, ἣ μυρί’ Ἀχαιοῖς ἄλγε’ ἔθηκε,");
psg3 = new CtsPassage(new CtsUrn("urn:cts:greekLit:tlg0012.tlg001.allen:1.3"), "πολλὰς δ’ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν");

my_ctscorpus = new CtsCorpus([ psg1, psg2, psg3]);

~~~

### `CtsCorpus` Validation

The constructor validates its input `Array[CtsPassage]` and throws a `CtsCorpusError` on failure. 

For validation purposes:

- A “text” is the set of all passages in the corpus whose URNs mutually satisfy `CtsUrn.biblMatches(other)`.
- A `CtsCorpus` may contain passages from multiple texts.
- All passages belonging to the same text must appear as a single contiguous block in the array (texts may not be interleaved).
- Every passage in the corpus must have a unique `CtsUrn`.
- Every passage in the corpus must be a node-level (atomic) citation: for any two distinct passages `u1` and `u2` in the corpus, `u1.passageContains(u2)` must be `false`. (In other words, no passage citation in the corpus may hierarchically contain another passage citation in the same corpus.)
- The relative order of passages within each text block is assumed to reflect the canonical reading order of the source text. This assumption cannot be automatically validated and is the responsibility of the creator of the corpus.


### `CtsCorpus` Properties.

The `CtsCorpus` constructor accepts an `Array[CtsPassage]` and exposes the following read-only instance properties:

`passages` - The Array of passages.

`length` - The number of passages in the array.

### `CtsCorpus` Methods.

The `CtsCorpus` class provides the following instance methods. All manipulation methods return new `CtsCorpus` instances (the original object is never mutated). Methods that cannot succeed throw a `CtsCorpusError` with a descriptive message.

### CtsCorpus Methods

`toString(delimiter: Char = '#')` - Serialized a corpus into a string, with passages separated by `\n`. Uses `CtsPassage.getString(delimiter = '#')` by passing on the value of `delimeter`.
`getText(urn: CtsUrn)::CtsCorpus` - Uses `CtsUrn.passageContains(urn)` to filter the corpus for passages; returns those passages as a `CtsCorpus`.
`findPassages(urn: CtsUrn)::CtsCorpus` - Using the concept of "congruity" and `CtsUrn.isCongruentWith(urn)` to find matching passages; constructs of `CtsCorpus` of them.
`getValidReff(urn: CtsUrn [optional])::Array[CtsUrn]` - Delivers an array of `CtsUrn`. Without the optional parameter, lists all urns present in the corpus. With the parameter, uses `CtsUrn.passageContains(urn)` as a filter.
`countValidReff(urn: CtsUrn)::Int` - Like `getValidReff()`, but simply reports the number of matches.
`listTexts(urn: CtsUrn [optional])::Array[CtsUrn]` - Lists the texts present in the corpus, based on the `CtsUrn.bibliocomponent` property of each passage's urn.
`isValidRef(urn: CtsUrn)::Boolean` - Returns `true` if this *exact* urn is present in the corpus.
`isValidRange(urn: CtsUrn)::Boolean` - Returns `true` if there is a passage in the corpus that matches the start of the range, and one that matches the end of the range.
`getPrevRef(urn: CtsUrn)::CtsUrn` - Gets the urn of the passage preceding the given urn in the corpus. Returns `null` if the urn points to the first passage of the corpus.
`getNextRef(urn: CtsUrn)::CtsUrn` - Gets the urn of the passage following the given urn in the corpus. Returns `null` if the urn points to the last passage of the corpus.
`getPrev(urn:CtsUrn)::CtsPassage` - Gets the passage preceding the passage with the given urn in the corpus. Returns `null` if the urn points to the first passage of the corpus.
`getNext(urn: CtsUrn)::CtsPassage` - Gets the passage following the passage with the given urn in the corpus. Returns `null` if the urn points to the last passage of the corpus.
`textCorpora()::Array[CtsCorpus]` - Returns an `Array[CtsCorpus]` with one `CtsCorpus` for each "text" (see definition above) present in the corpus.
`corpusRange()::CtsUrn` - Returns a `CtsUrn` identifying the range of corpus, from the first passage to the last. **`corpusRange()` throws an error if corpus contains more than one "text".**
`slideRange(urn:CtsUrn, step:Int)::CtsCorpus` - Based on the start- and end-passages of the given range-urn, return a corpus whose starting passage and ending passage are `step` passages. A positive `step` moves forward, toward the end of the corpus; a negative `step` moves backwards, toward the beginning of the corpus. If the requested range cannot move `step` steps because of the beginning or end of the corpus, return `null`.
`slideRangeUrn(urn:CtsUrn, step:Int)::CtsUrn` - Like `slideRange()`, but returns only a `CtsUrn` identifying the new range.
`getFirstRef(urn: CtsUrn [optional])` - Returns the citation to the first passage of the corpus. If a `CtsUrn` is given, returns the first citationn *congruent* to the parameter-urn.
`getFirstText` - Like `getFirstRef()`, but returns the whole `CtsPassage`.

### CtsCorpus Helper Function

`ctsCorpusFromString(corpusString: String, delimiter = '#'):: CtsCorpus` - The `CtsCorpus` constructor expect an `Array[CtsPassage]`. This function takes a string consisting of lines, each of urn-strings and text-strings, separated by `delimiter`, translates these into an `Array[CtsPassage]`, and constructs a `CtsCorpus`.

---

## The Cite2Urn Class

Functions for working with CITE2 URNs.
CITE2 URNs have 5 components: `urn:cite2:<namespace>:<collection-component>:<object-component>`

### Cite2Urn Properties

[ TBD Description of Cite2Urn properties here. ]

### Cite2Urn Methods

[ TBD Description of Cite2Urn methods here. ]

---

## CITE2 Data Retrieval: The `CiteCollection` Class.

[ TBD Description of `CiteCollection` Class here. ]

---

## CTS and CITE2 Data Aggregation: The `CiteRelations` Class.

[ TBD Description of `CiteRelations` Class here. ]

---

## Special Collection Properties: The `CiteDataModel` Class.

[ TBD Description of `CiteDataModel` Class here. ]
