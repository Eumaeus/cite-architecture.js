
# `cite-architecture.js` API Documentation

This library provides tools for parsing, validating, comparing, and retrieving data associated with the CITE Architecture, consisting of CTS (Canonical Text Services) URNs, CITE2 URNs, and the CEX format for serialization.

## Table of Contents

[ TBD Table of Contents Here]

---

## CEX Libraries

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

## The CtsUrn Class

Functions for working with Canonical Text Services (CTS) URNs.
CTS URNs have 5 components: `urn:cts:<namespace>:<bibliographic-component>:<passage-component>`

### CtsUrn Properties

CtsUrn PropertiesAfter successful construction from a valid CTS URN string, a CtsUrn instance exposes the following properties:urnstring (string): The canonical string form of the URN.
nid (string): The URN namespace identifier (always "cts", lower-cased).
nss (string): The CTS namespace (e.g. "greekLit").
textgroup (string): First component of the bibliographic hierarchy.
workid (string | undefined): Second component of the bibliographic hierarchy (if present).
version (string | undefined): Third component of the bibliographic hierarchy (if present).
exemplar (string | undefined): Fourth component of the bibliographic hierarchy (if present).
passage (string | undefined): The passage reference component (may contain . separators, - for ranges, or @ for subreferences). undefined if absent.
bibliocomponent (string[]): Array representing the bibliographic hierarchy in order, e.g. ["tlg0012", "tlg001", "msA"].


### CtsUrn Methods

ClassificationhasPassage() → boolean: Returns true if the URN has a non-empty passage component.
isRange() → boolean: Returns true if the passage component identifies a range (contains -).
isWorkUrn() → boolean: Returns true if the URN identifies a text only at the work level (no version or exemplar).
isVersionUrn() → boolean: Returns true if the URN identifies a text at the version level (has version, no exemplar).
isExemplarUrn() → boolean: Returns true if the URN identifies a text at the exemplar level.

Citation DepthpassageDepth() → number: Returns the number of dot-separated fields in a non-range passage component. Throws CtsUrnError on ranges (use rangeDepth() instead).
rangeDepth() → [number, number]: For range URNs, returns a two-element array containing the citation depths of the start and end passages.

Comparisonequals(other: CtsUrn) → boolean: Returns true if the two URNs are identical as strings.
versionEquals(other: CtsUrn) → boolean: Returns true if the two URNs are equal when both are reduced to the version level.
isCongruentWith(other: CtsUrn) → boolean: Returns true if the two URNs can be considered to identify "the same thing" under CITE congruence rules (matching namespace, compatible bibliographic prefixes, compatible passage prefixes, and matching range status). Full semantics are documented in the method implementation.

Manipulation (present in current implementation)psgStringDepth(passageString: string, depth: number) → string: Returns the first depth dot-separated components of the given passage string.
passageToDepth(depth: number) → string: Returns a new CTS URN string with the passage component truncated to the specified depth.
splitRange() → [CtsUrn, CtsUrn]: For range URNs, returns an array of two CtsUrn objects representing the start and end of the range.


---

## CTS Data Retrieval: The `CtsCorpus` Class.

[ TBD Description of `CtsCorpus` Class here. ]

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

## Special Collection Properties: The `CiteDataModels` Class.

[ TBD Description of `CiteDataModels` Class here. ]
