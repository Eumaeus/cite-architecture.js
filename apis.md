
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

### The `#!citelibrary` Block

[ TBD Description of `#!citelibrary` block here. ]

---

## The `CtsUrn` Class

Functions for working with Canonical Text Services (CTS) URNs.
CTS URNs have 5 components: `urn:cts:<namespace>:<bibliographic-component>:<passage-component>`

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

### `CtsPassage` Properties.

The `CtsPassage` constructor accepts a `CtsUrn` object and a `string` and exposes the following read-only instance properties:

`urn` - The `CtUrn` citation.
`text` - The text of the passage.

### `CtsPassage` Methods.

The `CtsPassage` class provides the following instance methods. The original object is never mutated. Methods that cannot succeed throw a `CtsPassageError` with a descriptive message.

`getUrn()` - Returns the `CtsUrn` citation of the passage. Functionally equivalent to accessing the `.urn` property.

`getText()` - Returns the text of the passage. Functionally equivalent to accessing the `.text` property.

`toString(delimiter:char = '#')` - Returns a `string` serializing the `urn` and `text` separated by `delimiter`. The optional `delimiter` parameter defaults to the character `'#'`.

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

### `CtsCorpus` Properties.

The `CtsCorpus` constructor accepts an `Array[CtsPassage]` and exposes the following read-only instance properties:

`passages` - The Array of passages.
`length` - The number of passages in the array.

### `CtsCorpus` Methods.

The `CtsCorpus` class provides the following instance methods. All manipulation methods return new `CtsCorpus` instances (the original object is never mutated). Methods that cannot succeed throw a `CtsCorpusError` with a descriptive message.

`getText(urn: CtsUrn)` - Retrieves passages whose `urn` property is **congruent** with a given CTS URN.

### CtsCorpus Properties

### CtsCorpus Methods

Retrieves passages from a pipe-delimited (`|`) text corpus that match a given CTS URN. The first column of the corpus is assumed to be a CTS URN, and the second is the text content. The first line of `corpusDataString` is skipped (assumed header).


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
