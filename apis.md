
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

[ TBD Description of CtsUrn properties here. ]

### CtsUrn Methods

[ TBD Description of CtsUrn methods here. ]

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
